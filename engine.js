// Pure deterministic simulation. The renderer never changes game state.
export const RULES = 'CC1';
export const H = 720, PX = 170, RADIUS = 16, STEP = 1 / 120;
export const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
export function hash(str) { let h=2166136261; for(const c of str) h=Math.imul(h^c.charCodeAt(0),16777619); return h>>>0; }
export function random(s) { s.rng=(s.rng+0x6D2B79F5)>>>0; let t=s.rng; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }
export function challengeSeed(code) { if(!/^CC1-[A-Z0-9]{3,12}$/.test(code)) throw new Error('Codeformat: CC1-ABC123 (3–12 Buchstaben oder Zahlen).'); return hash(code); }
export function createGame(mode='endless',seed=12345,code='') {
 const s={version:RULES,mode,seed,code,rng:seed>>>0,time:0,distance:0,speed:195,nextX:690,lastCenter:360,gates:[],gateId:0,player:{y:360,v:0,alive:true,shield:0,charge:0,inv:0,heat:0},bots:[],passed:0,coins:0,near:0,combo:0,score:0,over:false,won:false,rank:null,events:[],trainingHits:0};
 if(mode==='arena') for(let i=0;i<7;i++) s.bots.push({y:330+i*9,v:0,alive:true,shield:0,charge:0,inv:0,heat:0,id:i,error:random(s)*50-25,skill:.7+random(s)*.28,decision:0,thrust:false,passed:0});
 generate(s); return s;
}
export function storm(s) { const cycle=s.time%42; return s.time<30?0:Math.sin(clamp((cycle-29)/13,0,1)*Math.PI)*48; }
export function gateCenter(g,time) { return g.center + (g.moving?Math.sin(time*.9+g.phase)*g.amplitude:0); }
function generate(s) {
 while(s.nextX<s.distance+1550) {
  const difficulty=clamp(s.nextX/32000,0,1), gap=290-difficulty*78;
  const center=clamp(s.lastCenter+(random(s)-.5)*210,190,530);
  s.gates.push({id:s.gateId++,x:s.nextX,center,gap,w:72,moving:s.gateId>10&&random(s)>.64,amplitude:22,phase:random(s)*Math.PI*2,passed:false,coin:false});
  s.lastCenter=center; s.nextX+=340+random(s)*70;
 }
}
export function score(s) { return Math.floor(s.time)*10+s.passed*25+s.coins*10+s.nearScore+(s.over&&s.mode==='arena'?({1:500,2:300,3:150}[s.rank]||0):0); }
function hit(s,p) {
 if(p.inv>0)return;
 if(p.shield) {p.shield=0;p.inv=1.4;p.heat=0;if(p===s.player){s.combo=0;s.events.push('shield');}return;}
 if(s.mode==='training'&&p===s.player){p.inv=1.6;p.heat=0;p.y=clamp(p.y,60,H-60);s.trainingHits++;s.events.push('practice');return;}
 p.alive=false;p.deathTime=s.time;
 if(p===s.player) {s.rank=1+s.bots.filter(b=>b.alive).length;s.over=true;s.events.push('dead');}
}
function fly(p,held,dt) {p.v=clamp(p.v+(held?-710:620)*dt,-300,350);p.y+=p.v*dt;p.inv=Math.max(0,p.inv-dt);}
function collisions(s,p) {
 if(!p.alive)return;
 const edge=storm(s);
 if(p.y<RADIUS||p.y>H-RADIUS)hit(s,p);
 p.heat=clamp(p.heat+((p.y<edge+RADIUS||p.y>H-edge-RADIUS)?1.1:-1.8)*STEP,0,1);
 if(p.heat>=1)hit(s,p);
 const pos=s.distance+PX;
 for(const g of s.gates){
  if(pos+RADIUS>g.x&&pos-RADIUS<g.x+g.w){const c=gateCenter(g,s.time);if(p.y-RADIUS<c-g.gap/2||p.y+RADIUS>c+g.gap/2)hit(s,p);}
 }
}
export function step(s,held,dt=STEP){
 if(s.over)return;
 s.events=[];s.nearScore??=0;s.time+=dt;s.speed=195+Math.min(75,s.time*.32);s.distance+=s.speed*dt;
 fly(s.player,held,dt); generate(s); collisions(s,s.player);
 const pos=s.distance+PX;
 for(const g of s.gates){
  const center=gateCenter(g,s.time);
  if(!g.coin&&Math.abs(pos-(g.x+g.w/2))<27&&Math.abs(s.player.y-center)<36&&s.player.alive){g.coin=true;s.coins++;s.events.push('coin');}
  if(!g.passed&&pos-RADIUS>g.x+g.w&&s.player.alive){g.passed=true;s.passed++;s.events.push('gate');
   const clearance=g.gap/2-Math.abs(s.player.y-center)-RADIUS;
   if(clearance>=0&&clearance<34){s.near++;s.combo=Math.min(s.combo+1,4);s.nearScore+=40*[1,1.5,2,3][s.combo-1];s.player.charge++;s.events.push('near');if(s.player.charge>=3){s.player.charge=0;s.player.shield=1;s.events.push('charged');}}
   else s.combo=0;
  }
 }
 for(const b of s.bots){if(!b.alive)continue;b.decision-=dt;
  if(b.decision<=0){const next=s.gates.find(g=>g.x+g.w>pos-RADIUS);const target=next?gateCenter(next,s.time)+b.error:360;b.thrust=b.y+b.v*.22>target;b.decision=.08+(1-b.skill)*.25;
   if(random(s)>(.997-Math.min(.012,s.time/10000)))b.error=(random(s)-.5)*220;}
  fly(b,b.thrust,dt);collisions(s,b);
 }
 s.gates=s.gates.filter(g=>g.x+g.w>s.distance-100);
 if(s.mode==='arena'&&!s.over&&s.bots.every(b=>!b.alive)){s.over=true;s.won=true;s.rank=1;s.events.push('win');}
 s.score=score(s);
}
export function snapshot(s) {const copy=JSON.parse(JSON.stringify(s));copy.events=[];return copy;}
export function validSnapshot(s) {
 if(!s||s.version!==RULES||!['endless','arena','training','challenge'].includes(s.mode)||s.over!==false)return false;
 if(!s.player||!s.player.alive||!Array.isArray(s.gates)||s.gates.length<1||s.gates.length>20||!Array.isArray(s.bots)||s.bots.length>7)return false;
 const finite=(o,keys)=>keys.every(k=>typeof o[k]==='number'&&Number.isFinite(o[k]));
 return finite(s,['time','distance','speed','nextX','lastCenter','rng','seed','passed','coins','near','combo','score','gateId'])&&s.time>=0&&s.time<864000&&s.distance>=0&&finite(s.player,['y','v','shield','charge','inv','heat'])&&s.gates.every(g=>finite(g,['x','center','gap','w','phase','amplitude','id'])&&g.gap>=150&&g.gap<=320&&g.w===72)&&s.bots.every(b=>finite(b,['y','v','shield','charge','inv','heat','id','error','skill','decision']));
}
