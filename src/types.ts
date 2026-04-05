/**
 * Types for MiniMax HUD
 */

// ============================================================================
// Stdin Types (from Claude Code)
// ============================================================================

export interface StdinData {
  transcript_path?: string;
  cwd?: string;
  model?: {
    id?: string;
    display_name?: string;
  };
  context_window?: {
    context_window_size?: number;
    current_usage?: {
      input_tokens?: number;
      output_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    } | null;
    used_percentage?: number | null;
    remaining_percentage?: number | null;
  };
}

// ============================================================================
// Transcript Types (from transcript JSONL)
// ============================================================================

export interface ToolEntry {
  id: string;
  name: string;
  target?: string;
  status: 'running' | 'completed' | 'error';
  startTime: Date;
  endTime?: Date;
}

export interface AgentEntry {
  id: string;
  type: string;
  model?: string;
  description?: string;
  status: 'running' | 'completed';
  startTime: Date;
  endTime?: Date;
}

export interface TodoItem {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TranscriptData {
  tools: ToolEntry[];
  agents: AgentEntry[];
  todos: TodoItem[];
  sessionStart?: Date;
  sessionName?: string;
}

// ============================================================================
// Usage Types (from MiniMax API)
// ============================================================================

export interface MiniMaxModelRemain {
  model_name: string;
  current_interval_total_count: number;
  current_interval_usage_count: number;
  current_weekly_total_count: number;
  current_weekly_usage_count: number;
  weekly_remains_time: number;
}

export interface MiniMaxApiResponse {
  model_remains: MiniMaxModelRemain[];
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

export interface UsageCache {
  fiveHourUsed: number;
  fiveHourTotal: number;
  sevenDayUsed: number;
  sevenDayTotal: number;
}

// ============================================================================
// Git Types
// ============================================================================

export interface FileStats {
  modified: number;
  added: number;
  deleted: number;
  untracked: number;
}

export interface GitStatus {
  branch: string;
  isDirty: boolean;
  ahead: number;
  behind: number;
  fileStats?: FileStats;
}

// ============================================================================
// Render Context
// ============================================================================

export interface RenderContext {
  stdin: StdinData;
  transcript: TranscriptData;
  gitStatus: GitStatus | null;
  usageData: UsageData | null;
  config: HudConfig;
  extraLabel: string | null;
}

// ============================================================================
// Config Types
// ============================================================================

export type LineLayoutType = 'compact' | 'expanded';
export type AutocompactBufferMode = 'enabled' | 'disabled';
export type ContextValueMode = 'percent' | 'tokens' | 'remaining';
export type Language = 'en' | 'zh';

export interface GitStatusConfig {
  enabled: boolean;
  showDirty: boolean;
  showAheadBehind: boolean;
  showFileStats: boolean;
}

export interface DisplayConfig {
  showModel: boolean;
  showProject: boolean;
  showContextBar: boolean;
  contextValue: ContextValueMode;
  showConfigCounts: boolean;
  showDuration: boolean;
  showSpeed: boolean;
  showTokenBreakdown: boolean;
  showUsage: boolean;
  usageBarEnabled: boolean;
  showTools: boolean;
  showAgents: boolean;
  showTodos: boolean;
  autocompactBuffer: AutocompactBufferMode;
  usageThreshold: number;
  sevenDayThreshold: number;
  environmentThreshold: number;
}

export interface HudConfig {
  language: Language;
  lineLayout: LineLayoutType;
  showSeparators: boolean;
  pathLevels: 1 | 2 | 3;
  gitStatus: GitStatusConfig;
  display: DisplayConfig;
}

export interface UsageData {
  fiveHour: number | null;  // 0-100 percentage
  sevenDay: number | null;   // 0-100 percentage
  fiveHourResetAt: Date | null;
  sevenDayResetAt: Date | null;
  apiUnavailable?: boolean;
  apiError?: string;
}
