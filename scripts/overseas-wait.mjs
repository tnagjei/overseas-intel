// 在有限时间内检查 CI 的本机服务是否就绪。
const until=Date.now()+45000;
while (Date.now()<until) {
  try {
    const r=await fetch("http://127.0.0.1:3000/api/health",{ signal:AbortSignal.timeout(1500) });
    if (r.status===200) { console.log("站点已就绪。"); process.exit(0); }
  } catch {}
  await new Promise((resolve)=>setTimeout(resolve,500));
}
throw new Error("45 秒内站点未就绪");
