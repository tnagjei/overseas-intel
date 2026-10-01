// 个人阅读入口：关注项使用行业标签，页面浏览沿用现有只读筛选接口。
import type { TOPIC_TAGS } from "./taxonomy.ts";

export const READING = {
  navLabel: "我的情报",
  title: "我的出海情报",
  description: "先看影响建站、获客、工具产品与订阅经营的变化，再决定哪些值得跟进。",
  focus: [
    { label: "站点安全", tag: "站点安全", note: "漏洞、补丁与防护" },
    { label: "搜索收录", tag: "索引", note: "索引与搜索规则" },
    { label: "产品机会", tag: "产品机会", note: "有证据的需求变化" },
    { label: "工具定价", tag: "定价", note: "价格与使用成本" },
    { label: "订阅收款", tag: "支付", note: "支付与订阅变动" },
    { label: "流程自动化", tag: "自动化", note: "可复用的工作流" },
  ],
} as const satisfies {
  navLabel: string;
  title: string;
  description: string;
  focus: ReadonlyArray<{ label: string; tag: (typeof TOPIC_TAGS)[number]; note: string }>;
};
