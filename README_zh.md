# MiniMax HUD

MiniMax Coding Plan 用户专用的轻量级状态栏 HUD。在 Claude Code 状态栏显示上下文使用量、配额信息和项目路径。

## 功能特点

- **上下文进度条** - 可视化显示上下文使用情况及令牌数量
- **5小时配额** - 实时显示 5 小时用量
- **7天配额** - 每周用量追踪
- **Git 状态** - 分支名、dirty 指示器、ahead/behind 数量
- **工具活动** - 显示运行中及最近完成的工具
- **代理状态** - 显示活跃的子代理
- **待办进度** - 显示任务进度
- **颜色警告** - 用量增加时颜色变化提示
- **国际化** - 支持中文和英文

## 前置要求

- **MiniMax API** - 需要 MiniMax API 访问权限（通过 ccswitch 或直接配置）
- **Node.js 18+**

## 快速部署

你可以让 Claude Code（使用 MiniMax）帮你自动部署：

```
请帮我部署 minimax-hud 插件：
1. 在 ~/.claude/plugins/marketplaces/ 目录下创建 minimax-hud 项目
2. 复制 src 文件夹和 package.json, tsconfig.json
3. 运行 npm install && npm run build
4. 配置 settings.json 的 statusLine
5. 重启 Claude Code
```

或手动部署：

```bash
# 1. 将此仓库克隆/下载到：
#    ~/.claude/plugins/marketplaces/minimax-hud/

# 2. 安装依赖
cd ~/.claude/plugins/marketplaces/minimax-hud
npm install

# 3. 编译
npm run build

# 4. 配置 ccswitch 使用 MiniMax
ccswitch  # 或手动设置 ANTHROPIC_BASE_URL 为 MiniMax

# 5. 重启 Claude Code
```

## 配置选项



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

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `language` | 界面语言 (`zh` 或 `en`) | `zh` |
| `lineLayout` | 布局模式 (`expanded` 或 `compact`) | `expanded` |
| `showSeparators` | 显示分隔线 | `false` |
| `pathLevels` | 路径显示深度 (1-3) | `1` |
| `gitStatus.enabled` | 显示 git 分支/状态 | `true` |
| `gitStatus.showDirty` | 显示 dirty 指示器 (⚡) | `true` |
| `gitStatus.showAheadBehind` | 显示 ↑↓ ahead/behind | `false` |
| `gitStatus.showFileStats` | 显示文件变更统计 | `false` |
| `showModel` | 显示模型名称 | `true` |
| `showProject` | 显示项目路径 | `true` |
| `showContextBar` | 显示上下文进度条 | `true` |
| `contextValue` | 上下文显示格式 (`percent`, `tokens`, `remaining`) | `percent` |
| `showUsage` | 显示用量配额 | `true` |
| `usageBarEnabled` | 显示用量进度条 | `true` |
| `showTools` | 显示工具活动 | `false` |
| `showAgents` | 显示代理状态 | `false` |
| `showTodos` | 显示待办进度 | `false` |
| `sevenDayThreshold` | 显示 7 天用量的最低百分比 | `5` |

## 效果截图

```
项目路径
[MiniMax-M2.7] [ctx] ██████░░░░░░░░░ 40% (79k/200k) │ 用量 ███░░░░░░░ 25% / 5小时 | ░░░░░░░░░░░ 3% / 7天
───── 分隔线 ─────
master ⚡
```

## 工作原理

MiniMax HUD 从 Claude Code 的 stdin 读取：

- 当前工作目录 (`cwd`)
- 模型信息 (`model`)
- 上下文窗口使用情况 (`context_window`)
-  transcript 路径 (`transcript_path`)

然后从 MiniMax API 获取配额数据并显示在状态栏。

## 环境配置

确保你的环境已配置 MiniMax API。HUD 从环境变量中读取 `ANTHROPIC_AUTH_TOKEN`。

## 开源协议

MIT
