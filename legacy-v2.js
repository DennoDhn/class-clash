// CC2: fixed-step, seeded simulation. CC1 replays stay on their original rules.
import * as legacy from './legacy-engine.js';
export const RULES='CC2', W=880, H=720, PX=170, RADIUS=16, STEP=1/120;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const hash=legacy.hash;
export function random(s){return legacy.random(s);}
export function challengeSeed(code){if(!/^CC[12]-[A-Z0-9]{3,12}$/.test(code))throw Error('Codeformat: CC2-ABC123 (3–12 Buchstaben oder Zahlen).');return hash(code);}
export function challengeURL(base,code){challengeSeed(code);const url=new URL(base);url.search='';url.hash='';url.searchParams.set('challenge',code);return url.href;}
export function viewport(width,height){const scale=Math.min(width/W,height/H);return {scale,x:(width-W*scale)/2,y:(height-H*scale)/2,w:W,h:H};}
export function frameTiming(elapsed,carry=0){if(!Number.isFinite(elapsed)||elapsed<0||elapsed>.5)return {pause:true,steps:0,carry:0};const total=elapsed+carry;const steps=Math.floor((total+1e-9)/STEP);return {pause:false,steps,carry:Math.max(0,total-steps*STEP)};}
export function createGame(mode='endless',seed=12345,code=''){
 if(code.startsWith('CC1-'))return legacy.createGame(mode,seed,code);
 const s={version:RULES,mode,seed,rng:seed>>>0,code,time:0,distance:0,speed:mode==='training'?135:195,nextX:690,lastCenter:360,gates:[],gateId:0,player:{x:PX,y:360,v:0,alive:true,shield:0,charge:0,inv:0,heat:0,lastGate:-1},bots:[],passed:0,coins:0,near:0,nearScore:0,combo:0,score:0,over:false,won:false,rank:null,events:[],trainingHits:0};
 if(mode==='arena')for(let i=0;i<7;i++)s.bots.push({x:PX-20-i*8,y:330+i*9,v:0,alive:true,shield:0,charge:0,inv:0,heat:0,lastGate:-1,id:i,error:random(s)*50-25,skill:.7+random(s)*.28,decision:0,thrust:false});
 generate(s);return s;
}
export function trainingLesson(s){const stage=s.passed<3?0:s.passed<7?1:s.passed<12?2:3;return [
 {title:'1 · Schub kennenlernen',text:'Kurz halten: steigen. Loslassen: sinken. Schaffe 3 breite Tore.',target:3},
 {title:'2 · Die Mitte treffen',text:'Fange die goldenen Kristalle in der Mitte. Steuere mit kurzen Impulsen.',target:7},
 {title:'3 · Mut zur Kante',text:'Fliege knapp an einer Kante vorbei. Drei enge Durchflüge laden den Schild.',target:12},
 {title:'4 · Dein eigener Flow',text:'Übe bewegliche Tore, Ringe und Warnfelder. Treffer sind weiterhin verzeihbar.',target:null}][stage];}
export function storm(s){if(s.version==='CC1')return legacy.storm(s);if(s.mode==='training')return 0;const cycle=s.time%42;return s.time<30?0:Math.sin(clamp((cycle-29)/13,0,1)*Math.PI)*48;}
export function gateCenter(g,time){return g.center+(g.moving?Math.sin(time*.9+g.phase)*g.amplitude:0);}
export function laserActive(g,time){return g.kind==='laser'&&((time+g.phase)%5.5)>3.5;}
function generate(s){while(s.nextX<s.distance+W+650){const id=s.gateId++,training=s.mode==='training',rest=!training&&id>0&&id%18>=14;
 const difficulty=clamp(s.nextX/32000,0,1);let gap=training?(id<3?370:id<7?340:310):rest?320:290-difficulty*78;
 let center=clamp(s.lastCenter+(random(s)-.5)*(training&&id<3?90:210),190,530);
 const roll=random(s);let kind='gate';if((!training&&id>7)||(training&&id>=12)){if(!rest&&id%7===4)kind='ring';else if(!rest&&id%9===7)kind='laser';}
 if(kind==='ring')center=clamp(center+((id%2)?45:-45),190,530);
 const moving=!rest&&id>10&&kind==='gate'&&roll>.64;
 s.gates.push({id,x:s.nextX,center,gap,w:72,moving,amplitude:training?14:22,phase:random(s)*Math.PI*2,passed:false,coin:false,kind,rest,touched:false,ringCollected:false});
 s.lastCenter=center;s.nextX+=rest?440:340+random(s)*70;
 }}
export function score(s){return Math.floor(s.time)*10+s.passed*25+s.coins*10+(s.nearScore||0)+(s.over&&s.mode==='arena'?({1:500,2:300,3:150}[s.rank]||0):0);}
function safePosition(s,p,g){if(g)p.y=clamp(gateCenter(g,s.time),RADIUS+8,H-RADIUS-8);else p.y=clamp(p.y,RADIUS+12,H-RADIUS-12);p.v=0;p.heat=0;}
function hit(s,p,g){if(p.inv>0){if(p.y<RADIUS||p.y>H-RADIUS)safePosition(s,p);return;}
 if(p.shield){p.shield=0;p.inv=1.4;safePosition(s,p,g);if(p===s.player){s.combo=0;s.events.push('shield');}return;}
 if(s.mode==='training'&&p===s.player){p.inv=1.6;safePosition(s,p,g);s.trainingHits++;s.events.push('practice');return;}
 p.alive=false;p.deathTime=s.time;if(p===s.player)s.events.push('dead');
}
function fly(p,held,dt){p.v=clamp(p.v+(held?-710:620)*dt,-300,350);p.y+=p.v*dt;p.inv=Math.max(0,p.inv-dt);}
function collisions(s,p,dt){if(!p.alive)return;const edge=storm(s);if(p.y<RADIUS||p.y>H-RADIUS)hit(s,p);if(!p.alive)return;
 p.heat=clamp(p.heat+((p.y<edge+RADIUS||p.y>H-edge-RADIUS)?1.1:-1.8)*dt,0,1);if(p.heat>=1)hit(s,p);
 const pos=s.distance+p.x;
 for(const g of s.gates){if(pos+RADIUS>g.x&&pos-RADIUS<g.x+g.w){const c=gateCenter(g,s.time);const unsafe=p.y-RADIUS<c-g.gap/2||p.y+RADIUS>c+g.gap/2;
  // A warning gate only energizes outside its generous safe passage.
  if(unsafe&&g.kind!=='ring'&&(g.kind!=='laser'||laserActive(g,s.time))){if(p===s.player)g.touched=true;hit(s,p,g);if(!p.alive)return;}
 }}
}
function reward(s,p){const pos=s.distance+p.x;for(const g of s.gates){if(g.id<=p.lastGate||pos-RADIUS<=g.x+g.w)continue;p.lastGate=g.id;
 if(p===s.player){g.passed=true;s.passed++;s.events.push('gate');}
 const clearance=g.gap/2-Math.abs(p.y-gateCenter(g,s.time))-RADIUS;
 if(g.kind!=='ring'&&clearance>=0&&clearance<34&&!(p===s.player&&g.touched)){p.charge++;if(p===s.player){s.near++;s.combo=Math.min(s.combo+1,4);s.nearScore+=40*[1,1.5,2,3][s.combo-1];s.events.push('near');}if(p.charge>=3&&!p.shield){p.charge=0;p.shield=1;if(p===s.player)s.events.push('charged');}p.charge=Math.min(p.charge,2);}
 else if(p===s.player)s.combo=0;
}}
export function step(s,held,dt=STEP){if(s.version==='CC1'){legacy.step(s,held,dt);return;}if(s.over)return;s.events=[];s.time+=dt;s.speed=s.mode==='training'?135+Math.min(30,s.time*.1):195+Math.min(75,s.time*.32);s.distance+=s.speed*dt;generate(s);
 fly(s.player,held,dt);collisions(s,s.player,dt);
 if(s.player.alive){const pos=s.distance+s.player.x;for(const g of s.gates){const center=gateCenter(g,s.time);if(!g.coin&&Math.abs(pos-(g.x+g.w/2))<27&&Math.abs(s.player.y-center)<36){g.coin=true;s.coins++;s.events.push('coin');}
 if(g.kind==='ring'&&!g.ringCollected&&Math.abs(pos-(g.x+g.w/2))<22&&Math.abs(s.player.y-center)<55){g.ringCollected=true;s.coins+=2;s.nearScore+=60;s.events.push('ring');}}
 reward(s,s.player);}
 for(const b of s.bots){if(!b.alive)continue;b.decision-=dt;if(b.decision<=0){const next=s.gates.find(g=>g.x+g.w>s.distance+b.x-RADIUS);const target=next?gateCenter(next,s.time)+b.error:360;b.thrust=b.y+b.v*.22>target;b.decision=.08+(1-b.skill)*.25;if(random(s)>(.997-Math.min(.012,s.time/10000)))b.error=(random(s)-.5)*220;}fly(b,b.thrust,dt);collisions(s,b,dt);if(b.alive)reward(s,b);}
 s.gates=s.gates.filter(g=>g.x+g.w>s.distance-100);
 if(!s.player.alive){s.over=true;s.rank=1+s.bots.filter(b=>b.alive).length;}else if(s.mode==='arena'&&s.bots.every(b=>!b.alive)){s.over=true;s.won=true;s.rank=1;s.events.push('win');}
 s.score=score(s);
}
export function snapshot(s){const copy=JSON.parse(JSON.stringify(s));copy.events=[];return copy;}
export function validSnapshot(s){try{
 const num=(o,keys)=>o&&typeof o==='object'&&keys.every(k=>typeof o[k]==='number'&&Number.isFinite(o[k]));
 if(!s||!['CC1',RULES].includes(s.version)||!['endless','arena','training','challenge'].includes(s.mode)||s.over!==false||!s.player||s.player.alive!==true)return false;
 if(!num(s,['time','distance','speed','nextX','lastCenter','rng','seed','passed','coins','near','combo','score','gateId'])||s.time<0||s.time>864000||s.distance<0||s.distance>250000000||s.nextX<s.distance||s.nextX>s.distance+3000||s.passed<0||s.coins<0)return false;
 if(!Array.isArray(s.gates)||s.gates.length<1||s.gates.length>20||!Array.isArray(s.bots)||s.bots.length>7||!Array.isArray(s.events))return false;
 const player=p=>num(p,['y','v','shield','charge','inv','heat'])&&Math.abs(p.y)<=10000&&Math.abs(p.v)<=1000&&[0,1].includes(p.shield)&&p.inv>=0&&p.inv<=2&&p.charge>=0&&p.charge<=3&&p.heat>=0&&p.heat<=1;
 if(!player(s.player)||!s.bots.every(b=>player(b)&&num(b,['id','error','skill','decision'])&&typeof b.alive==='boolean'))return false;
 if(s.version===RULES&&![s.player,...s.bots].every(p=>num(p,['x','lastGate'])&&p.x>=50&&p.x<=PX))return false;
 if(!s.gates.every(g=>num(g,['x','center','gap','w','phase','amplitude','id'])&&g.x>s.distance-300&&g.x<s.distance+3000&&g.center>=150&&g.center<=570&&g.gap>=150&&g.gap<=400&&g.w===72&&g.amplitude>=0&&g.amplitude<=30&&(s.version==='CC1'||['gate','ring','laser'].includes(g.kind))))return false;
 if(s.nearScore!==undefined&&(!Number.isFinite(s.nearScore)||s.nearScore<0))return false;
 return typeof s.code==='string'&&(s.mode!=='challenge'||new RegExp(`^${s.version}-[A-Z0-9]{3,12}$`).test(s.code));
 }catch{return false;}}
