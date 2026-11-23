import { defineConfig, loadEnv } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";
import { VitePWA } from "vite-plugin-pwa";
import { pwaConfig } from "./pwa.config";

// 使用 VitePress 的 loadEnv 加载环境变量
// mode: '' 会加载 .env 文件（只加载 VITE_ 开头的变量）
const env = loadEnv("", process.cwd());

export default defineConfig({
  srcDir: "./src",
  base: env.VITE_BASE_URL || "/",
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
  ],
  title: "gtc 文档",
  description: "gtc 命令使用说明",
  outDir: "./dist",
  vite: {
    plugins: [VitePWA(pwaConfig)],
  },
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "gtc 文档",
      description: "gtc 命令使用说明",
      themeConfig: {
        logo: "/favicon.svg",
        lastUpdated: {
          text: "更新时间",
        },
        docFooter: {
          prev: "上一页",
          next: "下一页",
        },
        outline: {
          label: "大纲",
          level: [2, 3],
        },
        nav: [
          { text: "首页", link: "/" },
          { text: "命令使用", link: "/guide/index.md" },
        ],
        sidebar: generateSidebar({
          documentRootPath: "src",
          scanStartPath: "/guide",
          collapsed: false,
          useTitleFromFileHeading: true,
          useTitleFromFrontmatter: true,
          hyphenToSpace: true,
          excludePattern: ["README.md"],
          debugPrint: false,
        }),
        search: {
          provider: "local",
          options: {
            translations: {
              button: {
                buttonText: "搜索",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
        socialLinks: [
          { icon: "github", link: "https://github.com/afeiship" },
        ],
        footer: {
          message: "基于 MIT 许可发布",
          copyright: "Copyright © 2019-present aric.zheng",
        },
      },
    },
  },
});
