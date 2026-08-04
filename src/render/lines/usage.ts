/**
 * Usage line renderer
 */

import type { RenderContext } from '../../types.js';
import { RESET, DIM, getUsageColor, RED, YELLOW } from '../../colors.js';
import { t } from '../../i18n/index.js';
import { quotaBar, formatRemainDuration } from '../utils.js';

/**
 * Pick the best available source for "time until reset":
 * 1) explicit `remainMs` from the API (`remains_time` / `weekly_remains_time`)
 * 2) recomputed from `resetAt - now` (works even when only end_time is set)
 */
function getRemainMs(resetAt: Date | null, remainMs: number | null | undefined): number | null {
  if (typeof remainMs === 'number' && remainMs > 0) return remainMs;
  if (resetAt) {
    const diff = resetAt.getTime() - Date.now();
    return diff > 0 ? diff : null;
  }
  return null;
}

export function renderUsageLine(ctx: RenderContext): string | null {
  const { usageData, config } = ctx;
  if (!config.display.showUsage || !usageData) return null;

  const tr = t(config.language);
  const lang = config.language;
  const parts: string[] = [];

  // 5 hour usage
  const fiveHourPct = usageData.fiveHour ?? 0;
  const usageLabel = fiveHourPct >= 90
    ? `${RED}${tr.usageWarning}${RESET}`
    : `${DIM}${tr.usage}${RESET}`;

  const fiveHourMs = getRemainMs(usageData.fiveHourResetAt, usageData.fiveHourRemainMs);
  const fiveHourReset = fiveHourMs != null
    ? `${DIM} ${tr.resetVerb} ${formatRemainDuration(fiveHourMs, lang)}${tr.resetsIn}${RESET}`
    : '';

  if (config.display.usageBarEnabled) {
    parts.push(`${usageLabel} ${quotaBar(fiveHourPct)} ${getUsageColor(fiveHourPct)}${fiveHourPct}%${RESET}${DIM} ${tr.per5h}${RESET}${fiveHourReset}`);
  } else {
    parts.push(`${usageLabel} ${getUsageColor(fiveHourPct)}${fiveHourPct}%${RESET}${DIM} ${tr.per5h}${RESET}${fiveHourReset}`);
  }

  // 7 day usage (show when above threshold)
  const sevenDayPct = usageData.sevenDay ?? 0;
  if (sevenDayPct >= config.display.sevenDayThreshold) {
    const sevenDayMs = getRemainMs(usageData.sevenDayResetAt, usageData.sevenDayRemainMs);
    const sevenDayReset = sevenDayMs != null
      ? `${DIM} ${tr.resetVerb} ${formatRemainDuration(sevenDayMs, lang)}${tr.resetsIn}${RESET}`
      : '';

    if (config.display.usageBarEnabled) {
      parts.push(`${quotaBar(sevenDayPct)} ${getUsageColor(sevenDayPct)}${sevenDayPct}%${RESET}${DIM} ${tr.per7d}${RESET}${sevenDayReset}`);
    } else {
      parts.push(`${getUsageColor(sevenDayPct)}${sevenDayPct}%${RESET}${DIM} ${tr.per7d}${RESET}${sevenDayReset}`);
    }
  }

  return parts.join(' ');
}
