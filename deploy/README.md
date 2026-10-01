# 私人入口

Caddy 对网页、RSS、API、MCP 使用统一 Basic Auth，并发送禁止索引的响应头。未设置 bcrypt 密码哈希时入口不能启动。

- Caddyfile：整站认证与反向代理。
- docker-compose.yml（仓库根目录）：默认应用端口只监听本机。

跨设备设置步骤见根 README。
