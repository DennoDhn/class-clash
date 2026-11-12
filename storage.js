import {RULES,validSnapshot} from './engine.js';
export const KEY='class-clash.v1', BACKUP=KEY+'.backup';
export const SKINS=[{id:'mint',name:'Mint Pilot',color:'#9dff70',price:0},{id:'coral',name:'Solar Rush',color:'#ff906e',price:80},{id:'ice',name:'Glacier',color:'#85dcff',price:140},{id:'pink',name:'Pink Nova',color:'#ffa5e9',price:220},{id:'gold',name:'Gold Wing',color:'#ffd16b',price:350},{id:'lilac',name:'Ultra Violet',color:'#bba4ff',price:500}];
export const GEAR=[
 {id:'helm-standard',type:'helmet',name:'Original',price:0},{id:'helm-comet',type:'helmet',name:'Comet',price:45},{id:'helm-cat',type:'helmet',name:'Lynx',price:110},{id:'helm-crown',type:'helmet',name:'Sky King',price:280},
 {id:'pack-classic',type:'pack',name:'Classic',price:0},{id:'pack-twin',type:'pack',name:'Twin Boost',price:65},{id:'pack-wing',type:'pack',name:'Sky Wing',price:180},
 {id:'trail-spark',type:'trail',name:'Funken',price:0},{id:'trail-ice',type:'trail',name:'Eiskristalle',price:55},{id:'trail-rainbow',type:'trail',name:'Prisma',price:160}
];
export const DEFAULT_GEAR={helmet:'helm-standard',pack:'pack-classic',trail:'trail-spark'};
export function nextUnlock(p){return [...SKINS.filter(s=>!p.owned.includes(s.id)),...GEAR.filter(g=>!p.gearOwned.includes(g.id))].sort((a,b)=>a.price-b.price)[0]||null;}
export function normalizeProfile(p){p.gearOwned??=Object.values(DEFAULT_GEAR);p.gear??={...DEFAULT_GEAR};p.archivedBests??={};p.bests??={};for(const [k,r] of Object.entries(p.bests)){if((r?.version||'CC1')!==RULES){p.archivedBests[k]=r;delete p.bests[k];}}return p;}
export function profile(name='Pilot 01') {return normalizeProfile({id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,name:name.trim().slice(0,20)||'Pilot',created:Date.now(),coins:0,xp:0,skin:'mint',owned:['mint'],runs:[],stats:{runs:0,wins:0,gates:0,coins:0,seconds:0,near:0},achievements:[],saved:null});}
export function fresh() {const p=profile();return {version:1,active:p.id,profiles:[p],settings:{sound:true,music:false,reduced:false}};}
const number=(v,max=1e15)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=max;
export function validate(data){
 if(!data||data.version!==1||!Array.isArray(data.profiles)||data.profiles.length<1||data.profiles.length>12)throw new Error('Diese Datei ist keine gültige Class-Clash-Sicherung.');
 const ids=new Set();
 for(const p of data.profiles){
  if(!p||typeof p.id!=='string'||p.id.length>80||ids.has(p.id)||typeof p.name!=='string'||p.name.length<1||p.name.length>20||!number(p.coins)||!number(p.xp)||!Array.isArray(p.owned)||!p.owned.includes('mint')||!p.owned.includes(p.skin)||p.owned.some(id=>!SKINS.some(s=>s.id===id))||!Array.isArray(p.runs)||p.runs.length>50||!p.stats||!['runs','wins','gates','coins','seconds','near'].every(k=>number(p.stats[k]))||!Array.isArray(p.achievements)||p.achievements.some(a=>typeof a!=='string'||a.length>50))throw new Error('Die Spielerdaten in dieser Sicherung sind beschädigt.');
  for(const r of p.runs)if(!r||!['endless','arena','training','challenge'].includes(r.mode)||!['passed','score','time','coins','date'].every(k=>number(r[k]))||typeof r.id!=='string'||typeof r.code!=='string'||r.code.length>30)throw new Error('Ungültiger Rundeneintrag.');
  if(p.bests!==undefined){if(!p.bests||typeof p.bests!=='object'||Array.isArray(p.bests)||Object.keys(p.bests).length>105)throw new Error('Ungültige Rekorddaten.');for(const [key,r] of Object.entries(p.bests)){if(!/^(endless|arena|challenge:CC[12]-[A-Z0-9]{3,12})$/.test(key)||!r||!['endless','arena','challenge'].includes(r.mode)||!['passed','score','time','coins','date'].every(k=>number(r[k]))||typeof r.code!=='string'||r.code.length>30)throw new Error('Ungültige Rekorddaten.');}}
  normalizeProfile(p);
  if(!Array.isArray(p.gearOwned)||p.gearOwned.length>20||p.gearOwned.some(id=>!GEAR.some(g=>g.id===id))||!p.gear||!Object.keys(DEFAULT_GEAR).every(type=>GEAR.some(g=>g.id===p.gear[type]&&g.type===type)&&p.gearOwned.includes(p.gear[type])))throw Error('Ungültige Ausrüstung.');
  if(!p.archivedBests||typeof p.archivedBests!=='object'||Array.isArray(p.archivedBests)||Object.keys(p.archivedBests).length>105)throw Error('Ungültiges Rekordarchiv.');
  for(const r of Object.values(p.archivedBests))if(!r||!['passed','score','time','coins','date'].every(k=>number(r[k]))||!['endless','arena','challenge'].includes(r.mode)||typeof r.code!=='string')throw Error('Ungültiges Rekordarchiv.');
  ids.add(p.id);
 }
 if(!ids.has(data.active))throw new Error('Das aktive Profil fehlt.');
 data.settings={sound:data.settings?.sound!==false,music:data.settings?.music===true,reduced:data.settings?.reduced===true};return data;
}
export function load(storage){
 try{const raw=storage.getItem(KEY);if(!raw)return {data:fresh(),warning:''};const data=validate(JSON.parse(raw));let warning='';
  for(const p of data.profiles)if(p.saved&&!validSnapshot(p.saved)){let recovered=null;try{const backup=validate(JSON.parse(storage.getItem(BACKUP)));const candidate=backup.profiles.find(q=>q.id===p.id)?.saved;if(validSnapshot(candidate))recovered=candidate;}catch{}p.saved=recovered;warning=recovered?'Ein beschädigter Flug wurde aus der letzten Sicherung wiederhergestellt.':'Ein beschädigter Flug wurde entfernt. Profile, Münzen und Rekorde bleiben erhalten.';}
  return {data,warning};
 }catch{try{const backup=storage.getItem(BACKUP);if(backup){const data=validate(JSON.parse(backup));for(const p of data.profiles)if(p.saved&&!validSnapshot(p.saved))p.saved=null;return {data,warning:'Die letzte gültige Sicherung wurde wiederhergestellt.'};}}catch{}return {data:fresh(),warning:'Spielstand konnte nicht gelesen werden. Bitte importiere eine Sicherung, bevor du weiterspielst.'};}
}
export function save(storage,data){try{const raw=storage.getItem(KEY);if(raw){try{validate(JSON.parse(raw));storage.setItem(BACKUP,raw);}catch{}}storage.setItem(KEY,JSON.stringify(data));return true;}catch{return false;}}
export const ACHIEVEMENTS=[{id:'first',name:'Abgehoben',desc:'Deinen ersten Lauf abschließen.',check:p=>p.stats.runs>=1},{id:'ten',name:'Im Flow',desc:'10 Tore in einem Lauf passieren.',check:(p,r)=>r.passed>=10},{id:'minute',name:'Langstrecke',desc:'60 Sekunden in einem Lauf fliegen.',check:(p,r)=>r.time>=60},{id:'close',name:'Millimeterarbeit',desc:'Insgesamt 10 enge Durchflüge.',check:p=>p.stats.near>=10},{id:'win',name:'Letzter am Himmel',desc:'Eine Arena-Runde gewinnen.',check:p=>p.stats.wins>=1},{id:'hundred',name:'Horizontjäger',desc:'100 Tore in einem Lauf passieren.',check:(p,r)=>r.passed>=100}];
export function record(p,s){if(s.mode==='training')return [];const r={id:globalThis.crypto?.randomUUID?.()||String(Date.now()),mode:s.mode,code:s.code||'',passed:s.passed,score:Math.floor(s.score),time:s.time,coins:s.coins,date:Date.now(),rank:s.rank,version:s.version};p.runs.unshift(r);p.runs=p.runs.slice(0,50);p.coins+=s.coins;p.xp+=Math.floor(s.time)+s.passed*5;p.stats.runs++;p.stats.wins+=s.won?1:0;p.stats.gates+=s.passed;p.stats.coins+=s.coins;p.stats.seconds+=s.time;p.stats.near+=s.near;
 // Permanent personal bests survive the bounded recent-run history.
 normalizeProfile(p);const records=s.version===RULES?p.bests:p.archivedBests;const key=s.mode==='challenge'?`challenge:${s.code}`:s.mode;
 if(!records[key]||r.passed>records[key].passed||(r.passed===records[key].passed&&r.score>records[key].score))records[key]=r;
 const keys=Object.keys(records).filter(k=>k.startsWith('challenge:'));if(keys.length>100)delete records[keys[0]];
 const unlocked=ACHIEVEMENTS.filter(a=>!p.achievements.includes(a.id)&&a.check(p,r));p.achievements.push(...unlocked.map(a=>a.id));p.saved=null;return unlocked;
}
