// 验证行业配置、提示词契约与私人默认值；不调用模型。
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SITE } from "../industry/site.ts";
import { CATEGORIES, CATEGORY_TAGS, TOPIC_TAGS, ENTITY_TAGS, ENTITIES, ITEM_TYPES } from "../industry/taxonomy.ts";
import { FEATURES } from "../industry/features.ts";
import { SELECTION } from "../industry/selection.ts";
import { assertSupportedConfig } from "../packages/backend/src/sources/config-keys.ts";
import { promptText } from "../packages/backend/src/editorial/prompts.ts";
const json=(p)=>JSON.parse(readFileSync(p,"utf8"));
const { sources }=json("industry/sources.json");
const { topics }=json("industry/topics.json");
assert.equal(SITE.name,"海外情报");
assert.equal(CATEGORIES.length,5);
assert.equal(new Set(CATEGORIES.map((c)=>c.key)).size,5);
assert.equal(FEATURES.leaderboard,false);
assert.equal(FEATURES.codexResetMonitor,false);
assert.deepEqual(SELECTION.thresholds,{ T1:60,T1_5:65,T2:76 });
assert.equal(new Set(sources.map((s)=>s.id)).size,sources.length);
const tags=new Set([...CATEGORY_TAGS,...TOPIC_TAGS,...ENTITY_TAGS]);
const slugs=new Set(topics.map((t)=>t.slug));
for (const s of sources) {
  assert.equal(s.kind,"rss");
  assertSupportedConfig(s.kind,s.config);
  assert.equal(s.site_fulltext,false);
  assert.equal(s.syndicate_fulltext,false);
  if (s.owner_entity_id) assert.ok(ENTITIES[s.owner_entity_id],s.owner_entity_id);
  for (const tag of s.tags) assert.ok(tags.has(tag),tag);
}
for (const t of topics) {
  if (t.entityId) assert.ok(ENTITIES[t.entityId],t.entityId);
  for (const tag of t.tags) assert.ok(tags.has(tag)||(tag.startsWith("entity:")&&ENTITIES[tag.slice(7)]),tag);
  for (const related of t.related) assert.ok(slugs.has(related),related);
}
const score=promptText("selection-score");
for (const type of ITEM_TYPES) assert.ok(score.includes(type),type);
assert.ok(score.includes("attentionScore"));
assert.ok(promptText("prefilter").includes("不要求涉及 AI"));
assert.ok(promptText("understand").includes("WordPress"));
const env=readFileSync(".env.example","utf8");
assert.match(env,/^COLLECT_ENABLED=false$/m);
assert.match(env,/^MODEL_CALLS_ENABLED=false$/m);
assert.ok(readFileSync("docker-compose.yml","utf8").includes("127.0.0.1:3000"));
assert.ok(readFileSync("deploy/Caddyfile","utf8").includes("basic_auth"));
assert.ok(json("industry/changelog.json").releases.length);
console.log("配置通过："+sources.length+" 个信源，"+topics.length+" 个主题。");
