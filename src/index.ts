#!/usr/bin/env node

/**
 * MiniMax HUD - A lightweight status line for MiniMax Coding Plan users
 *
 * Features:
 * - Context window usage bar with token count
 * - 5-hour and 7-day quota display
 * - Git status (branch, dirty, ahead/behind)
 * - Tool activity tracking
 * - Agent status display
 * - Todo progress display
 * - Color-coded warnings for high usage
 * - Project path display
 * - i18n support (English/Chinese)
 *
 * Install:
 * 1. Build: npm run build
 * 2. Copy dist/index.js to ~/.claude/plugins/marketplaces/minimax-hud/dist/
 * 3. Add to ~/.claude/settings.json:
 *    {
 *      "statusLine": {
 *        "command": "bash -c '\"/path/to/node\" \"/path/to/index.js\"'",
 *        "type": "command"
 *      }
 *    }
 */

import { parseStdin } from './stdin.js';
import { parseTranscript } from './transcript.js';
import { getGitStatus } from './git.js';
import { loadConfig } from './config.js';
import { readCache, writeCache } from './cache.js';
import { fetchMiniMaxUsage } from './api.js';
import { render } from './render/index.js';
import { t } from './i18n/index.js';
import type { UsageCache, RenderContext } from './types.js';

// ============================================================================
// Helpers
// ============================================================================

function getEnv(key: string): string | undefined {
  return process.env[key];
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  try {
    // Load config
    const config = loadConfig();
    const tr = t(config.language);

    // Parse stdin
    const stdin = await parseStdin();

    // Check if initialized (empty stdin)
    if (!stdin.cwd && !stdin.model && !stdin.context_window) {
      console.log(`${tr.init}`);
      return;
    }

    // Get API key
    const apiKey = getEnv('ANTHROPIC_AUTH_TOKEN');
    if (!apiKey) {
      console.log(`${tr.noApiKey}`);
      return;
    }

    // Fetch usage (with cache)
    let usageData = readCache() as UsageCache | null;

    if (!usageData) {
      try {
        const response = await fetchMiniMaxUsage(apiKey);
        const minimaxModel = response.model_remains?.find(m => m.model_name.startsWith('MiniMax-M'));

        if (minimaxModel) {
          const fiveHourUsed = minimaxModel.current_interval_total_count - minimaxModel.current_interval_usage_count;
          const fiveHourTotal = minimaxModel.current_interval_total_count;
          const sevenDayUsed = minimaxModel.current_weekly_total_count - minimaxModel.current_weekly_usage_count;
          const sevenDayTotal = minimaxModel.current_weekly_total_count;

          usageData = {
            fiveHourUsed,
            fiveHourTotal,
            sevenDayUsed,
            sevenDayTotal,
          };
          writeCache(usageData);
        }
      } catch (e) {
        console.log(`${tr.fetchFailed}: ${(e as Error).message}`);
        return;
      }
    }

    if (!usageData) {
      console.log(`${tr.noUsageData}`);
      return;
    }

    // Calculate percentages
    const fiveHourPct = usageData.fiveHourTotal > 0
      ? Math.round((usageData.fiveHourUsed / usageData.fiveHourTotal) * 100)
      : 0;
    const sevenDayPct = usageData.sevenDayTotal > 0
      ? Math.round((usageData.sevenDayUsed / usageData.sevenDayTotal) * 100)
      : 0;

    // Build usage data for render
    const usage = {
      fiveHour: fiveHourPct,
      sevenDay: sevenDayPct,
      fiveHourResetAt: null as Date | null,
      sevenDayResetAt: null as Date | null,
    };

    // Parse transcript for tools, agents, todos
    const transcriptPath = stdin.transcript_path;
    const transcript = transcriptPath
      ? await parseTranscript(transcriptPath)
      : { tools: [], agents: [], todos: [] };

    // Get git status
    let gitStatus = null;
    if (stdin.cwd && config.gitStatus.enabled) {
      gitStatus = await getGitStatus(stdin.cwd);
    }

    // Build render context
    const ctx: RenderContext = {
      stdin,
      transcript,
      gitStatus,
      usageData: usage,
      config,
      extraLabel: null,
    };

    // Render
    render(ctx);

  } catch (error) {
    console.log(`[minimax-hud] Error: ${(error as Error).message}`);
  }
}

main();
