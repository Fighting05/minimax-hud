/**
 * Render utilities
 */

import { getUsageColor } from '../colors.js';

/**
 * Format token count for display
 */
export function formatTokens(n: number): string {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return n.toString();
}

/**
 * Render a quota bar
 */
export function quotaBar(percent: number, width: number = 10): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return `${getUsageColor(percent)}${'█'.repeat(filled)}${'\x1b[2m'}${'░'.repeat(empty)}${'\x1b[0m'}`;
}

/**
 * Format a quota reset time for the status line.
 * Within 24h → "HH:mm"; otherwise → "M/D HH:mm".
 */
export function formatResetTime(resetAt: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const hhmm = `${pad(resetAt.getHours())}:${pad(resetAt.getMinutes())}`;
  const diffMs = resetAt.getTime() - Date.now();
  if (diffMs < 24 * 60 * 60 * 1000) return hhmm;
  return `${resetAt.getMonth() + 1}/${resetAt.getDate()} ${hhmm}`;
}

/**
 * Format a remaining duration for the status line.
 * zh: "1小时51分后"; en: "1h 51m".
 * Picks the largest sensible unit; drops zero leading units.
 */
export function formatRemainDuration(ms: number, lang: 'zh' | 'en' = 'en'): string {
  if (!Number.isFinite(ms) || ms <= 0) return lang === 'zh' ? '即将' : 'now';

  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (lang === 'zh') {
    const parts: string[] = [];
    if (days) parts.push(`${days}天`);
    if (hours) parts.push(`${hours}小时`);
    if (minutes || (!days && !hours)) parts.push(`${minutes}分`);
    return parts.join('');
  }

  // en — compact "1d 2h 3m" form
  if (days) return `${days}d ${hours}h`;
  if (hours) return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  if (minutes) return `${minutes}m`;
  return `${seconds}s`;
}
