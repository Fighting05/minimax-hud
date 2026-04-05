# MiniMax HUD

A lightweight status line HUD for MiniMax Coding Plan users, built with ❤️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

> Inspired by [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) · Built for MiniMax users

[中文版](./README_zh.md)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Context Bar** | Visual progress bar with token count |
| ⏱️ **5-Hour Quota** | Real-time 5-hour usage tracking |
| 📅 **7-Day Quota** | Weekly usage monitoring |
| �Git **Git Status** | Branch, dirty indicator, ahead/behind |
| 🔧 **Tool Activity** | Running & recent tools display |
| 🤖 **Agent Status** | Active subagents tracking |
| ✅ **Todo Progress** | Task progress visualization |
| 🎨 **Color Warnings** | Dynamic color based on usage |
| 🌍 **i18n** | English & Chinese supported |

## 📷 Screenshot

```
project/path
[MiniMax-M2.7] [ctx] ██████░░░░░░░░░ 40% (79k/200k) │ Usage ███░░░░░░░ 25% / 5h | ░░░░░░░░░░░ 3% / 7d
───── separator ─────
master ⚡
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MiniMax API access

### Installation

```bash
# 1. Clone this repo
git clone https://github.com/Fighting05/minimax-hud.git
cd minimax-hud

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Configure Claude Code
# Add to ~/.claude/settings.json:
{
  "statusLine": {
    "command": "bash -c '\"/path/to/node\" \"/path/to/minimax-hud/dist/index.js\"'",
    "type": "command"
  }
}

# 5. Restart Claude Code
```

## ⚙️ Configuration

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

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `language` | `zh` \| `en` | `zh` | UI language |
| `lineLayout` | `expanded` \| `compact` | `expanded` | Display mode |
| `showSeparators` | `boolean` | `false` | Show line separators |
| `pathLevels` | `1` \| `2` \| `3` | `1` | Path depth |
| `gitStatus.showDirty` | `boolean` | `true` | Show ⚡ dirty indicator |
| `gitStatus.showAheadBehind` | `boolean` | `false` | Show ↑↓ counts |
| `contextValue` | `percent` \| `tokens` \| `remaining` | `percent` | Context display format |
| `sevenDayThreshold` | `number` | `5` | Min % for 7-day display |

## 🔧 How It Works

MiniMax HUD reads from Claude Code's stdin:

- `cwd` - Current working directory
- `model` - Model information
- `context_window` - Context usage stats
- `transcript_path` - Session transcript

Then fetches quota data from MiniMax API and renders it in the status line.

## 🗂️ Project Structure

```
minimax-hud/
├── src/
│   ├── index.ts          # Entry point
│   ├── api.ts            # MiniMax API client
│   ├── cache.ts          # Usage cache
│   ├── config.ts         # Configuration
│   ├── git.ts           # Git status
│   ├── stdin.ts         # Input parsing
│   ├── transcript.ts     # Transcript parser
│   ├── types.ts         # TypeScript types
│   ├── i18n/            # Internationalization
│   └── render/          # Rendering
├── dist/                # Compiled output
└── README.md
```

## 🤝 Friends

Inspired by and built参考：

- **[jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)** - The original Claude HUD that inspired this project

## 📄 License

MIT License · © 2024 [Fighting05](https://github.com/Fighting05)

## 🙏 Credits

- [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) - Inspiration
- [MiniMax](https://www.minimaxi.com/) - API support
