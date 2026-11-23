# gtc 文档

基于 VitePress 的 `gtc` 命令使用说明站点，纯中文文档。

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建产物
pnpm preview
```

## 目录结构

```
├── .vitepress/              # VitePress 配置
│   ├── config.mts           # 站点配置（导航、侧边栏、搜索）
│   ├── pwa.config.ts        # PWA 配置
│   └── theme/               # 自定义主题
├── public/                  # 静态资源（图标等）
├── src/
│   ├── index.md             # 首页
│   └── guide/
│       └── index.md          # gtc 命令使用说明
├── package.json
└── .env                     # 部署路径等环境变量
```

## 文档内容

- [命令使用说明](./src/guide/index.md)：快速开始、命令一览、配置文件、CI 示例与触发模式。
