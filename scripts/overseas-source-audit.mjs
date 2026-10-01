// 免费 RSS/Atom 真实试抓，不调用模型；报告不进入 Git。
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fetchRss } from "../packages/backend/src/sources/rss.ts";
import { assertSupportedConfig } from "../packages/backend/src/sources/config-keys.ts";
const file="industry/sources.json";
const data=JSON.parse(readFileSync(file,"utf8"));
const results=[];
for (let at=0;at<data.sources.length;at+=3) {
  const batch=await Promise.all(data.sources.slice(at,at+3).map(async(source)=>{
    try {
      assertSupportedConfig(source.kind,source.config);
      const { candidates }=await fetchRss({ ...source,cursor:{} },{ force:true });
      if (!candidates.length) throw new Error("未解析到条目");
      if (!candidates.every((c)=>c.title&&/^https?:/.test(c.url))) throw new Error("条目映射无效");
      const dates=candidates.map((c)=>c.publishedAt).filter((d)=>d instanceof Date&&!Number.isNaN(d.getTime()));
      return { id:source.id,name:source.name,enabled:source.enabled!==false,ok:true,count:candidates.length,
        sampleTitle:candidates[0].title.slice(0,200),
        latestPublishedAt:dates.length?new Date(Math.max(...dates.map((d)=>d.getTime()))).toISOString():null };
    } catch(error) {
      return { id:source.id,name:source.name,enabled:source.enabled!==false,ok:false,error:String(error).slice(0,200) };
    }
  }));
  results.push(...batch);
  for (const r of batch) console.log((r.ok?"PASS ":"FAIL ")+r.name+" "+(r.count??r.error));
}
mkdirSync(".data",{ recursive:true });
writeFileSync(".data/source-audit.json",JSON.stringify({ checkedAt:new Date().toISOString(),results },null,2));
if (process.argv.includes("--disable-failing")) {
  for (const s of data.sources) s.enabled=results.find((r)=>r.id===s.id)?.ok===true;
  writeFileSync(file,JSON.stringify(data,null,2)+"\n");
}
const ready=results.filter((r)=>r.ok).length;
const enabled=results.filter((r)=>data.sources.find((s)=>s.id===r.id)?.enabled!==false);
const enabledReady=enabled.filter((r)=>r.ok).length;
console.log("SOURCE_AUDIT_JSON "+JSON.stringify(results));
console.log("可用信源："+ready+"/"+results.length);
console.log("已启用信源："+enabledReady+"/"+enabled.length);
if (enabledReady<5||enabledReady!==enabled.length) process.exitCode=1;
