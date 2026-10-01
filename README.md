# 海外情报

[![验证](https://github.com/tnagjei/overseas-intel/actions/workflows/check.yml/badge.svg)](https://github.com/tnagjei/overseas-intel/actions/workflows/check.yml)

给自己看的出海经营情报站，基于 [AIHOT](https://github.com/KKKKhazix/AIHOT) 改造，完整程序位于本仓库根目录，保留原 MIT 许可和 Git 历史。

## 第一版

| 栏目 | 关注内容 |
| --- | --- |
| 建站与维护 | WordPress、WooCommerce、插件、兼容性、性能和安全 |
| 流量与获客 | Google/Bing、SEO、索引、多语言和转化 |
| 工具与产品 | API、开源产品、工具站、价格与有证据的产品机会 |
| 内容与订阅 | Newsletter、会员、支付、定价与留存 |
| 自动化工作流 | 编码、Agent、MCP、部署和内容运营 |

首批配置 18 个公开 RSS/Atom 信源、24 个主题。2026-10-01 真实试抓时，启用的 16 个信源全部通过；Search Engine Land 和 Substack 返回 HTTP 403，已停用，后续可在后台复查。优先收录影响个人业务的变化与可复用实践，不把推测的需求、收入和因果写成事实。

沿用原评分类型、五轴权重与双次评分。门槛待本人标注 100–200 条样本后校准。本版不自动发布到 WordPress，也不提供对外付费订阅。

## 个人阅读

首页「我的出海情报」提供六个业务关注入口：站点安全、搜索收录、产品机会、工具定价、订阅收款和流程自动化。点击后按标签跨栏目查看精选，再次点击取消；也可以继续叠加栏目筛选。

精选卡片在电脑和手机上都显示分类与标签。当前筛选没有精选时，可直接查看同一范围的全部动态。阅读入口和关注项统一放在 [industry/reading.ts](industry/reading.ts)，调整关注内容时不必散改页面。

本轮代码改造与验收见 [docs/personal-home.md](docs/personal-home.md)。

## 本机运行

需要 Docker Compose，以及 Node.js 24.11 以上来初始化配置。

```bash
git clone https://github.com/tnagjei/overseas-intel.git
cd overseas-intel
node scripts/init-env.ts
docker compose up -d --build
```

访问 http://localhost:3000，后台为 /admin，管理员密码由初始化脚本生成。

默认只监听本机，采集与模型调用关闭；未配置模型时不会自动生成情报。在本地 .env 填好 LLM_BASE_URL、LLM_API_KEY、LLM_MODEL，再将 COLLECT_ENABLED 和 MODEL_CALLS_ENABLED 改成 true 后重启。

不要提交 .env、密钥、数据库或 .data/。sources.json 只用于新环境首次导入，不覆盖数据库中同 id 的信源；运行后通过后台维护。

## 跨设备阅读

优先使用私人网络。需要域名 HTTPS 时，Caddy 统一认证覆盖网页、RSS、API 与 MCP：

1. 运行 `docker run --rm -it caddy:2-alpine caddy hash-password`，交互生成 bcrypt 哈希。
2. 在 .env 设置 SITE_URL、SITE_DOMAIN、TRUST_PROXY=true、PRIVATE_USERNAME 和 PRIVATE_PASSWORD_HASH。
3. 哈希用单引号包住，保留美元符号。
4. 运行 `docker compose --profile https up -d --build`。

没有认证哈希时 HTTPS 入口不能启动。应用端口保持本机监听，不要绕过认证直接暴露。后台管理员密码独立使用。

## 检查与校准

```bash
npm ci
node scripts/overseas-brand.mjs
node scripts/overseas-check.mjs
npm run typecheck
npm run build -w @aihot/web
node --test apps/web/tests/*.test.ts
```

后端测试需要空的 *_test 或 *_ci PostgreSQL 数据库，先迁移，再 npm test。启动站点后执行 scripts/smoke.ts 和 scripts/mcp-check.ts。

免费信源试抓：
```bash
node scripts/overseas-source-audit.mjs --disable-failing
```

结果在 .data/source-audit.json，失败源可停用后复查。GitHub Actions 检查类型、构建、数据库、网页、MCP、Docker 和整站私人认证。第一版验收：16 个网页测试和 183 个后端测试全部通过；详见 [验证记录](docs/personal-v1.md)。

精选校准见 docs/selection.md；个人版改动与验证记录见 [docs/personal-v1.md](docs/personal-v1.md)。首次改造的门槛不宣称已校准。

## 同步上游

origin 是自己的独立仓库，upstream 指向 AIHOT。固定版本记录在 upstream.json，首次导入保留完整上游历史。

```bash
git remote add upstream https://github.com/KKKKhazix/AIHOT.git
git fetch upstream
git merge upstream/main
```

已有 upstream 时不重复添加。解决冲突时保留个人行业配置、认证和安全阀，再运行检查，最后正常推送，不强制覆盖历史。

## 目录

- industry/：身份、分类、信源、主题、提示词、说明和品牌。
- apps/、packages/：网页、API、worker、采集、模型、事件和报告。
- database/：数据库迁移。
- deploy/、docker-compose.yml、Dockerfile：个人运行与统一认证。
- scripts/：初始化、品牌、检查、试抓与评测。
- docs/：原框架说明与个人版记录。
- upstream.json：来源和版本。

原 LICENSE、NOTICE 和文档保留，原框架介绍另存 docs/upstream-README.md。站点使用独立的海外情报名称和图标。
