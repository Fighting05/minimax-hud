# MiniMax HUD

为 MiniMax Coding Plan 用户打造的轻量级状态栏 HUD，用 ❤️ 构建

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

> 灵感来自 [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) · 为 MiniMax 用户打造

---

## ✨ 功能特点

| 功能 | 说明 |
|------|------|
| 📊 **上下文进度条** | 可视化进度条 + 令牌数量 |
| ⏱️ **5小时配额** | 实时 5 小时用量追踪 |
| 📅 **7天配额** | 每周用量监控 |
| 📍 **Git 状态** | 分支、dirty 指示器、ahead/behind |
| 🔧 **工具活动** | 运行中 & 最近工具显示 |
| 🤖 **代理状态** | 活跃子代理追踪 |
| ✅ **待办进度** | 任务进度可视化 |
| 🎨 **颜色警告** | 用量动态颜色提示 |
| 🌍 **国际化** | 中文 & 英文 |

## 📷 效果截图

```
项目路径
[MiniMax-M2.7] [ctx] ██████░░░░░░░░░ 40% (79k/200k) │ 用量 ███░░░░░░░ 25% / 5小时 | ░░░░░░░░░░░ 3% / 7天
───── 分隔线 ─────
master ⚡
```

## 🚀 快速开始

### 前置要求

- Node.js 18+
- MiniMax API 访问权限

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Fighting05/minimax-hud.git
cd minimax-hud

# 2. 安装依赖
npm install

# 3. 编译
npm run build

# 4. 配置 Claude Code
# 在 ~/.claude/settings.json 中添加：
{
  "statusLine": {
    "command": "bash -c '\"/path/to/node\" \"/path/to/minimax-hud/dist/index.js\"'",
    "type": "command"
  }
}

# 5. 重启 Claude Code
```

## ⚙️ 配置选项

编辑 `~/.claude/plugins/marketplaces/minimax-hud/config.json`:

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

### 配置说明

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `language` | `zh` \| `en` | `zh` | 界面语言 |
| `lineLayout` | `expanded` \| `compact` | `expanded` | 显示模式 |
| `showSeparators` | `boolean` | `false` | 显示分隔线 |
| `pathLevels` | `1` \| `2` \| `3` | `1` | 路径深度 |
| `gitStatus.showDirty` | `boolean` | `true` | 显示 ⚡ dirty 指示 |
| `gitStatus.showAheadBehind` | `boolean` | `false` | 显示 ↑↓ 数量 |
| `contextValue` | `percent` \| `tokens` \| `remaining` | `percent` | 上下文显示格式 |
| `sevenDayThreshold` | `number` | `5` | 显示 7 天用量的最低百分比 |

## 🔧 工作原理

MiniMax HUD 从 Claude Code 的 stdin 读取：

- `cwd` - 当前工作目录
- `model` - 模型信息
- `context_window` - 上下文使用统计
- `transcript_path` - Session transcript 路径

然后从 MiniMax API 获取配额数据并渲染到状态栏。

## 🗂️ 项目结构

```
minimax-hud/
├── src/
│   ├── index.ts          # 入口文件
│   ├── api.ts            # MiniMax API 客户端
│   ├── cache.ts          # 用量缓存
│   ├── config.ts         # 配置管理
│   ├── git.ts           # Git 状态
│   ├── stdin.ts         # 输入解析
│   ├── transcript.ts     # Transcript 解析
│   ├── types.ts         # TypeScript 类型
│   ├── i18n/            # 国际化
│   └── render/          # 渲染模块
├── dist/                # 编译输出
└── README.md
```

## 🤝 友链

参考学习：

- **[jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)** - 灵感来源，原版 Claude HUD

## 📄 开源协议

MIT License · © 2024 [Fighting05](https://github.com/Fighting05)

## 🙏 致谢

- [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) - 灵感来源
- [MiniMax](https://www.minimaxi.com/) - API 支持
