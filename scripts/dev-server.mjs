import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const args=process.argv.slice(2);
const option=(name,fallback)=>{const i=args.indexOf(name);return i>=0?args[i+1]:fallback;};
const port=Number(option('--port','4173'));
const host=option('--host','127.0.0.1');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.md':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,`http://${host}:${port}`);
    let relative=decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if(relative.split(/[\\/]/).some(part=>part==='..'||part.startsWith('.'))){res.writeHead(403);res.end('Forbidden');return;}
    let file=path.resolve(root,relative || 'index.html');
    if(!file.startsWith(root)){res.writeHead(403);res.end('Forbidden');return;}
    try{const s=await stat(file);if(s.isDirectory())file=path.join(file,'index.html');await stat(file);}catch{file=path.join(root,'404.html');res.statusCode=404;}
    const bytes=await readFile(file);
    res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(400);res.end('Bad request');}
});
server.on('error',err=>{console.error(err.message);process.exit(1);});
server.listen(port,host,()=>console.log(`Academic website preview: http://${host}:${port}`));
