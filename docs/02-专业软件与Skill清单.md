# 专业软件与 Skill 清单

## A. 必用（对齐教程）

| 名称 | 类型 | 链接 / 位置 | 干什么 |
|------|------|-------------|--------|
| Cursor Agent | IDE | 本机已装 | 说话驱动改 `web/`，用户零手写 |
| Holopix AI | 游戏美术站 | https://holopix.cn/ | 角色/场景/道具/风格模型 |
| Holopix 手册 | 文档 | https://swdqya2b3ry.feishu.cn/wiki/WIvQwG8Ebivyg3k4RyIc8leZnqi | 官方用法 |
| 即梦 | 出图 | https://jimeng.jianying.com/ | 国内备选；可做背景/立绘 |

## B. 推荐 Skill / MCP（装在 Cursor）

| Skill / MCP | 用途 | 备注 |
|-------------|------|------|
| 本仓 `.cursor/rules/xiuxian-vibe.mdc` | 强制修仙产品边界 | 已写入，打开本仓即生效 |
| `prompts/holopix-美术圣经.txt` | 统一出图提示词 | 复制到 Holopix |
| 即梦 MCP（可选） | Agent 直接催图 | 社区：`fengin/image-gen-server`，需 `sessionid` |
| Godot MCP（可选） | 以后做 2D 场景 | `@coding-solo/godot-mcp`；第一版不必 |

装即梦 MCP（可选，PowerShell）：

```powershell
# 仅当你要 Agent 调即梦时再做；需先登录即梦拿到 sessionid
# 具体以 MCP 仓库 README 为准，密钥放本机用户目录，勿提交 git
```

## C. 成熟替代方案（若不想自己搓 Web）

| 方案 | 适合 | 说明 |
|------|------|------|
| **本仓 Web 放置**（当前） | 最快出可玩、好接 AI 图 | 与「文字/放置修仙」赛道一致 |
| RPG Maker MZ / Unite | 事件向 JRPG | 偏剧情地图，数值要自己配 |
| Godot + AI 资产 | 要横版/俯视角再开 | 美术仍走 Holopix，别走 Kenney |
| Unity + AI | 重型 3D | 0 基础成本高，教程未走这条 |

## D. 今天你只需做 3 件事

1. 浏览器打开 `web/index.html` 玩一遍  
2. 打开 Holopix，用 `prompts/holopix-美术圣经.txt` 出 `bg.png` + `hero.png`，丢进 `assets/ai/`  
3. 对本仓 Cursor 说：「图放好了，接到界面上」  
