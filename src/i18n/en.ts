/**
 * English translations
 */

export const en = {
  // Init
  init: '[minimax-hud] Init...',

  // No data
  noApiKey: '[minimax-hud] No API key',
  noUsageData: '[minimax-hud] No usage data',
  fetchFailed: '[minimax-hud] Failed to fetch',

  // Labels
  usage: 'Usage',
  usageWarning: '⚠ Usage',
  per5h: '/ 5h',
  per7d: '/ 7d',

  // Context
  context: 'Context',
  tokens: 'tokens',
  inputTokens: 'in',
  cacheTokens: 'cache',

  // Git
  gitBranch: 'Git',
  dirty: '⚡',
  ahead: '↑',
  behind: '↓',

  // Tools
  tools: 'Tools',
  running: 'running',
  completed: 'done',
  errorLabel: 'error',

  // Agents
  agents: 'Agents',

  // Todos
  todos: 'Todos',
  pending: 'pending',
  inProgress: 'in progress',
  completedLabel: 'completed',

  // Session
  session: 'Session',
  duration: 'Duration',
  speed: 'Speed',
  tokensPerSec: 'tok/s',

  // Memory
  memory: 'Memory',
  used: 'used',

  // Config
  claudeMdFiles: '.claude.md',
  rules: 'rules',
  mcpServers: 'MCP',
  hooks: 'hooks',

  // Errors
  error: 'Error',
};

export type Translations = typeof en;
