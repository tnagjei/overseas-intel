# 运行与验收

在仓库根目录运行，不使用生产凭证测试。

- overseas-brand.mjs：由雷达 SVG 生成图标与 favicon。
- overseas-check.mjs：配置、标签、实体、提示词契约与私人默认值检查。
- overseas-source-audit.mjs：免费试抓，报告写入 .data/；--disable-failing 可停用失败源。
- overseas-wait.mjs：在有限时间内等待 CI 本机站点启动。
- nameplates.ts：沿用上游的字体路径生成器，使用 SITE.subject 生成海外刊头。
- 其他原脚本：初始化、数据库、smoke、MCP 与评测工具。
