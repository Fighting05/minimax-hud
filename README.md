# MiniMax HUD

[中文版](./README_zh.md)

A lightweight status line HUD for MiniMax Coding Plan users. Displays context window usage, quota information, and project path in Claude Code's status bar.

## Features

- **Context Window Bar** - Visual progress bar showing context usage with token count
- **5-Hour Quota** - Real-time display of your 5-hour usage
- **7-Day Quota** - Weekly usage tracking
- **Git Status** - Branch name, dirty indicator, ahead/behind counts
- **Tool Activity** - Shows running and recent completed tools
- **Agent Status** - Shows active subagents
- **Todo Progress** - Shows task progress
- **Color-Coded Warnings** - Changes color as usage increases
- **i18n Support** - Chinese and English

## Requirements

- **MiniMax API** - Requires MiniMax API access (via ccswitch or direct config)
- **Node.js 18+**

## Quick Deploy

You can ask Claude Code (with MiniMax) to deploy this for you:

```
Please help me deploy the minimax-hud plugin:
1. Create minimax-hud project in ~/.claude/plugins/marketplaces/
2. Copy src folder, package.json, tsconfig.json
3. Run npm install && npm run build
4. Configure settings.json statusLine
5. Restart Claude Code
```

Or manually:

```bash
# 1. Clone/download this repo to:
#    ~/.claude/plugins/marketplaces/minimax-hud/

# 2. Install dependencies
cd ~/.claude/plugins/marketplaces/minimax-hud
npm install

# 3. Build
npm run build

# 4. Configure ccswitch to use MiniMax
ccswitch  # or manually set ANTHROPIC_BASE_URL to MiniMax

# 5. Restart Claude Code
```

## Configuration

Edit `~/.claude/plugins/marketplaces/minimax-hud/config.json`:

```json
{
  "language": "zh",
  "lineLayout": "expanded",
  "gitStatus": {
    "enabled": true,
    "showDirty": true,
    "showAheadBehind": false,
    "showFileStats": false
  },
  "display": {
    "showModel": true,
    "showProject": true,
    "showContextBar": true,
    "contextValue": "percent",
    "showUsage": true,
    "usageBarEnabled": true,
    "showTools": false,
    "showAgents": false,
    "showTodos": false,
    "sevenDayThreshold": 5
  }
}
```

### Config Options

| Option | Description | Default |
|--------|-------------|---------|
| `language` | UI language (`zh` or `en`) | `zh` |
| `lineLayout` | Layout mode (`expanded` or `compact`) | `expanded` |
| `showSeparators` | Show separators between sections | `false` |
| `pathLevels` | Path depth to show (1-3) | `1` |
| `gitStatus.enabled` | Show git branch/status | `true` |
| `gitStatus.showDirty` | Show dirty indicator (⚡) | `true` |
| `gitStatus.showAheadBehind` | Show ↑↓ ahead/behind | `false` |
| `gitStatus.showFileStats` | Show file change stats | `false` |
| `showModel` | Show model name | `true` |
| `showProject` | Show project path | `true` |
| `showContextBar` | Show context window bar | `true` |
| `contextValue` | Context display (`percent`, `tokens`, `remaining`) | `percent` |
| `showUsage` | Show usage quota | `true` |
| `usageBarEnabled` | Show usage progress bar | `true` |
| `showTools` | Show tool activity | `false` |
| `showAgents` | Show agent status | `false` |
| `showTodos` | Show todo progress | `false` |
| `sevenDayThreshold` | Min % to show 7-day usage | `5` |

## Screenshot

```
project/path
[MiniMax-M2.7] [ctx] ██████░░░░░░░░░ 40% (79k/200k) │ Usage ███░░░░░░░ 25% / 5h | ░░░░░░░░░░░ 3% / 7d
───── separator ─────
master ⚡
```

## How It Works

MiniMax HUD reads from Claude Code's stdin which provides:

- Current working directory (`cwd`)
- Model info (`model`)
- Context window usage (`context_window`)
- Transcript path (`transcript_path`)

It fetches quota data from MiniMax API and displays it in the status line.

## Setup

Ensure your environment is configured for MiniMax API. The HUD reads `ANTHROPIC_AUTH_TOKEN` from environment variables.

## License

MIT
