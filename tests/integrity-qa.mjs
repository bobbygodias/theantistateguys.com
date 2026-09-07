import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const htmlPath='qa-site-v3.html';
const html=await fs.readFile(path.join(root,htmlPath),'utf8');
const issues=[];
const checked=new Set();

function issue(message){ issues.push(message); }
function isExternal(ref){ return /^(?:https?:|mailto:|tel:|data:|#|javascript:)/i.test(ref); }
function cleanRef(ref){ return ref.split('#')[0].split('?')[0].trim(); }
async function assertFile(ref,origin){
  const clean=cleanRef(ref);
  if(!clean || isExternal(clean)) return;
  const absolute=path.resolve(root,clean);
  if(!absolute.startsWith(root+path.sep) && absolute!==root){ issue(`path-escape:${origin}:${ref}`); return; }
  try{
    const stat=await fs.stat(absolute);
    if(!stat.isFile()) issue(`not-file:${origin}:${clean}`);
    else if(stat.size===0) issue(`empty-file:${origin}:${clean}`);
    else checked.add(clean);
  }catch{ issue(`missing:${origin}:${clean}`); }
}

// HTML local src/href refs.
const attrRe=/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
for(const match of html.matchAll(attrRe)) await assertFile(match[1],htmlPath);

// Stylesheets must be present exactly once and compat must be direct, not JS-injected.
const styles=[...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
const expectedStyles=['qa-site-v3.css','qa-site-v3-cenography.css','qa-site-v3-internal.css','qa-site-v3-compat.css'];
for(const css of expectedStyles){
  const count=styles.filter(x=>cleanRef(x)===css).length;
  if(count!==1) issue(`stylesheet-count:${css}:${count}`);
}

// Scripts must be local and loaded once.
const scripts=[...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
for(const js of ['script.js','qa-site-v3.js']){
  const count=scripts.filter(x=>cleanRef(x)===js).length;
  if(count!==1) issue(`script-count:${js}:${count}`);
}

// Parse CSS url() dependencies recursively for the V3 layers.
for(const css of expectedStyles){
  const text=await fs.readFile(path.join(root,css),'utf8');
  for(const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)){
    const ref=match[1].trim();
    if(isExternal(ref)) continue;
    const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(css),ref));
    await assertFile(resolved,css);
  }
}

// Every navigation route maps 1:1 to a section and vice versa.
const navRoutes=[...html.matchAll(/data-route-link=["']([^"']+)["']/gi)].map(m=>m[1]);
const sectionRoutes=[...html.matchAll(/\bdata-route=["']([^"']+)["']/gi)].map(m=>m[1]);
const unique=a=>[...new Set(a)];
if(navRoutes.length!==unique(navRoutes).length) issue('duplicate-nav-route');
if(sectionRoutes.length!==unique(sectionRoutes).length) issue('duplicate-section-route');
for(const route of unique(navRoutes)) if(!sectionRoutes.includes(route)) issue(`nav-without-section:${route}`);
for(const route of unique(sectionRoutes)) if(!navRoutes.includes(route)) issue(`section-without-nav:${route}`);
if(unique(navRoutes).length!==6 || unique(sectionRoutes).length!==6) issue(`route-count:nav-${unique(navRoutes).length}:sections-${unique(sectionRoutes).length}`);

// aria-labelledby targets must exist.
const ids=new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m=>m[1]));
for(const match of html.matchAll(/aria-labelledby=["']([^"']+)["']/gi)){
  for(const id of match[1].trim().split(/\s+/)) if(!ids.has(id)) issue(`aria-labelledby-missing:${id}`);
}

// target=_blank links must be HTTP(S) and protected with noopener+noreferrer.
for(const match of html.matchAll(/<a\b([^>]*)>/gi)){
  const attrs=match[1];
  const href=attrs.match(/href=["']([^"']+)["']/i)?.[1]||'';
  const blank=/target=["']_blank["']/i.test(attrs);
  if(blank){
    if(!/^https:\/\//i.test(href)) issue(`blank-not-https:${href}`);
    const rel=attrs.match(/rel=["']([^"']+)["']/i)?.[1]?.toLowerCase()||'';
    if(!rel.split(/\s+/).includes('noopener')) issue(`blank-no-noopener:${href}`);
    if(!rel.split(/\s+/).includes('noreferrer')) issue(`blank-no-noreferrer:${href}`);
  }
}

// No insecure HTTP resources/links in QA HTML/CSS.
if(/(?:src|href)=["']http:\/\//i.test(html)) issue('html-insecure-http');
for(const css of expectedStyles){
  const text=await fs.readFile(path.join(root,css),'utf8');
  if(/url\(\s*["']?http:\/\//i.test(text)) issue(`css-insecure-http:${css}`);
}

// Music catalog structure: local JSON valid; releases/tracks have non-empty titles and HTTPS URLs.
const musicPath='data/music.json';
await assertFile(musicPath,'integrity');
let music;
try{ music=JSON.parse(await fs.readFile(path.join(root,musicPath),'utf8')); }
catch{ issue('music-json-invalid'); }
if(music){
  if(!Array.isArray(music.releases) || !music.releases.length) issue('music-releases-empty');
  let trackCount=0;
  for(const [ri,release] of (music.releases||[]).entries()){
    if(typeof release.title!=='string' || !release.title.trim()) issue(`music-release-title:${ri}`);
    if(!Array.isArray(release.tracks) || !release.tracks.length) issue(`music-release-tracks:${ri}`);
    for(const [ti,track] of (release.tracks||[]).entries()){
      trackCount++;
      if(typeof track.title!=='string' || !track.title.trim()) issue(`music-track-title:${ri}:${ti}`);
      if(typeof track.url!=='string' || !/^https:\/\//i.test(track.url)) issue(`music-track-url:${ri}:${ti}`);
    }
  }
  if(trackCount<2) issue(`music-track-count:${trackCount}`);
}

// Critical V3 scripts should reference the expected local catalog and not inject compat CSS dynamically.
const appJS=await fs.readFile(path.join(root,'script.js'),'utf8');
const qaJS=await fs.readFile(path.join(root,'qa-site-v3.js'),'utf8');
if(!appJS.includes("fetch('data/music.json'")) issue('script-music-catalog-ref-missing');
if(/createElement\(['"]link['"]\)[\s\S]{0,800}qa-site-v3-compat\.css/i.test(qaJS)) issue('compat-dynamic-injection-returned');

const summary={
  passed:issues.length===0,
  issues,
  checkedLocalFiles:[...checked].sort(),
  routes:unique(navRoutes),
  styles,
  scripts,
  musicTracks:music?.releases?.reduce((n,r)=>n+(r.tracks?.length||0),0)||0
};
await fs.mkdir(path.join(root,'test-artifacts'),{recursive:true});
await fs.writeFile(path.join(root,'test-artifacts','integrity-results.json'),JSON.stringify(summary,null,2));
await fs.writeFile(path.join(root,'test-artifacts','integrity-summary.md'),[
  '# TASG V3 Integrity QA','',
  `- Resultado: ${summary.passed?'PASS':'FAIL'}`,
  `- Arquivos locais verificados: ${summary.checkedLocalFiles.length}`,
  `- Rotas: ${summary.routes.length}`,
  `- Faixas catalogadas: ${summary.musicTracks}`,
  ...(issues.length?['','## Falhas',...issues.map(x=>`- ${x}`)]:[])
].join('\n'));

if(issues.length){
  console.error(`FAIL integrity: ${issues.join(', ')}`);
  process.exit(1);
}
console.log(`PASS integrity · ${summary.checkedLocalFiles.length} arquivos locais · ${summary.routes.length} rotas · ${summary.musicTracks} faixas`);
