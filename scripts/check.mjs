import assert from 'node:assert/strict';
import { readFile, access, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=file=>readFile(path.join(root,file),'utf8');
const data=JSON.parse(await read('data/site.json'));
const total=data.publications.length;
assert.equal(total,data.metrics.publications,'Publication total matches the content snapshot');
assert(total>0);
assert(Array.isArray(data.biography) && data.biography.every(text=>typeof text==='string'));
assert(typeof data.heroDescription==='string');
assert.equal(new Set(data.publications.map(p=>p.id)).size,total,'Unique publication IDs');
assert.equal(new Set(data.publications.map(p=>p.doi.toLowerCase())).size,total,'Unique publication DOIs');
assert.match(data.metrics.snapshotDate,/^\d{4}-\d{2}-\d{2}$/);
for(const key of ['citations','hIndex','i10Index'])assert(Number.isInteger(data.metrics[key]) && data.metrics[key]>=0);
if(data.metrics.snapshotDate==='2026-10-05'){assert.equal(total,19);assert.equal(data.metrics.citations,502);}
assert.equal(data.profile.primaryEmail,'qingkui.zeng@tlu.edu.cn');
assert.equal(data.profile.secondaryEmail,'zenghuh1996@gmail.com');
assert.equal(data.education[0].dates,'Sep 2021 – Jun 2025');
assert.equal(data.employment[0].dates,'Jul 2025 – Present');
assert.equal(data.publications.find(p=>p.id==='paper-11').year,2026,'NSS 2025 proceedings have a 2026 citation');
assert.equal(data.publications.find(p=>p.id==='paper-16').year,2026,'ProvSec 2025 proceedings have a 2026 citation');
assert.equal(data.publications.find(p=>p.id==='paper-02').year,2023);
assert.equal(data.publications.find(p=>p.id==='paper-12').year,2025);
for(const pub of data.publications){
  assert(pub.authors.includes('Qingkui Zeng'),`Owner missing from ${pub.id}`);
  assert.match(pub.doi,/^10\.\d{4,9}\/.+/);
  assert(pub.title.length>10 && pub.venue && pub.metadataSource);
  assert(new URL(pub.scholarUrl).searchParams.get('user')==='QiIY6DQAAAAJ');
}
const home=await read('index.html');
const cv=await read('cv/index.html');
assert.equal((home.match(/class="publication-card"/g)||[]).length,total,'All papers must be prerendered without JS');
assert.equal((cv.match(/<li><h3>/g)||[]).length,total,'CV includes every paper');
for(const section of ['about','research','news','publications','highlights','cv','interests','contact'])assert(home.includes(`id="${section}"`));
assert.equal((await read('CNAME')).trim(),'zenghuh.site');
await access(path.join(root,'.nojekyll'));
for(const old of ['_site','_config.yml','portfolio','index.md','Gemfile'])await assert.rejects(access(path.join(root,old)),`Legacy artifact remains: ${old}`);
for(const file of ['index.html','cv/index.html','404.html']){
  const html=await read(file);
  assert(!/xukun12138|xukun930|busuanzi|ipapi|analytics-worker/.test(html),'Reference identity or trackers leaked');
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Duplicate HTML IDs in ${file}`);
  for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(url.startsWith('#'))assert(ids.includes(url.slice(1)),`Broken anchor ${url} in ${file}`);
    if(url.startsWith('/') && !url.startsWith('//')){
      let target=url.split('#')[0];if(target.endsWith('/'))target+='index.html';
      await access(path.join(root,target));
    }
  }
  for(const [,url] of html.matchAll(/<img[^>]+src="([^"]+)"/g))assert(url.startsWith('/assets/images/'),'Images must be local');
}
for(const file of ['snow-mountains.webp',...data.interests.map(item=>item.image)])assert((await stat(path.join(root,'assets/images',file))).size<250000,'Oversized optimized image');
console.log('Content, citation years, static HTML, local assets, internal links and legacy removal: passed.');
