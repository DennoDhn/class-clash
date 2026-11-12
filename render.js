import {H,W,PX,gateCenter,storm,laserActive,viewport} from './engine.js';
const palettes=[['#aee5e3','#f9e2c4','#ffbba7','#e5b1ab','#7eaeb7','#486d87'],['#afb9e8','#f3bed0','#ffcfac','#9c9ed0','#697aaf','#414d80'],['#a2d9e1','#dceae1','#f8dfa7','#9fc7c3','#6aa2ae','#3f7489']];
export function round(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
export function pilot(c,x,y,size,color='#a5ff7a',thrust=false,time=0,ghost=false,gear={}){c.save();c.translate(x,y);c.scale(size/60,size/60);c.globalAlpha*=ghost?.48:1;
 if(thrust){const f=17+Math.sin(time*45)*6;c.fillStyle='#ff864f';c.beginPath();c.moveTo(-21,13);c.lineTo(-17,27+f);c.lineTo(-9,13);c.fill();c.fillStyle='#fff0a9';c.beginPath();c.moveTo(-19,14);c.lineTo(-16,23+f*.6);c.lineTo(-12,14);c.fill();}
 if(gear.pack==='pack-wing'){c.fillStyle='#d7f3ee';c.beginPath();c.moveTo(-23,-4);c.lineTo(-49,-25);c.lineTo(-35,21);c.lineTo(-20,24);c.fill();}
 if(gear.pack==='pack-twin'){round(c,-33,-8,10,36,5,'#7ab6c9');round(c,-24,-12,10,40,5,'#bce8e2');}else round(c,-29,-4,13,29,5,'#344359');round(c,-25,-9,9,19,4,'#f5ae73');
 round(c,-12,17,10,17,4,'#26374b');round(c,4,17,10,17,4,'#26374b');round(c,-15,28,15,8,4,'#172c40');round(c,2,28,17,8,4,'#172c40');
 round(c,-18,-7,37,34,12,color);round(c,9,1,19,11,5,color);round(c,20,2,10,10,4,'#20374c');
 round(c,-20,-34,44,37,16,color);
 if(gear.helmet==='helm-cat'){c.fillStyle=color;for(const x of [-18,12]){c.beginPath();c.moveTo(x,-25);c.lineTo(x+2,-47);c.lineTo(x+13,-29);c.fill();}}
 if(gear.helmet==='helm-comet'){round(c,-4,-44,9,17,4,'#fff4dc');round(c,5,-39,17,5,2,'#ffad7e');}
 if(gear.helmet==='helm-crown'){c.fillStyle='#ffd16b';c.beginPath();c.moveTo(-18,-31);c.lineTo(-21,-49);c.lineTo(-7,-40);c.lineTo(1,-54);c.lineTo(9,-40);c.lineTo(23,-49);c.lineTo(21,-31);c.fill();}round(c,-12,-27,34,22,10,'#1e354b');round(c,-5,-23,22,7,3,'#6cb5c5');round(c,11,-22,4,11,2,'#b8f4ed');
 round(c,-5,5,14,9,3,'#f7f3dc');round(c,-3,7,5,5,1,'#263d50');c.restore();}
function cloud(c,x,y,s,alpha){c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=alpha;c.fillStyle='#fff9e9';c.beginPath();c.ellipse(0,0,75,14,0,0,7);c.ellipse(-22,-12,26,24,0,0,7);c.ellipse(16,-22,34,33,0,0,7);c.ellipse(49,-5,26,19,0,0,7);c.fill();c.restore();}
function island(c,x,y,w){c.fillStyle='#466d78';c.beginPath();c.moveTo(x-w/2,y);c.lineTo(x+w/2,y);c.lineTo(x+w*.28,y+34);c.lineTo(x-w*.05,y+78);c.lineTo(x-w*.3,y+31);c.closePath();c.fill();c.fillStyle='#a1bb8c';c.beginPath();c.ellipse(x,y,w/2,12,0,0,7);c.fill();round(c,x-w*.24,y-34,w*.15,33,3,'#e0dac1');round(c,x-w*.05,y-57,w*.14,56,3,'#ddd7c5');round(c,x+w*.11,y-25,w*.16,25,3,'#cfcebb');}
export function background(c,w,time,distance=0,reduced=false){const p=palettes[Math.floor(distance/18000)%palettes.length];const grad=c.createLinearGradient(0,0,0,H);grad.addColorStop(0,p[0]);grad.addColorStop(.65,p[1]);grad.addColorStop(1,p[2]);c.fillStyle=grad;c.fillRect(0,0,w,H);
 const sunX=w*.72;c.fillStyle='#fff1ca';c.beginPath();c.arc(sunX,230,82,0,Math.PI*2);c.fill();c.strokeStyle='#fff5df66';c.lineWidth=1;c.beginPath();c.arc(sunX,230,103,0,7);c.stroke();
 for(let layer=0;layer<3;layer++){c.fillStyle=p[3+layer];c.beginPath();c.moveTo(-20,H);for(let x=-20;x<=w+40;x+=20){const d=x+distance*(.04+layer*.035);const y=540+layer*47+Math.sin(d*.006+layer*2)*37+Math.sin(d*.016)*15;c.lineTo(x,y);}c.lineTo(w+40,H);c.fill();}
 const drift=reduced?0:time*5;for(let i=0;i<6;i++){const x=((i*303-drift-distance*.04)%(w+300)+(w+300))%(w+300)-130;cloud(c,x,110+(i%3)*102,.55+(i%2)*.25,.46);}
 for(let i=0;i<3;i++){const x=((i*490+300-distance*.16)%(w+600)+(w+600))%(w+600)-130;island(c,x,440+(i%2)*75,140-i*16);}
}
function gate(c,x,center,gap,width,id){const top=center-gap/2,bottom=center+gap/2;
 const grad=c.createLinearGradient(x,0,x+width,0);grad.addColorStop(0,'#284d5d');grad.addColorStop(.45,'#3e6975');grad.addColorStop(1,'#203f52');
 for(const [y,h] of [[-20,top+20],[bottom,H-bottom+20]]){round(c,x,y,width,h,8,grad);c.fillStyle='#ffffff10';c.fillRect(x+8,y+10,8,h-20);c.strokeStyle='#96d5cd22';c.lineWidth=1;for(let yy=y+45;yy<y+h-10;yy+=55){c.beginPath();c.moveTo(x+20,yy);c.lineTo(x+width-10,yy);c.stroke();}}
 round(c,x-9,top-19,width+18,20,5,'#a5e9cd');round(c,x-9,bottom,width+18,20,5,'#a5e9cd');round(c,x-7,top-7,width+14,5,2,'#e2ffc9');round(c,x-7,bottom+2,width+14,5,2,'#e2ffc9');
 c.font='bold 11px monospace';c.textAlign='center';c.fillStyle='#a3d2cc';c.fillText(String(id+1).padStart(2,'0'),x+width/2,top-34);
}
export class Renderer{
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.w=W;this.particles=[];this.last=0;}
 reset(){this.particles=[];this.last=0;}
 burst(type,s){const count=type==='shield'?32:type==='dead'?25:12;const tint=type==='shield'?'#c9ffb4':type==='dead'?'#ff9b7e':'#ffd578';for(let i=0;i<count;i++){const a=i/count*Math.PI*2;this.particles.push({x:s.distance+(s.player.x||PX),y:s.player.y,vx:Math.cos(a)*(35+Math.random()*75),vy:Math.sin(a)*(35+Math.random()*75),born:s.time,life:.5+Math.random()*.3,tint,size:2+Math.random()*3});}this.particles=this.particles.slice(-100);}

 resize(){const rect=this.canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(rect.width*dpr);this.canvas.height=Math.round(rect.height*dpr);this.width=rect.width;this.height=rect.height;this.dpr=dpr;this.w=H*rect.width/Math.max(1,rect.height);this.scale=this.canvas.height/H;this.view=viewport(rect.width,rect.height);this.canvas.parentElement.style.setProperty('--arena-top',this.view.y+'px');this.canvas.parentElement.style.setProperty('--arena-bottom',(rect.height-this.view.y-H*this.view.scale)+'px');}
 draw(s,{color='#a5ff7a',held=false,reduced=false,menu=false,time=0,gear={}}={}){const c=this.c;let w=this.w;c.setTransform(this.scale,0,0,this.scale,0,0);if(!menu){c.setTransform(this.dpr,0,0,this.dpr,0,0);const outer=c.createLinearGradient(0,0,0,this.height);outer.addColorStop(0,'#b0dfdd');outer.addColorStop(.5,'#e5e3d1');outer.addColorStop(1,'#294b61');c.fillStyle=outer;c.fillRect(0,0,this.width,this.height);const v=this.view;c.save();c.beginPath();c.rect(v.x,v.y,W*v.scale,H*v.scale);c.clip();c.setTransform(v.scale*this.dpr,0,0,v.scale*this.dpr,v.x*this.dpr,v.y*this.dpr);w=W;}const t=menu?time:s.time;const distance=menu?time*30:s.distance;background(c,w,t,distance,reduced);
 if(menu){const xx=w*.6;for(let i=0;i<3;i++){c.strokeStyle='#fffae6aa';c.lineWidth=2;c.beginPath();c.ellipse(xx+100+i*90,340-i*20,20,45,0,0,7);c.stroke();}c.save();c.translate(xx,335+Math.sin(t*1.4)*14);c.rotate(-.12);pilot(c,0,0,128,color,true,t,false,gear);c.restore();
  c.save();c.translate(w*.22,230+Math.sin(t)*9);c.rotate(.1);pilot(c,0,0,45,'#ff9b80',true,t,true);c.restore();return;}
 const offset=0;
 for(const g of s.gates){const x=g.x-s.distance+offset;if(x>w+100||x<-120)continue;const center=gateCenter(g,s.time);if(g.kind==='ring'){c.save();c.translate(x+g.w/2,center);c.strokeStyle=g.ringCollected?'#bdffbd':'#ffe7a3';c.lineWidth=7;c.beginPath();c.ellipse(0,0,24,64,0,0,7);c.stroke();c.lineWidth=1;c.strokeStyle='#ffffff88';c.beginPath();c.ellipse(0,0,33,75,0,0,7);c.stroke();c.restore();}else if(g.kind==='laser'){
 const active=laserActive(g,t);c.fillStyle=active?'#d17a9677':'#d17a9618';c.fillRect(x,0,g.w,center-g.gap/2);c.fillRect(x,center+g.gap/2,g.w,H-center-g.gap/2);c.setLineDash(active?[]:[6,8]);c.strokeStyle=active?'#ff657f':'#9d687a';c.lineWidth=active?5:2;for(const y of [center-g.gap/2,center+g.gap/2]){c.beginPath();c.moveTo(x-6,y);c.lineTo(x+g.w+6,y);c.stroke();}c.setLineDash([]);c.fillStyle='#63404f';c.font='bold 11px sans-serif';c.textAlign='center';c.fillText(active?'AKTIV':'! WARNFELD',x+g.w/2,center-g.gap/2-16);
 }else gate(c,x,center,g.gap,g.w,g.id);
 if(!g.coin){c.save();c.translate(x+g.w/2,center);c.rotate(Math.sin(t*3)*.1);c.fillStyle='#ffcc65';c.strokeStyle='#fff6bf';c.lineWidth=3;c.beginPath();c.moveTo(0,-13);c.lineTo(10,0);c.lineTo(0,13);c.lineTo(-10,0);c.closePath();c.fill();c.stroke();c.restore();}}
 for(const b of s.bots)if(b.alive)pilot(c,b.x??PX,b.y,40,['#ffa283','#bda6ff','#91dffc'][b.id%3],b.thrust,t,true);
 const p=s.player;const px=p.x??PX;
 if(held&&!reduced){const colors=gear.trail==='trail-rainbow'?['#ffa5b6','#ffdd8d','#b8f9ce','#a7dbff']:gear.trail==='trail-ice'?['#c5f4ff','#ffffff']:['#ffc072','#ff9974'];for(let j=0;j<colors.length;j++){c.strokeStyle=colors[j];c.globalAlpha=.55;c.lineWidth=3;c.beginPath();for(let i=0;i<7;i++){const xx=px-20-i*8,yy=p.y+13+j*4+Math.sin(t*7-i*.7)*5;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}c.globalAlpha=1;}
 c.save();c.translate(px,p.y);c.rotate(Math.max(-.25,Math.min(.32,p.v/1100)));
 if(p.inv>0)c.globalAlpha=.5+Math.sin(t*30)*.3;
 if(p.shield){c.strokeStyle='#eaffc2';c.fillStyle='#c6ffbd22';c.lineWidth=2;c.beginPath();c.arc(0,0,36+Math.sin(t*4)*2,0,7);c.fill();c.stroke();}
 pilot(c,0,0,58,color,held,t,false,gear);c.restore();
 if(!reduced){this.particles=this.particles.filter(p=>t-p.born<p.life);for(const q of this.particles){const age=t-q.born;c.globalAlpha=Math.max(0,1-age/q.life);c.fillStyle=q.tint;c.beginPath();c.arc(q.x-s.distance+q.vx*age,q.y+q.vy*age+60*age*age,q.size,0,7);c.fill();}c.globalAlpha=1;}
 const next=s.gates.find(g=>g.x+g.w>s.distance+px+16);if(next&&next.rest){c.fillStyle='#315b61';c.font='bold 11px sans-serif';c.textAlign='center';c.fillText('DURCHATMEN · FREIER ABSCHNITT',w/2,32);}

 const st=storm(s);if(st>0){const grad=c.createLinearGradient(0,0,0,st+20);grad.addColorStop(0,'#ba6bbedd');grad.addColorStop(1,'#ba6bbe00');c.fillStyle=grad;c.fillRect(0,0,w,st+20);c.save();c.translate(0,H);c.scale(1,-1);c.fillRect(0,0,w,st+20);c.restore();}
 if(p.heat>.1){c.strokeStyle=`rgba(255,80,80,${p.heat})`;c.lineWidth=10;c.strokeRect(0,0,w,H);}
 c.restore();
 }
}
