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
      const minimaxModel = data.model_remains?.find(m => m.model_name.startsWith('MiniMax-M'));

      if (!minimaxModel) return null;

      const fiveHourUsed = minimaxModel.current_interval_total_count - minimaxModel.current_interval_usage_count;
      const sevenDayUsed = minimaxModel.current_weekly_total_count - minimaxModel.current_weekly_usage_count;
      const fiveHourTotal = minimaxModel.current_interval_total_count;
      const sevenDayTotal = minimaxModel.current_weekly_total_count;

      return {
        fiveHour: fiveHourTotal > 0 ? Math.round((fiveHourUsed / fiveHourTotal) * 100) : null,
        sevenDay: sevenDayTotal > 0 ? Math.round((sevenDayUsed / sevenDayTotal) * 100) : null,
        fiveHourResetAt: null,
        sevenDayResetAt: null,
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
