// CC3 expedition rules. Earlier versions remain replayable without changing physics.
import * as legacy from './legacy-engine.js';
import * as v2 from './legacy-v2.js';
import {getPilot,ZONES,PILOTS,EQUIPMENT} from './equipment.js';
export const RULES='CC3', W=880, H=720, PX=170, RADIUS=16, STEP=1/120;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const hash=legacy.hash;
export function random(s){return legacy.random(s);}
export function challengeSeed(code){if(!/^CC[123]-[A-Z0-9]{3,12}$/.test(code))throw Error('Codeformat: CC3-ABC123 (3–12 Buchstaben oder Zahlen).');return hash(code);}
export function challengeURL(base,code){challengeSeed(code);const url=new URL(base);url.search='';url.hash='';url.searchParams.set('challenge',code);return url.href;}
export function viewport(width,height){const scale=Math.min(width/W,height/H);return {scale,x:(width-W*scale)/2,y:(height-H*scale)/2,w:W,h:H};}
export function frameTiming(elapsed,carry=0){if(!Number.isFinite(elapsed)||elapsed<0||elapsed>.5)return {pause:true,steps:0,carry:0};const total=elapsed+carry;const steps=Math.floor((total+1e-9)/STEP);return {pause:false,steps,carry:Math.max(0,total-steps*STEP)};}
export function createGame(mode='endless',seed=12345,code=''){
 if(code.startsWith('CC1-'))return legacy.createGame(mode,seed,code);
 if(code.startsWith('CC2-'))return v2.createGame(mode,seed,code);
 const s={version:RULES,mode,seed,rng:seed>>>0,code,time:0,distance:0,speed:mode==='training'?135:195,nextX:690,lastCenter:360,gates:[],gateId:0,player:{x:PX,y:360,v:0,alive:true,shield:0,charge:0,inv:0,heat:0,lastGate:-1},bots:[],passed:0,coins:0,near:0,nearScore:0,combo:0,score:0,over:false,won:false,rank:null,events:[],trainingHits:0};
 if(mode==='arena')for(let i=0;i<7;i++)s.bots.push({x:PX-20-i*8,y:330+i*9,v:0,alive:true,shield:0,charge:0,inv:0,heat:0,lastGate:-1,id:i,error:random(s)*50-25,skill:.7+random(s)*.28,decision:0,thrust:false});
 s.expedition={pilot:'mint',gear:{},energy:25,timers:{boost:0,slow:0,magnet:0,double:0,phase:0},supplies:{life:0,boost:0,magnet:0},rings:0,pickups:0,missions:[],sector:0,reserved:false};generate(s);return s;
}
export function trainingLesson(s){const stage=s.passed<3?0:s.passed<7?1:s.passed<12?2:3;return [
 {title:'1 · Schub kennenlernen',text:'Kurz halten: steigen. Loslassen: sinken. Schaffe 3 breite Tore.',target:3},
 {title:'2 · Die Mitte treffen',text:'Fange die goldenen Kristalle in der Mitte. Steuere mit kurzen Impulsen.',target:7},
 {title:'3 · Mut zur Kante',text:'Fliege knapp an einer Kante vorbei. Drei enge Durchflüge laden den Schild.',target:12},
 {title:'4 · Dein eigener Flow',text:'Übe bewegliche Tore, Ringe und Warnfelder. Treffer sind weiterhin verzeihbar.',target:null}][stage];}
export function storm(s){if(s.version==='CC1')return legacy.storm(s);if(s.version==='CC2')return v2.storm(s);if(s.mode==='training')return 0;const cycle=s.time%42;return s.time<30?0:Math.sin(clamp((cycle-29)/13,0,1)*Math.PI)*48;}
export function gateCenter(g,time){return g.center+(g.moving?Math.sin(time*.9+g.phase)*g.amplitude:0);}
export function laserActive(g,time){return g.kind==='laser'&&((time+g.phase)%5.5)>3.5;}
function generate(s){while(s.nextX<s.distance+W+650){const id=s.gateId++,training=s.mode==='training',rest=!training&&id>0&&id%18>=14;
 const zone=Math.floor(id/8)%ZONES.length;
 const difficulty=clamp(s.nextX/32000,0,1);let gap=training?(id<3?370:id<7?340:310):rest?320:290-difficulty*78;
 let center=clamp(s.lastCenter+(random(s)-.5)*(training&&id<3?90:210),190,530);
 const roll=random(s);let kind='gate';if((!training&&id>7)||(training&&id>=12)){if(!rest&&id%7===4)kind='ring';else if(!rest&&id%9===7)kind='laser';}
 if(kind==='ring')center=clamp(center+((id%2)?45:-45),190,530);
 if(s.mode==='endless'&&id>=8&&!rest){if(zone===1)kind=id%4===3?'vault':'ring';if(zone===2)kind=id%3===0?'gate':'laser';if(zone===3)kind='drone';if(zone===4){gap=340;kind=id%2?'ring':'gate';}}
 const moving=!rest&&id>10&&kind==='gate'&&roll>.64;
 s.gates.push({id,x:s.nextX,center,gap,w:72,moving,amplitude:training?14:22,phase:random(s)*Math.PI*2,passed:false,coin:false,kind,rest,touched:false,ringCollected:false,zone,pickup:s.mode==='endless'&&id>1&&id%5===3?['shield','boost','magnet','energy'][Math.floor(id/5)%4]:'',pickupTaken:false});
 s.lastCenter=center;s.nextX+=rest?440:340+random(s)*70;
 }}
export function score(s){return Math.floor(s.time)*10+s.passed*25+s.coins*10+(s.nearScore||0)+(s.over&&s.mode==='arena'?({1:500,2:300,3:150}[s.rank]||0):0);}
function safePosition(s,p,g){if(g)p.y=clamp(gateCenter(g,s.time),RADIUS+8,H-RADIUS-8);else p.y=clamp(p.y,RADIUS+12,H-RADIUS-12);p.v=0;p.heat=0;}
function hit(s,p,g){if(p.inv>0){if(p.y<RADIUS||p.y>H-RADIUS)safePosition(s,p);return;}
 if(p===s.player&&s.mode==='endless'&&(s.expedition.timers.boost>0||s.expedition.timers.phase>0)){if(!g)safePosition(s,p);return;}
 if(p.shield){p.shield=0;p.inv=1.4;safePosition(s,p,g);if(p===s.player){s.combo=0;s.events.push('shield');}return;}
 if(s.mode==='training'&&p===s.player){p.inv=1.6;safePosition(s,p,g);s.trainingHits++;s.events.push('practice');return;}
 if(p===s.player&&s.mode==='endless'&&s.expedition.supplies.life>0){s.expedition.supplies.life--;p.inv=2;safePosition(s,p,g);s.combo=0;s.events.push('revive');return;}
 p.alive=false;p.deathTime=s.time;if(p===s.player)s.events.push('dead');
}
function fly(p,held,dt){p.v=clamp(p.v+(held?-710:620)*dt,-300,350);p.y+=p.v*dt;p.inv=Math.max(0,p.inv-dt);}
function collisions(s,p,dt){if(!p.alive)return;const edge=storm(s);if(p.y<RADIUS||p.y>H-RADIUS)hit(s,p);if(!p.alive)return;
 p.heat=clamp(p.heat+((p.y<edge+RADIUS||p.y>H-edge-RADIUS)?1.1:-1.8)*dt,0,1);if(p.heat>=1)hit(s,p);
 const pos=s.distance+p.x;
 for(const g of s.gates){if(pos+RADIUS>g.x&&pos-RADIUS<g.x+g.w){const c=gateCenter(g,s.time);const unsafe=p.y-RADIUS<c-g.gap/2||p.y+RADIUS>c+g.gap/2;
  // A warning gate only energizes outside its generous safe passage.
  if(unsafe&&!['ring','vault'].includes(g.kind)&&(g.kind!=='laser'||laserActive(g,s.time))){if(p===s.player)g.touched=true;hit(s,p,g);if(!p.alive)return;}
 }}
}
function reward(s,p){const pos=s.distance+p.x;for(const g of s.gates){if(g.id<=p.lastGate||pos-RADIUS<=g.x+g.w)continue;p.lastGate=g.id;
 if(p===s.player){g.passed=true;s.passed++;s.events.push('gate');if(s.mode==='endless'){const e=s.expedition;if(e.gear.helmet==='helm-crown'&&s.passed%5===0)s.coins++;if(e.pilot==='gold'&&s.passed%10===0)s.coins+=2;}}
 const clearance=g.gap/2-Math.abs(p.y-gateCenter(g,s.time))-RADIUS;
 if(!['ring','vault'].includes(g.kind)&&clearance>=0&&clearance<34&&!(p===s.player&&g.touched)){p.charge++;if(p===s.player){s.near++;s.combo=Math.min(s.combo+1,4);s.nearScore+=40*[1,1.5,2,3][s.combo-1];s.events.push('near');}if(p.charge>=3&&!p.shield){p.charge=0;p.shield=1;if(p===s.player)s.events.push('charged');}p.charge=Math.min(p.charge,2);}
 else if(p===s.player)s.combo=0;
}}
export function step(s,held,dt=STEP){if(s.version==='CC1'){legacy.step(s,held,dt);return;}if(s.version==='CC2'){v2.step(s,held,dt);return;}if(s.over)return;s.events=[];s.time+=dt;s.speed=s.mode==='training'?135+Math.min(30,s.time*.1):195+Math.min(75,s.time*.32);if(s.mode==='endless'){const e=s.expedition;for(const key of Object.keys(e.timers))e.timers[key]=Math.max(0,e.timers[key]-dt);const pilot=getPilot(e.pilot);e.energy=Math.min(100,e.energy+dt*100/pilot.cooldown*(e.gear.helmet==='helm-comet'?1.15:1)*(e.pilot==='lilac'?1.1:1));if(e.timers.slow>0)s.speed*=.65;if(e.timers.boost>0)s.speed*=1.25;}s.distance+=s.speed*dt;generate(s);
 if(s.mode==='endless'&&s.expedition.gear.pack==='pack-wing'&&!held)s.player.v-=620*.12*dt;fly(s.player,held,dt);collisions(s,s.player,dt);
 if(s.player.alive){const pos=s.distance+s.player.x;for(const g of s.gates){const center=gateCenter(g,s.time);const e=s.expedition,mag=s.mode==='endless'&&e.timers.magnet>0,reach=mag?125+(e.pilot==='pink'?45:0)+(e.gear.helmet==='helm-cat'?30:0):36;const dx=Math.abs(pos-(g.x+g.w/2));const dy=Math.abs(s.player.y-center);if(!g.coin&&dx<(mag?reach:27)&&dy<reach){g.coin=true;s.coins+=e.timers.double>0?2:1;s.events.push('coin');}if(g.pickup&&!g.pickupTaken&&dx<(mag?reach:28)&&Math.abs(s.player.y-(center-65))<reach){g.pickupTaken=true;e.pickups++;if(g.pickup==='shield')s.player.shield=1;else if(g.pickup==='energy')e.energy=Math.min(100,e.energy+40);else e.timers[g.pickup]=g.pickup==='boost'?boostDuration(s):12;s.events.push('pickup:'+g.pickup);}
 if(['ring','vault'].includes(g.kind)&&!g.ringCollected&&Math.abs(pos-(g.x+g.w/2))<22&&Math.abs(s.player.y-center)<(g.kind==='vault'?32:55)){g.ringCollected=true;s.expedition.rings++;s.coins+=(g.kind==='vault'?8:2)*(s.expedition.timers.double>0?2:1);s.nearScore+=g.kind==='vault'?150:60;s.events.push(g.kind==='vault'?'vault':'ring');}}
 reward(s,s.player);}
 for(const b of s.bots){if(!b.alive)continue;b.decision-=dt;if(b.decision<=0){const next=s.gates.find(g=>g.x+g.w>s.distance+b.x-RADIUS);const target=next?gateCenter(next,s.time)+b.error:360;b.thrust=b.y+b.v*.22>target;b.decision=.08+(1-b.skill)*.25;if(random(s)>(.997-Math.min(.012,s.time/10000)))b.error=(random(s)-.5)*220;}fly(b,b.thrust,dt);collisions(s,b,dt);if(b.alive)reward(s,b);}
 s.gates=s.gates.filter(g=>g.x+g.w>s.distance-100);
 if(!s.player.alive){s.over=true;s.rank=1+s.bots.filter(b=>b.alive).length;}else if(s.mode==='arena'&&s.bots.every(b=>!b.alive)){s.over=true;s.won=true;s.rank=1;s.events.push('win');}
 if(s.mode==='endless'){const e=s.expedition;const next=s.gates.find(g=>g.x+g.w>s.distance+PX);const sector=next?.zone||0;if(sector!==e.sector){e.sector=sector;s.events.push('sector');}for(const m of missionProgress(s)){if(m.done&&!e.missions.includes(m.id)){e.missions.push(m.id);s.coins+=m.reward;s.events.push('mission:'+m.id);}}}
 s.score=score(s);
}
export function snapshot(s){const copy=JSON.parse(JSON.stringify(s));copy.events=[];return copy;}
export function validSnapshot(s){try{
 if(s?.version==='CC1'||s?.version==='CC2')return v2.validSnapshot(s);
 const num=(o,keys)=>o&&typeof o==='object'&&keys.every(k=>typeof o[k]==='number'&&Number.isFinite(o[k]));
 if(!s||!['CC1',RULES].includes(s.version)||!['endless','arena','training','challenge'].includes(s.mode)||s.over!==false||!s.player||s.player.alive!==true)return false;
 if(!num(s,['time','distance','speed','nextX','lastCenter','rng','seed','passed','coins','near','combo','score','gateId'])||s.time<0||s.time>864000||s.distance<0||s.distance>250000000||s.nextX<s.distance||s.nextX>s.distance+3000||s.passed<0||s.coins<0)return false;
 if(!Array.isArray(s.gates)||s.gates.length<1||s.gates.length>20||!Array.isArray(s.bots)||s.bots.length>7||!Array.isArray(s.events))return false;
 const player=p=>num(p,['y','v','shield','charge','inv','heat'])&&Math.abs(p.y)<=10000&&Math.abs(p.v)<=1000&&[0,1].includes(p.shield)&&p.inv>=0&&p.inv<=2&&p.charge>=0&&p.charge<=3&&p.heat>=0&&p.heat<=1;
 if(!player(s.player)||!s.bots.every(b=>player(b)&&num(b,['id','error','skill','decision'])&&typeof b.alive==='boolean'))return false;
 if(s.version===RULES&&![s.player,...s.bots].every(p=>num(p,['x','lastGate'])&&p.x>=50&&p.x<=PX))return false;
 if(!s.gates.every(g=>num(g,['x','center','gap','w','phase','amplitude','id'])&&g.x>s.distance-300&&g.x<s.distance+3000&&g.center>=150&&g.center<=570&&g.gap>=150&&g.gap<=400&&g.w===72&&g.amplitude>=0&&g.amplitude<=30&&(s.version==='CC1'||['gate','ring','laser','drone','vault'].includes(g.kind))))return false;
 if(s.nearScore!==undefined&&(!Number.isFinite(s.nearScore)||s.nearScore<0))return false;
 const e=s.expedition;if(!e||!PILOTS.some(p=>p.id===e.pilot)||!num(e,['energy','rings','pickups','sector'])||e.energy<0||e.energy>100||e.rings<0||e.pickups<0||!Number.isInteger(e.sector)||e.sector<0||e.sector>=ZONES.length||!e.gear||Object.entries(e.gear).some(([type,id])=>!EQUIPMENT.some(g=>g.type===type&&g.id===id))||typeof e.reserved!=='boolean'||!Array.isArray(e.missions)||e.missions.some(m=>!['gates','coins','rings'].includes(m))||!e.timers||!e.supplies||!['boost','slow','magnet','double','phase'].every(k=>Number.isFinite(e.timers[k])&&e.timers[k]>=0&&e.timers[k]<=30)||!['life','boost','magnet'].every(k=>Number.isInteger(e.supplies[k])&&e.supplies[k]>=0&&e.supplies[k]<=2))return false;
 return typeof s.code==='string'&&(s.mode!=='challenge'||new RegExp(`^${s.version}-[A-Z0-9]{3,12}$`).test(s.code));
 }catch{return false;}}

export function configureFlight(s,p){if(s.version!==RULES||s.mode!=='endless')return;const e=s.expedition;e.pilot=getPilot(p.skin).id;e.gear={...p.gear};e.energy=e.pilot==='mint'?25:0;}
export function boostDuration(s){const e=s.expedition;return 3+(e.pilot==='coral'?1:0)+(e.gear.pack==='pack-twin'?1:0);}
export function activate(s,kind){if(s.version!==RULES||s.mode!=='endless'||s.over)return false;const e=s.expedition;if(kind==='ability'){const p=getPilot(e.pilot);if(e.energy<100||(p.effect==='shield'?s.player.shield:e.timers[p.effect]>0))return false;e.energy=0;if(p.effect==='shield')s.player.shield=1;else e.timers[p.effect]=p.effect==='boost'?boostDuration(s):p.duration+(e.pilot==='ice'?2:0);return true;}
 if(!['boost','magnet'].includes(kind)||e.supplies[kind]<1||e.timers[kind]>0)return false;e.supplies[kind]--;e.timers[kind]=kind==='boost'?boostDuration(s):12;return true;}
export function missionProgress(s){const e=s.expedition;return [{id:'gates',label:'Tore passieren',value:s.passed,target:6,reward:8},{id:'coins',label:'Münzen sammeln',value:s.coins-(e?.missions.includes('gates')?8:0)-(e?.missions.includes('coins')?10:0)-(e?.missions.includes('rings')?12:0),target:10,reward:10},{id:'rings',label:'Ringe treffen',value:e?.rings||0,target:3,reward:12}].map(m=>({...m,done:m.value>=m.target||e?.missions.includes(m.id)}));}
