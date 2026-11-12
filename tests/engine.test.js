import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,step,snapshot,validSnapshot,challengeSeed,gateCenter,storm,STEP,PX} from '../engine.js';
function autopilot(s,seconds){for(let i=0;i<seconds/STEP&&!s.over;i++){const g=s.gates.find(g=>g.x+g.w>s.distance+PX-16);const target=g?gateCenter(g,s.time):360;step(s,s.player.y+s.player.v*.22>target);}return s;}
test('same challenge and inputs reproduce the exact simulation',()=>{const seed=challengeSeed('CC2-ABC123');const a=autopilot(createGame('challenge',seed,'CC2-ABC123'),90);const b=autopilot(createGame('challenge',seed,'CC2-ABC123'),90);assert.deepEqual(a,b);assert.ok(a.passed>10);});
test('malformed challenge codes rejected',()=>{for(const c of ['','CC4-ABC','CC1-A','<script>','CC1-ABC DEF'])assert.throws(()=>challengeSeed(c));});
test('snapshot and restore preserve deterministic continuation',()=>{const a=autopilot(createGame('endless',82),35),b=snapshot(a);assert.ok(validSnapshot(b));autopilot(a,30);autopilot(b,30);assert.deepEqual(a,b);});
test('endless remains playable past 30 minutes without time cap',()=>{const s=autopilot(createGame('endless',4),1801);assert.equal(s.over,false);assert.ok(s.time>1800);assert.ok(s.passed>1000);assert.ok(s.speed<=270);assert.ok(s.gates.length<=7);});
test('all generated gaps remain bounded and centers connected',()=>{for(let seed=1;seed<=40;seed++){const s=autopilot(createGame('endless',seed),180);assert.ok(s.time>179,`seed ${seed} died at ${s.time}`);for(const g of s.gates){assert.ok(g.gap>=212);assert.ok(g.center>=190&&g.center<=530);}}});
test('release drops; held thrust rises; speed is bounded',()=>{const a=createGame(),b=createGame();for(let i=0;i<30;i++){step(a,false);step(b,true);}assert.ok(a.player.y>360);assert.ok(b.player.y<360);assert.ok(a.player.v<=350&&b.player.v>=-300);});
test('collision ends normal game once, future steps do nothing',()=>{const s=createGame();s.player.y=1;step(s,false);assert.ok(s.over);const copy=snapshot(s);step(s,true);assert.deepEqual(snapshot(s),copy);});
test('shield absorbs hit and gives temporary invulnerability',()=>{const s=createGame();s.player.shield=1;s.player.y=1;step(s,false);assert.equal(s.over,false);assert.equal(s.player.shield,0);assert.ok(s.player.inv>0);step(s,false);assert.equal(s.over,false);});
test('training survives collisions and counts practice hits',()=>{const s=createGame('training');s.player.y=1;step(s,false);assert.equal(s.over,false);assert.equal(s.trainingHits,1);});
test('arena contains seven real simulated opponents',()=>{const s=createGame('arena',85);assert.equal(s.bots.length,7);step(s,false);assert.ok(s.bots.every(b=>Number.isFinite(b.y)));});
test('arena win is awarded when all opponents are out',()=>{const s=createGame('arena');s.bots.forEach(b=>b.alive=false);step(s,true);assert.ok(s.over&&s.won);assert.equal(s.rank,1);assert.equal(s.score,500);});
test('storm periodically recedes completely and never closes the whole field',()=>{const s=createGame();s.time=36;assert.ok(storm(s)>0&&storm(s)<=48);s.time=43;assert.equal(storm(s),0);});
test('snapshot validation rejects malformed and nonfinite state',()=>{assert.equal(validSnapshot({}),false);const s=createGame();s.player.y=NaN;assert.equal(validSnapshot(s),false);});
