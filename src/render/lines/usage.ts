/**
 * Usage line renderer
 */

import type { RenderContext } from '../../types.js';
import { RESET, DIM, getUsageColor, RED, YELLOW } from '../../colors.js';
import { t } from '../../i18n/index.js';
import { quotaBar } from '../utils.js';

export function renderUsageLine(ctx: RenderContext): string | null {
  const { usageData, config } = ctx;
  if (!config.display.showUsage || !usageData) return null;

  const tr = t(config.language);
  const parts: string[] = [];

  // 5 hour usage
  const fiveHourPct = usageData.fiveHour ?? 0;
  const usageLabel = fiveHourPct >= 90
    ? `${RED}${tr.usageWarning}${RESET}`
    : `${DIM}${tr.usage}${RESET}`;

  if (config.display.usageBarEnabled) {
    parts.push(`${usageLabel} ${quotaBar(fiveHourPct)} ${getUsageColor(fiveHourPct)}${fiveHourPct}%${RESET}${DIM} ${tr.per5h}${RESET}`);
  } else {
    parts.push(`${usageLabel} ${getUsageColor(fiveHourPct)}${fiveHourPct}%${RESET}${DIM} ${tr.per5h}${RESET}`);
  }

  // 7 day usage (show when above threshold)
  const sevenDayPct = usageData.sevenDay ?? 0;
  if (sevenDayPct >= config.display.sevenDayThreshold) {
    if (config.display.usageBarEnabled) {
      parts.push(`${quotaBar(sevenDayPct)} ${getUsageColor(sevenDayPct)}${sevenDayPct}%${RESET}${DIM} ${tr.per7d}${RESET}`);
    } else {
      parts.push(`${getUsageColor(sevenDayPct)}${sevenDayPct}%${RESET}${DIM} ${tr.per7d}${RESET}`);
    }
  }

  return parts.join(' ');
}
