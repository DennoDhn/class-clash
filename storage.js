import {RULES,validSnapshot} from './engine.js';
export const KEY='class-clash.v1', BACKUP=KEY+'.backup';
import {PILOTS,EQUIPMENT,SUPPLIES} from './equipment.js';
export const SKINS=PILOTS, GEAR=EQUIPMENT;
export const DEFAULT_GEAR={helmet:'helm-standard',pack:'pack-classic',trail:'trail-spark'};
export function nextUnlock(p){return [...SKINS.filter(s=>!p.owned.includes(s.id)),...GEAR.filter(g=>!p.gearOwned.includes(g.id))].sort((a,b)=>a.price-b.price)[0]||null;}
export function normalizeProfile(p){p.supplies??={life:1,boost:2,magnet:1};p.packEnabled??=true;p.gearOwned??=Object.values(DEFAULT_GEAR);p.gear??={...DEFAULT_GEAR};p.archivedBests??={};p.bests??={};for(const [k,r] of Object.entries(p.archivedBests)){if(!/^CC[123]:/.test(k)){p.archivedBests[(r?.version||'CC1')+':'+k]=r;delete p.archivedBests[k];}}for(const [k,r] of Object.entries(p.bests)){if((r?.version||'CC1')!==RULES){p.archivedBests[(r?.version||'CC1')+':'+k]=r;delete p.bests[k];}}return p;}
export function profile(name='Pilot 01') {return normalizeProfile({id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,name:name.trim().slice(0,20)||'Pilot',created:Date.now(),coins:0,xp:0,skin:'mint',owned:['mint'],runs:[],stats:{runs:0,wins:0,gates:0,coins:0,seconds:0,near:0},achievements:[],saved:null});}
export function fresh() {const p=profile();return {version:1,active:p.id,profiles:[p],settings:{sound:true,music:false,reduced:false}};}
const number=(v,max=1e15)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=max;
export function validate(data){
 if(!data||data.version!==1||!Array.isArray(data.profiles)||data.profiles.length<1||data.profiles.length>12)throw new Error('Diese Datei ist keine gültige Class-Clash-Sicherung.');
 const ids=new Set();
 for(const p of data.profiles){
  if(!p||typeof p.id!=='string'||p.id.length>80||ids.has(p.id)||typeof p.name!=='string'||p.name.length<1||p.name.length>20||!number(p.coins)||!number(p.xp)||!Array.isArray(p.owned)||!p.owned.includes('mint')||!p.owned.includes(p.skin)||p.owned.some(id=>!SKINS.some(s=>s.id===id))||!Array.isArray(p.runs)||p.runs.length>50||!p.stats||!['runs','wins','gates','coins','seconds','near'].every(k=>number(p.stats[k]))||!Array.isArray(p.achievements)||p.achievements.some(a=>typeof a!=='string'||a.length>50))throw new Error('Die Spielerdaten in dieser Sicherung sind beschädigt.');
  for(const r of p.runs)if(!r||!['endless','arena','training','challenge'].includes(r.mode)||!['passed','score','time','coins','date'].every(k=>number(r[k]))||typeof r.id!=='string'||typeof r.code!=='string'||r.code.length>30)throw new Error('Ungültiger Rundeneintrag.');
  if(p.bests!==undefined){if(!p.bests||typeof p.bests!=='object'||Array.isArray(p.bests)||Object.keys(p.bests).length>105)throw new Error('Ungültige Rekorddaten.');for(const [key,r] of Object.entries(p.bests)){if(!/^(endless|arena|challenge:CC[123]-[A-Z0-9]{3,12})$/.test(key)||!r||!['endless','arena','challenge'].includes(r.mode)||!['passed','score','time','coins','date'].every(k=>number(r[k]))||typeof r.code!=='string'||r.code.length>30)throw new Error('Ungültige Rekorddaten.');}}
  normalizeProfile(p);
  if(!p.supplies||!SUPPLIES.every(item=>Number.isInteger(p.supplies[item.id])&&p.supplies[item.id]>=0&&p.supplies[item.id]<=item.limit+item.carry)||typeof p.packEnabled!=='boolean')throw Error('Ungültige Vorräte.');
  if(!Array.isArray(p.gearOwned)||p.gearOwned.length>20||p.gearOwned.some(id=>!GEAR.some(g=>g.id===id))||!p.gear||!Object.keys(DEFAULT_GEAR).every(type=>GEAR.some(g=>g.id===p.gear[type]&&g.type===type)&&p.gearOwned.includes(p.gear[type])))throw Error('Ungültige Ausrüstung.');
  if(!p.archivedBests||typeof p.archivedBests!=='object'||Array.isArray(p.archivedBests)||Object.keys(p.archivedBests).length>315)throw Error('Ungültiges Rekordarchiv.');
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
 normalizeProfile(p);const records=s.version===RULES?p.bests:p.archivedBests;const baseKey=s.mode==='challenge'?`challenge:${s.code}`:s.mode;const key=s.version===RULES?baseKey:s.version+':'+baseKey;
 if(!records[key]||r.passed>records[key].passed||(r.passed===records[key].passed&&r.score>records[key].score))records[key]=r;
 const keys=Object.keys(records).filter(k=>k.startsWith(s.version===RULES?'challenge:':s.version+':challenge:'));if(keys.length>100)delete records[keys[0]];
 const unlocked=ACHIEVEMENTS.filter(a=>!p.achievements.includes(a.id)&&a.check(p,r));p.achievements.push(...unlocked.map(a=>a.id));p.saved=null;return unlocked;
}

export function buySupply(p,id){const item=SUPPLIES.find(x=>x.id===id);if(!item||p.coins<item.price||p.supplies[id]>=item.limit)return false;p.coins-=item.price;p.supplies[id]++;return true;}
export function returnSupplies(p,s){if(!s?.expedition?.reserved)return;for(const item of SUPPLIES)p.supplies[item.id]+=s.expedition.supplies[item.id];s.expedition.supplies={life:0,boost:0,magnet:0};s.expedition.reserved=false;}
export function prepareSupplies(p,s){if(s.version!==RULES||s.mode!=='endless'||s.expedition.reserved)return;returnSupplies(p,p.saved);p.saved=null;s.expedition.reserved=true;if(p.packEnabled)for(const item of SUPPLIES){const n=Math.min(item.carry,p.supplies[item.id]);p.supplies[item.id]-=n;s.expedition.supplies[item.id]=n;}}
