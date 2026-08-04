/**
 * MiniMax API client
 */

import * as https from 'https';
import type { MiniMaxApiResponse, UsageData } from './types.js';

// ============================================================================
// API Client
// ============================================================================

export function fetchMiniMaxUsage(apiKey: string): Promise<MiniMaxApiResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.minimaxi.com',
      path: '/v1/api/openplatform/coding_plan/remains',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'minimax-hud/1.0',
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

// ============================================================================
// Usage Data
// ============================================================================

export function getUsageData(apiKey: string): Promise<UsageData | null> {
  return fetchMiniMaxUsage(apiKey)
    .then(data => {
      if (!data.model_remains?.length) return null;

      // Find 'general' model (M3 era) or any MiniMax-M prefixed model (legacy)
      const model = data.model_remains.find(m => m.model_name === 'general')
        ?? data.model_remains.find(m => m.model_name.startsWith('MiniMax-M'))
        ?? data.model_remains[0];

      if (!model) return null;

      // Prefer precomputed remaining_percent fields when available (avoids divide-by-zero on token-less plans)
      const fiveHourPct = model.current_interval_remaining_percent != null
        ? 100 - model.current_interval_remaining_percent
        : model.current_interval_total_count > 0
          ? Math.round(((model.current_interval_total_count - model.current_interval_usage_count) / model.current_interval_total_count) * 100)
          : null;

      const sevenDayPct = model.current_weekly_remaining_percent != null
        ? 100 - model.current_weekly_remaining_percent
        : model.current_weekly_total_count > 0
          ? Math.round(((model.current_weekly_total_count - model.current_weekly_usage_count) / model.current_weekly_total_count) * 100)
          : null;

      // Normalize timestamps: API may return seconds or milliseconds
      const toDate = (ts?: number): Date | null =>
        ts ? new Date(ts < 1e12 ? ts * 1000 : ts) : null;

      return {
        fiveHour: fiveHourPct,
        sevenDay: sevenDayPct,
        fiveHourResetAt: toDate(model.end_time),
        sevenDayResetAt: toDate(model.weekly_end_time),
        fiveHourRemainMs: model.remains_time ?? null,
        sevenDayRemainMs: model.weekly_remains_time ?? null,
      };
    })
    .catch(err => {
      return {
        fiveHour: null,
        sevenDay: null,
        fiveHourResetAt: null,
        sevenDayResetAt: null,
        apiUnavailable: true,
        apiError: err.message,
      };
    });
}
