// 由新的 logo.svg 生成站点图标；在仓库根目录运行。
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";
const svg=readFileSync("industry/brand/logo.svg");
for (const [file,size] of [["icon.png",512],["icon-192.png",192],["apple-icon.png",180]]) {
  await sharp(svg).resize(size,size).png().toFile("industry/brand/"+file);
}
const png=await sharp(svg).resize(256,256).png().toBuffer();
const header=Buffer.alloc(22);
header.writeUInt16LE(1,2);
header.writeUInt16LE(1,4);
header.writeUInt16LE(1,10);
header.writeUInt16LE(32,12);
header.writeUInt32LE(png.length,14);
header.writeUInt32LE(22,18);
writeFileSync("industry/brand/favicon.ico",Buffer.concat([header,png]));
console.log("海外情报图标已生成。");
