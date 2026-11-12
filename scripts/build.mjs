import {mkdir,copyFile,readdir,rm} from 'node:fs/promises';
const files=['index.html','style.css','app.js','engine.js','render.js','storage.js','sw.js','icon.svg','icon-192.png','icon-512.png','manifest.webmanifest','.nojekyll'];
await rm('dist',{recursive:true,force:true});await mkdir('dist');
await Promise.all(files.map(f=>copyFile(f,`dist/${f}`)));
console.log(`Built ${files.length} self-contained game files in dist/.`);
