// 도란도란 마을 - 로우폴리 3D 모델 (버텍스 컬러, 공유 지오메트리)
const M3={};
(function(){
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_e=new THREE.Euler(),_s=new THREE.Vector3(),_p=new THREE.Vector3(),_c=new THREE.Color();
const G={box:new THREE.BoxGeometry(1,1,1),cyl:new THREE.CylinderGeometry(1,1,1,8),cyl12:new THREE.CylinderGeometry(1,1,1,12),sph:new THREE.SphereGeometry(1,12,8),sphHi:new THREE.SphereGeometry(1,18,12),ico:new THREE.IcosahedronGeometry(1,1),cone4:new THREE.ConeGeometry(Math.SQRT1_2,1,4,1)};
for(const k in G){G[k]=G[k].index?G[k].toNonIndexed():G[k];G[k].deleteAttribute('uv')}
const cache=new Map();
function partial(a,b,c,d){const k='s'+[a,b,c,d];if(!cache.has(k)){let g=new THREE.SphereGeometry(1,16,10,a,b,c,d).toNonIndexed();g.deleteAttribute('uv');cache.set(k,g)}return cache.get(k)}
function capG(r,l){const k='c'+r.toFixed(3)+l.toFixed(3);if(!cache.has(k)){let g=new THREE.CapsuleGeometry(r,Math.max(.001,l),3,8).toNonIndexed();g.deleteAttribute('uv');cache.set(k,g)}return cache.get(k)}
function geo(k,f){if(!cache.has(k)){let g=f();g=g.index?g.toNonIndexed():g;if(g.attributes.uv)g.deleteAttribute('uv');cache.set(k,g)}return cache.get(k)}
function put(L,g,col,x,y,z,o){o=o||{};const n=g.clone();_e.set(o.rx||0,o.ry||0,o.rz||0);_q.setFromEuler(_e);_s.set(o.sx??1,o.sy??1,o.sz??1);_p.set(x,y,z);_m.compose(_p,_q,_s);if(o.M)_m.premultiply(o.M);n.applyMatrix4(_m);
 const cnt=n.attributes.position.count,c=new Float32Array(cnt*3);_c.set(col);const nm=n.attributes.normal,sh=o.shade,j=o.jit||0;
 for(let i=0;i<cnt;i++){let k=1;if(sh)k*=sh[0]+sh[1]*(nm.getY(i)*.5+.5)+(sh[2]||0)*(-nm.getX(i)*.5+nm.getZ(i)*.3);if(j)k*=1+(Math.random()-.5)*j;c[i*3]=_c.r*k;c[i*3+1]=_c.g*k;c[i*3+2]=_c.b*k}
 n.setAttribute('color',new THREE.BufferAttribute(c,3));L.push(n);return n}
const bx=(L,col,x,y,z,w,h,d,o)=>put(L,G.box,col,x,y,z,Object.assign({sx:w,sy:h,sz:d},o||{}));
const cy=(L,col,x,y,z,r,h,o)=>put(L,G.cyl,col,x,y,z,Object.assign({sx:r,sy:h,sz:r},o||{}));
const sp=(L,col,x,y,z,r,o)=>put(L,G.sph,col,x,y,z,Object.assign({sx:r,sy:r,sz:r},o||{}));
function merge(L){if(!L.length)return new THREE.BufferGeometry();const g=THREE.mergeGeometries(L,false);L.forEach(x=>x.dispose());L.length=0;return g}
const VC=new THREE.MeshLambertMaterial({vertexColors:true});
const GLASS=new THREE.MeshLambertMaterial({color:0x2b4d68,emissive:0xffc061,emissiveIntensity:0});
M3.VC=VC;M3.GLASS=GLASS;M3.put=put;M3.bx=bx;M3.merge=merge;M3.G=G;
// ---------- textures (작은 반복 텍스처)
const hh=(x,y)=>{const s=Math.sin(x*12.9898+y*78.233)*43758.5453;return s-Math.floor(s)};
function tex(f,n){n=n||128;const c=document.createElement('canvas');c.width=c.height=n;f(c.getContext('2d'),n);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
function herring(g,n,c1,c2,mo){g.fillStyle=mo;g.fillRect(0,0,n,n);const u=8;for(let s=-24;s<24;s+=4)for(let i=-12;i<28;i++){for(const[x,y,w,h]of[[s+i,i,2,1],[s+i+2,i-1,1,2]]){const px=x*u,py=y*u,k=hh(((px%n)+n)%n,((py%n)+n)%n);g.fillStyle=k<.5?c1:c2;g.globalAlpha=1;g.fillRect(px+1,py+1,w*u-2,h*u-2);g.fillStyle=`rgba(${k>.7?255:0},${k>.7?255:0},${k>.7?255:0},.08)`;g.fillRect(px+1,py+1,w*u-2,h*u-2);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(px+1,py+1,w*u-2,1);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(px+1,py+h*u-2,w*u-2,1)}}}
M3.tex={
 grass:()=>tex((g,n)=>{g.fillStyle='#5d8f3b';g.fillRect(0,0,n,n);for(let i=0;i<2600;i++){const x=Math.random()*n,y=Math.random()*n;g.strokeStyle=`hsla(${80+Math.random()*40},45%,${26+Math.random()*30}%,.8)`;g.beginPath();g.moveTo(x,y);g.lineTo(x+(Math.random()-.5)*3,y-2-Math.random()*4);g.stroke()}}),
 side:()=>tex((g,n)=>herring(g,n,'#cfa08a','#bf8f7f','#8f6d62')),
 plaza:()=>tex((g,n)=>herring(g,n,'#b9625a','#a7544c','#74403a')),
 road:()=>tex((g,n)=>{g.fillStyle='#4a4846';g.fillRect(0,0,n,n);const s=16;for(let y=-1;y<=n/s;y++)for(let x=-1;x<=n/s;x++){const px=x*s+(((y%2)+2)%2)*8,py=y*s,k=hh(((px%n)+n)%n,((py%n)+n)%n),v=92+k*50|0;g.fillStyle=`rgb(${v},${v-2},${v-6})`;g.beginPath();g.roundRect(px+1.5,py+1.5,s-3,s-3,5);g.fill();g.fillStyle='rgba(255,255,255,.15)';g.fillRect(px+4,py+3,s-8,2)}}),
 water:()=>tex((g,n)=>{g.fillStyle='#3a7db3';g.fillRect(0,0,n,n);g.strokeStyle='rgba(255,255,255,.3)';for(let i=0;i<26;i++){const x=Math.random()*n,y=Math.random()*n;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+6,y-2,x+12,y);g.stroke()}}),
 wood:()=>tex((g,n)=>{for(let r=0;r<8;r++){g.fillStyle=`hsl(28,38%,${36+Math.random()*10}%)`;g.fillRect(0,r*16,n,15);g.fillStyle='rgba(30,15,5,.5)';g.fillRect(0,r*16+15,n,1)}})};
function signTex(t,bg){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,256,64);g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=4;g.strokeRect(4,4,248,56);g.fillStyle='#fff';g.font='bold 34px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,128,34);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx}
// ---------- buildings
function building(L,GL,b,signs){const w=b.x1-b.x0,d=b.y1-b.y0,H=b.hu,cx=b.x0+w/2,cz=b.y0+d/2,dx=b.door.x+.5,shop=b.style!='house',W='#f6f2ea';
 const sh={shade:[.9,.1]};bx(L,b.wall,cx,H/2,cz,w,H,d,sh);bx(L,'#8a8178',cx,.07,cz,w+.05,.14,d+.05);bx(L,W,cx,H+.03,cz,w+.14,.1,d+.14);
 const F=(u,y,ww,hh,col,dep,out,G2)=>bx(G2||L,col,b.x0+u,y,b.y1+(out||.01),ww,hh,dep||.04),R=(u,y,ww,hh,col,dep,out,G2)=>bx(G2||L,col,b.x1+(out||.01),y,b.y0+u,dep||.04,hh,ww);
 const win=(f,u,y,ww,hh,shut)=>{f(u,y,ww+.08,hh+.08,W,.03,.008);f(u,y,ww,hh,'#2b4d68',.04,.02,GL);f(u,y-hh/2-.05,ww+.14,.04,W,.08,.04);if(shut){f(u-ww/2-ww*.18,y,ww*.32,hh+.04,shut,.03,.02);f(u+ww/2+ww*.18,y,ww*.32,hh+.04,shut,.03,.02)}};
 if(shop){const ac=AWN[b.kind]||'#e53935';bx(L,W,cx,1.22,cz,w+.06,.07,d+.06);
  const u0=dx-b.x0;if(u0-.45>.4)win(F,(u0-.45)/2+.1,.6,u0-.8,.7);const rw=w-u0-.45;if(rw>.5)win(F,u0+.45+rw/2,.6,rw-.3,.7);
  F(u0,.48,.62,.95,'#6b4a35',.05,.02);F(u0,.58,.45,.55,'#2b4d68',.03,.05,GL);
  bx(L,'#efe9df',cx,1.24,b.y1+.25,w-.15,.08,.5);for(const px of[b.x0+.22,b.x1-.22]){cy(L,W,px,.6,b.y1+.42,.06,1.2);bx(L,W,px,1.17,b.y1+.42,.15,.06,.15)}
  bx(L,'#ffffff',cx,1.55,b.y1+.48,w-.25,.04,.05);bx(L,'#ffffff',cx,1.3,b.y1+.48,w-.25,.03,.04);const n=Math.max(3,Math.floor(w/.35));for(let i=0;i<=n;i++)bx(L,'#ffffff',b.x0+.15+i*(w-.3)/n,1.42,b.y1+.48,.03,.26,.03);
  for(let i=0;i<6;i++)bx(L,i%2?'#fafafa':ac,b.x0+.25+(w-.5)*(i+.5)/6,1.06,b.y1+.18,(w-.5)/6,.03,.4,{rx:.6});
  for(let i=0;i<w;i++)if(H>2.7||Math.abs(i+.5-w/2)>.6)win(F,i+.5,H>2.7?2.05:1.8,.48,.52);if(H>2.7)win(F,w/2,2.55,.48,.4);
  for(let j=0;j<d;j++)for(const y of H>2.7?[.6,1.8,2.45]:[.6,1.8])win(R,j+.5,y,.46,.48);
  bx(L,b.roof,cx,H+.1,cz,w-.1,.04,d-.1);for(const[a,c,ww,dd]of[[cx,b.y0+.04,w+.14,.08],[cx,b.y1-.04,w+.14,.08]])bx(L,W,a,H+.17,c,ww,.16,dd);for(const a of[b.x0+.04,b.x1-.04])bx(L,W,a,H+.17,cz,.08,.16,d+.14);
  bx(L,'#b0bec5',b.x1-.7,H+.25,b.y0+.6,.6,.3,.45,sh);cy(L,'#90a4ae',b.x0+.6,H+.35,b.y0+.6,.2,.5);
  const sw=Math.min(w-.7,2.6),m=new THREE.Mesh(new THREE.PlaneGeometry(sw,.32),new THREE.MeshLambertMaterial({map:signTex(SIGN[b.kind]+' '+b.name,ac)}));m.position.set(cx,1.78,b.y1+.53);signs.push(m);bx(L,'#5d4037',cx,1.78,b.y1+.5,sw+.06,.38,.05);
 }else{const shut=b.roof;
  for(let i=0;i<w;i++){if(Math.floor(b.x0+i)==b.door.x)continue;win(F,i+.5,.95,.48,.48,shut)}for(let j=0;j<d;j++)win(R,j+.5,.95,.48,.48,shut);
  F(dx-b.x0,.47,.55,.9,'#7a5235',.05,.02);sp(L,'#e0c050',dx+.18,.45,b.y1+.06,.025);
  bx(L,'#8d6e63',dx,1.02,b.y1+.25,.95,.06,.55);for(const o of[-.4,.4])cy(L,W,dx+o,.5,b.y1+.48,.03,1);
  put(L,G.cone4,b.roof,cx,H+.53,cz,{ry:Math.PI/4,sx:w+.35,sy:.95,sz:d+.35,shade:[.65,.45,.15]});
  if(b.kind=='home')bx(L,'#a1887f',b.x0+.8,H+.7,b.y0+.8,.3,.7,.3,sh);
  for(let i=0;i<w;i++){if(Math.floor(b.x0+i)==b.door.x)continue;bx(L,'#8d6e63',b.x0+i+.5,.09,b.y1+.12,.7,.18,.18);for(let k=0;k<4;k++)sp(L,k%2?'#4caf50':['#ec407a','#ffeb3b','#ff7043','#ab47bc'][(i+k)%4],b.x0+i+.2+k*.2,.22,b.y1+.12,.07)}}}
// ---------- tree geometry (instanced)
function treeGeo(kind){const L=[];const bark='#6b4f3a';
 if(kind<2){cy(L,bark,0,.6,0,.065,1.2);const lc=kind?'#6aa83f':'#4f9234',cyY=kind?1.5:1.45;let seed=kind*7+1;const r=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  put(L,G.ico,lc,0,cyY,0,{sx:.4,sy:.38,sz:.4,shade:[.45,.7,.12],jit:.12});for(let i=0;i<9;i++){const a=r()*6.28,e=r()*1.6-.8,rr=.3+r()*.15;put(L,G.ico,lc,Math.cos(a)*rr,cyY+e*.4,Math.sin(a)*rr,{sx:.2+r()*.1,sy:.19+r()*.1,sz:.2+r()*.1,shade:[.42,.72,.12],jit:.15})}}
 else{cy(L,bark,0,.3,0,.06,.6);const lc=kind==2?'#2f6b35':'#3b7a3e';for(let i=0;i<4;i++)put(L,geo('pc',()=>new THREE.ConeGeometry(1,1,8)),lc,0,.65+i*.32,0,{sx:.5-i*.1,sy:.6,sz:.5-i*.1,shade:[.5,.6,.15],jit:.1})}
 return merge(L)}
// ---------- static world
M3.buildWorld=function(scene){const L=[],GL=[],signs=[];
 // ground by type
 const types={0:[],1:[],7:[],2:[],4:[],5:[]};for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=T[I(x,y)];if(t==3||t==6)t=2;if(t==1&&y>=27&&y<=30&&x>=2&&x<=12)t=7;(types[t]||types[0]).push([x,y])}
 const quad=(list,yy,us)=>{const p=[],uv=[],nm=[];for(const[x,z]of list){const v=[[x,z],[x,z+1],[x+1,z+1],[x,z],[x+1,z+1],[x+1,z]];for(const[a,b]of v){p.push(a,yy,b);uv.push(a*us,-b*us);nm.push(0,1,0)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(nm,3));return g};
 const TX=M3.tex;const gm={0:[TX.grass(),0,.5],1:[TX.side(),.04,.5],7:[TX.plaza(),.04,.5],2:[TX.road(),0,.5],4:[TX.water(),-.06,.35],5:[TX.wood(),.1,.5]};const meshes=[];
 for(const k in types){if(!types[k].length)continue;const[t,yy,us]=gm[k];const m=new THREE.Mesh(quad(types[k],yy,us),new THREE.MeshLambertMaterial({map:t}));m.receiveShadow=true;scene.add(m);meshes.push(m);if(k==4)M3.water=t}
 const out=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshLambertMaterial({color:0x4f7d33}));out.rotation.x=-Math.PI/2;out.position.set(W/2,-.08,H/2);scene.add(out);
 const ow=new THREE.Mesh(new THREE.PlaneGeometry(200,60),new THREE.MeshLambertMaterial({color:0x3a7db3}));ow.rotation.x=-Math.PI/2;ow.position.set(W/2,-.07,32+30);scene.add(ow);
 // curbs, stripes, lanes
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=T[I(x,y)];
  if(t==1)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=T[I(nx,ny)];if(n==1||n==5)continue;bx(L,'#b9b2a8',x+.5+dx*.48,.03,y+.5+dy*.48,dx?.05:1,.08,dx?1:.05)}
  if(t==3)for(let q=0;q<3;q++)bx(L,'#efefea',x+.18+q*.3,.006,y+.5,.15,.01,.86);
  if(t==6)for(let q=0;q<3;q++)bx(L,'#efefea',x+.5,.006,y+.18+q*.3,.86,.01,.15);
  if(t==2){if(HR.includes(y-1)&&!VR.some(c=>x==c||x==c+1))bx(L,'#f2c230',x+.4,.006,y,.45,.01,.06);if(VR.includes(x-1)&&!HR.some(r=>y==r||y==r+1))bx(L,'#f2c230',x,.006,y+.4,.06,.01,.45)}
  if(t==5)for(const px of[.1,.9])cy(L,'#5d4037',x+px,-.1,y+.9,.05,.4);
  if(t==0&&!BL[I(x,y)]&&hh(x*2,y*3)<.22&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>T[I(Math.min(W-1,Math.max(0,x+a)),Math.min(H-1,Math.max(0,y+b)))]==1))for(let k=0;k<2;k++)put(L,G.ico,'#3f7a2c',x+.3+k*.35,.12,y+.4+k*.2,{sx:.18,sy:.15,sz:.18,shade:[.45,.7,.1],jit:.2})}
 for(const b of BLD)building(L,GL,b,signs);
 for(const l of LAMPS){cy(L,'#2f3b33',l.x,.8,l.y,.03,1.6);cy(L,'#2f3b33',l.x,.06,l.y,.08,.12);put(GL,G.cyl,'#fff3c4',l.x,1.62,l.y,{sx:.08,sy:.18,sz:.08});put(L,G.cone4,'#2f3b33',l.x,1.77,l.y,{sx:.2,sy:.1,sz:.2})}
 for(const b of BENCH){const x=b.x,y=b.y;for(let i=0;i<3;i++)bx(L,'#9c6b45',x+.5,.26,y+.42+i*.09,.75,.03,.07);for(let i=0;i<2;i++)bx(L,'#9c6b45',x+.5,.38+i*.1,y+.37,.75,.07,.03);for(const px of[.2,.8])bx(L,'#333',x+px,.13,y+.5,.04,.26,.3)}
 for(const p of PROPS){const x=p.x,y=p.y;if(p.t=='bin'){cy(L,'#2e7d32',x,.19,y,.13,.38);cy(L,'#1b5e20',x,.4,y,.145,.05)}else if(p.t=='mail'){bx(L,'#333',x,.2,y,.06,.4,.06);bx(L,'#d32f2f',x,.55,y,.28,.3,.22)}else{cy(L,'#777',x,.7,y,.025,1.4);bx(L,'#1565c0',x,1.25,y,.7,.2,.03)}}
 {const c=[FOUNT.x0+1.5,FOUNT.y0+1.5],st='#ddd5c8';put(L,G.cyl12,st,c[0],.17,c[1],{sx:1.4,sy:.34,sz:1.4,shade:[.7,.3]});put(L,G.cyl12,'#5fa8d8',c[0],.35,c[1],{sx:1.25,sy:.02,sz:1.25});put(L,G.cyl12,st,c[0],.6,c[1],{sx:.18,sy:.9,sz:.18});put(L,G.cyl12,st,c[0],1.05,c[1],{sx:.6,sy:.16,sz:.6});put(L,G.cyl12,'#5fa8d8',c[0],1.14,c[1],{sx:.55,sy:.02,sz:.55});put(GL,G.sph,'#bfe6ff',c[0],1.45,c[1],{sx:.1,sy:.3,sz:.1})}
 const st=new THREE.Mesh(merge(L),VC);st.castShadow=st.receiveShadow=true;scene.add(st);
 const gl=new THREE.Mesh(merge(GL),GLASS);scene.add(gl);signs.forEach(s=>scene.add(s));
 // trees instanced
 const kinds=[[],[],[],[]];for(const t of TREES)kinds[t.pine?(hh(t.x,t.y+9)<.5?2:3):(hh(t.x+1,t.y)<.5?0:1)].push(t);const dm=new THREE.Object3D();
 kinds.forEach((list,k)=>{if(!list.length)return;const im=new THREE.InstancedMesh(treeGeo(k),VC,list.length);list.forEach((t,i)=>{dm.position.set(t.x+.5,0,t.y+.5);dm.rotation.y=hh(t.x,t.y)*6;dm.scale.setScalar(t.s);dm.updateMatrix();im.setMatrixAt(i,dm.matrix)});im.castShadow=im.receiveShadow=true;scene.add(im)});
 return{static:st}};
// ---------- car
M3.car=function(col,dir){const L=[];bx(L,col,0,.3,0,1.6,.32,.62,{shade:[.75,.35]});bx(L,'#2b4d68',-.08,.6,0,.9,.28,.56);bx(L,col,-.08,.76,0,.92,.05,.58);for(const x of[-.53,.35])for(const z of[-.3,.3])put(L,G.cyl12,'#1e1e1e',x,.15,z,{rx:Math.PI/2,sx:.14,sy:.1,sz:.14});for(const z of[-.2,.2])bx(L,'#fffbe0',.8,.33,z,.03,.07,.12);const m=new THREE.Mesh(merge(L),VC);m.castShadow=true;return m};
// ---------- items (instanced templates)
M3.itemGeo=function(t){const L=[],S=2.2;const o=(x)=>x*S;
 if(t=='coin'){put(L,G.cyl12,'#f2b81c',0,o(.065),0,{rx:Math.PI/2,ry:.6,sx:o(.06),sy:o(.014),sz:o(.06),shade:[.8,.4,.3]})}
 if(t=='clover'){cy(L,'#3f9e3a',0,o(.03),0,o(.005),o(.06));for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;sp(L,'#3f9e3a',o(Math.cos(a)*.026),o(.065),o(Math.sin(a)*.026),o(.024),{sy:o(.006)})}}
 if(t=='bottle'){put(L,G.cyl12,'#2e8b57',o(-.02),o(.03),0,{rz:1.35,sx:o(.032),sy:o(.12),sz:o(.032),shade:[.6,.6]});put(L,G.cyl12,'#2e8b57',o(.06),o(.045),0,{rz:1.35,sx:o(.013),sy:o(.06),sz:o(.013)})}
 if(t=='flower'){cy(L,'#3a8a35',0,o(.06),0,o(.005),o(.12));for(let i=0;i<6;i++){const a=i/6*Math.PI*2;sp(L,'#f06292',o(Math.cos(a)*.022),o(.125),o(Math.sin(a)*.022),o(.018),{sy:o(.007)})}sp(L,'#fbc02d',0,o(.13),0,o(.012))}
 if(t=='acorn'){sp(L,'#a0622d',0,o(.035),0,o(.03),{sy:o(.04),shade:[.6,.5]});sp(L,'#6b4a2e',0,o(.058),0,o(.033),{sy:o(.018)})}
 if(t=='trash'){put(L,G.ico,'#eeeeee',o(-.02),o(.035),0,{sx:o(.04),sy:o(.035),sz:o(.04),jit:.25});put(L,G.cyl12,'#b0bec5',o(.04),o(.022),o(.01),{rz:Math.PI/2,ry:.5,sx:o(.022),sy:o(.08),sz:o(.022)})}
 return merge(L)};
// ---------- people (6 types) : 일러스트 기반 실시간 3D 인형
const SKIN={a:'#f3d0b5',c:'#f7d9c4'};
const TYPES={
 mc:{n:'남자 어린이',g:'m',H:.96,hh:.205,leg:.42,S:.128,Wh:.085,lr:.034,ar:.026,skin:'#f6d3ba',idle:'pocket',def:{top:'#f6c514',pants:'#5b8fd0',hair:'#7a4a2a'}},
 mt:{n:'청소년 남자',g:'m',H:1.29,hh:.2,leg:.475,S:.165,Wh:.1,lr:.044,ar:.032,skin:'#f1cdb0',idle:'pocket1',def:{top:'#5f8fc8',pants:'#3f679f',hair:'#191513'}},
 ma:{n:'성인 남자',g:'m',H:1.33,hh:.19,leg:.49,S:.18,Wh:.105,lr:.047,ar:.034,skin:'#eec8a8',idle:'pocket',def:{top:'#22304d',pants:'#d8c3a0',hair:'#17120f'}},
 fc:{n:'여자 어린이',g:'f',H:.91,hh:.2,leg:.41,S:.118,Wh:.085,lr:.032,ar:.024,skin:'#f8dccb',idle:'clasp',def:{top:'#a6e0cc',pants:'#a6e0cc',hair:'#6e4126'}},
 ft:{n:'청소년 여자',g:'f',H:1.19,hh:.194,leg:.47,S:.138,Wh:.1,lr:.039,ar:.027,skin:'#f8dccc',idle:'clasp',def:{top:'#f5b9cb',pants:'#f1a8bf',hair:'#15110f'}},
 fa:{n:'성인 여자',g:'f',H:1.26,hh:.184,leg:.5,S:.145,Wh:.108,lr:.042,ar:.028,skin:'#f6d6c2',idle:'hip',def:{top:'#cdb9e6',pants:'#f4f1ec',hair:'#b4865a'}}};
M3.TYPES=TYPES;
function shadeHex(h,a){const c=new THREE.Color(h);c.offsetHSL(0,0,a);return '#'+c.getHexString()}
const V2=THREE.Vector2;
function latheG(pts,seg,gap){gap=gap||0;if(pts[0][1]>pts[pts.length-1][1])pts=pts.slice().reverse();const P=[],I=[];const n=pts.length;for(let j=0;j<=seg;j++){const a=gap+j/seg*(Math.PI*2-2*gap),sn=Math.sin(a),cs=Math.cos(a);for(const[r,y]of pts)P.push(r*sn,y,r*cs)}
 for(let j=0;j<seg;j++)for(let i=0;i<n-1;i++){const a=j*n+i,b=a+n;I.push(a,b,a+1,b,b+1,a+1)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();
 // fix seam normals
 const nm=g.attributes.normal;for(let i=0;i<n;i++){const a=i,b=seg*n+i;const x=(nm.getX(a)+nm.getX(b))/2,y=(nm.getY(a)+nm.getY(b))/2,z=(nm.getZ(a)+nm.getZ(b))/2;if(!gap){nm.setXYZ(a,x,y,z);nm.setXYZ(b,x,y,z)}}g.normalizeNormals&&g.normalizeNormals();return g}
function lathe(k,pts,seg,gap){return geo('L'+k,()=>latheG(pts.map(p=>[Math.max(.0005,p[0]),p[1]]),seg||12,gap))}
// tapered limb, top at y=0 going down to -len
function limb(r1,r2,len,bulge){const k=[r1,r2,len,bulge||0].map(v=>v.toFixed(3)).join();const b=bulge||0;
 return lathe('limb'+k,[[0,-len-r2*.55],[r2*.7,-len-r2*.4],[r2,-len],[r2*1.05+(r1-r2)*.25,-len*.72],[(r1+r2)/2*(1+b),-len*.45],[r1*1.02,-len*.15],[r1,0],[r1*.75,r1*.45],[0,r1*.6]],12)}
function tube(rs,len,k){return lathe('tube'+k,rs.map((r,i)=>[r,-len*i/(rs.length-1)]),14)}
// pleated skirt / flared piece (open), top radius a, bottom b, height h
function pleat(a,b,h,n,amp){return geo('pl'+[a,b,h,n,amp],()=>{const g=new THREE.CylinderGeometry(a,b,h,n*2,2,true);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),y=p.getY(i),an=Math.atan2(z,x),t=(h/2-y)/h,f=1+amp*t*Math.cos(an*n);p.setX(i,x*f);p.setZ(i,z*f)}g.computeVertexNormals();return g})}
// head deformation (unit sphere -> face shape)
function headDeform(g){const p=g.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const d=Math.max(0,-y),u=Math.max(0,y);
  x*=1-.3*Math.pow(d,1.7)+.03*u;z*=(1-.18*Math.pow(d,2))*(z<0?1.06+.06*u:1);if(z>0)z*=1-.05*Math.pow(d,3);y*=y<0?1.02:1;p.setXYZ(i,x,y,z)}g.computeVertexNormals();return g}
const HEAD=geo('head',()=>headDeform(new THREE.SphereGeometry(1,20,16)));
const FA0=Math.PI/2-1,FAL=2,FT0=1.0,FTL=1.62;
const FACEG=(()=>{const g=new THREE.SphereGeometry(1.012,18,14,FA0,FAL,FT0,FTL);headDeform(g);return g})();
const faceMat={};
function faceTex(type){const P=TYPES[type],f=P.g=='f',kid=type[1]=='c',n=256,c=document.createElement('canvas');c.width=c.height=n;const g=c.getContext('2d');
 const X=a=>128+a/FAL*256,Y=t=>(t-FT0)/FTL*256;
 const ey=Y(1.62)+(kid?6:0),ex=f?47:44,ew=(kid?28:f?26:22),eh=(kid?26:f?24:18);
 // blush
 for(const s of[-1,1]){const r=g.createRadialGradient(X(s*.55),ey+36,1,X(s*.55),ey+36,26);r.addColorStop(0,f||kid?'rgba(255,130,140,.42)':'rgba(240,140,130,.18)');r.addColorStop(1,'rgba(255,130,140,0)');g.fillStyle=r;g.fillRect(0,0,n,n)}
 const brow=type=='fa'||type=='mc'||type=='fc'?'#5a3a24':'#1e1612';
 for(const s of[-1,1]){const cx=128+s*ex;
  // sclera
  g.save();g.beginPath();g.ellipse(cx,ey,ew,eh,0,0,7);g.fillStyle='#fdfaf6';g.fill();g.clip();
  const ir=eh*1.02,gr=g.createRadialGradient(cx-s*1,ey-ir*.3,1,cx,ey,ir);gr.addColorStop(0,f?'#9a6440':'#7a5236');gr.addColorStop(.55,f?'#5b3420':'#3e2618');gr.addColorStop(1,'#1d120c');g.fillStyle=gr;g.beginPath();g.arc(cx+s*1,ey+1,ir,0,7);g.fill();
  g.fillStyle='#0c0705';g.beginPath();g.arc(cx+s*1,ey+1,ir*.48,0,7);g.fill();
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(cx-ew,ey-eh,ew*2,eh*.45);
  g.fillStyle='#fff';g.beginPath();g.arc(cx-s*3-3,ey-ir*.35,ir*.3,0,7);g.fill();g.beginPath();g.arc(cx+s*4,ey+ir*.4,ir*.14,0,7);g.fill();g.restore();
  // upper lash line
  g.strokeStyle='#1a100b';g.lineCap='round';g.lineWidth=f?5:4;g.beginPath();g.ellipse(cx,ey+1,ew+1.5,eh+1.5,0,Math.PI*1.08,Math.PI*1.92);g.stroke();
  if(f){g.lineWidth=2.6;for(let i=0;i<3;i++){const a=s>0?-.25+i*.22:Math.PI+.25-i*.22,bx0=cx+Math.cos(a)*(ew+1)*(s>0?1:1),by0=ey-Math.abs(Math.sin(a))*eh*.5;g.beginPath();g.moveTo(cx+s*(ew-2-i*3),ey-eh*.55+i*1);g.lineTo(cx+s*(ew+5-i*2),ey-eh*.9-i*2.4);g.stroke()}}
  g.lineWidth=1.4;g.strokeStyle='rgba(90,50,40,.55)';g.beginPath();g.ellipse(cx,ey,ew,eh,0,Math.PI*.15,Math.PI*.85);g.stroke();
  // double eyelid
  g.lineWidth=1.2;g.strokeStyle='rgba(120,70,55,.45)';g.beginPath();g.ellipse(cx,ey-3,ew+1,eh+3,0,Math.PI*1.15,Math.PI*1.85);g.stroke();
  // brow
  g.strokeStyle=brow;g.lineWidth=f?4:6;g.beginPath();const by=ey-eh-(f?13:11);g.moveTo(cx-s*(ew*.9),by+4);g.quadraticCurveTo(cx+s*2,by-(f?5:3),cx+s*(ew+4),by+(f?3:2));g.stroke()}
 // nose
 const ny=Y(1.98);g.strokeStyle='rgba(170,100,80,.5)';g.lineWidth=2.2;g.beginPath();g.moveTo(124,ny);g.quadraticCurveTo(128,ny+3,133,ny);g.stroke();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(128,ny-6,2.5,0,7);g.fill();
 // mouth
 const my=Y(2.23)-(kid?4:0);
 if(f){g.fillStyle='#e07f88';g.beginPath();g.moveTo(114,my);g.quadraticCurveTo(121,my-6,128,my-2);g.quadraticCurveTo(135,my-6,142,my);g.quadraticCurveTo(128,my+11,114,my);g.fill();g.strokeStyle='#b14d5c';g.lineWidth=1.6;g.beginPath();g.moveTo(116,my);g.quadraticCurveTo(128,my+3,140,my);g.stroke();g.fillStyle='rgba(255,255,255,.45)';g.fillRect(124,my+3,6,1.5)}
 else{g.strokeStyle='#b0655c';g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.moveTo(119,my);g.quadraticCurveTo(128,my+(kid?5:3),137,my);g.stroke();g.fillStyle='rgba(200,110,100,.35)';g.beginPath();g.ellipse(128,my+5,6,2.4,0,0,7);g.fill()}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return new THREE.MeshLambertMaterial({map:t,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}
M3.person=function(type,look){const P=TYPES[type]||TYPES.ma,root=new THREE.Group(),body=new THREE.Group();root.add(body);const meshes=[];
 const mk=(L,parent)=>{const m=new THREE.Mesh(merge(L),VC);m.castShadow=true;parent.add(m);meshes.push(m);return m};
 const top=look.top||P.def.top,pants=look.pants||P.def.pants,hair=look.hair||P.def.hair,skin=P.skin,SH={shade:[.86,.16,.06]};
 const H=P.H,hh=P.hh,f=P.g=='f',kid=type[1]=='c';
 const rx=hh*.43,ry=hh*.5,rz=hh*.47,hy=H-ry*1.0,neckTop=hy-ry*.55,shY=H-hh*1.14,hipY=H*P.leg,S=P.S,Wh=P.Wh;
 const B=[];const torso0=hipY-H*.035,tl=shY-torso0;
 // ---- torso
 const prof=f?[[0,-.02],[Wh*1.0,0],[Wh*1.12,.14],[Wh*1.02,.3],[S*.62,.55],[S*.74,.74],[S*.8,.88],[S*.66,.97],[S*.28,1.02],[0,1.03]]
  :[[0,-.02],[Wh*1.02,0],[Wh*1.06,.15],[S*.7,.42],[S*.76,.62],[S*.86,.82],[S*.86,.92],[S*.62,.99],[S*.3,1.03],[0,1.04]];
 const TP=(k,gap,t0,t1)=>{t0=t0||0;t1=t1??2;const pr=[];for(let i=0;i<prof.length;i++){const[r,t]=prof[i];if(t>=t0&&t<=t1)pr.push([r,torso0+t*tl])}if(t0>0)pr.unshift([0,torso0+t0*tl]);return lathe(type+'tor'+k,pr,16,gap)};
 const band=(k,col,t1,sc)=>{const pr=[];for(const[r,t]of prof){if(t<=t1)pr.push([r*(sc||1.03),torso0+t*tl])}pr.push([prof.find(p=>p[1]>t1)[0]*.6*(sc||1.03),torso0+t1*tl]);put(B,lathe(type+'band'+k,pr,16),col,0,0,0,{sz:dz,...SH})};
 const dz=f?.68:.62;
 const lower=type=='fc'?top:type=='ft'?pants:type=='fa'?pants:pants;
 const inner={mt:'#f6f6f4',ma:'#5c6068',ft:'#ffffff'}[type];
 if(inner){put(B,TP(''),inner,0,0,0,{sz:dz,...SH});put(B,TP('o',type=='ma'?.42:type=='mt'?.5:.36),top,0,0,0,{sx:1.05,sz:dz*1.08,...SH})}else put(B,TP(''),top,0,0,0,{sz:dz,...SH});
 if(type=='mt'||type=='ma'||type=='fa')band('p',pants,type=='fa'?.34:.16,1.04);
 // hips/pelvis in pants colour
 if(type!='fa')sp(B,f?skin:lower,0,hipY+.005,0,1,{sx:Wh*1.0,sy:H*.045,sz:Wh*.6,...SH});
 if(f&&!kid)for(const s of[-1,1])sp(B,top,s*S*.28,shY-tl*.32,S*.26,S*.2,{sy:S*.17,sz:S*.13,...SH});
 // neck
 put(B,limb(rx*.36,rx*.4,neckTop-shY+.02),skin,0,neckTop,0,{sz:.95,shade:[.8,.12,.04]});
 // ---- per type clothing on torso
 const belt=(col,y,r)=>put(B,G.cyl12,col,0,y,0,{sx:r,sy:H*.016,sz:r*dz*1.02});
 if(type=='mc'){ // hoodie
  
  bx(B,shadeHex(top,-.05),0,torso0+tl*.3,Wh*.64,Wh*1.2,tl*.2,.008,{rx:-.12});
  put(B,G.sph,top,0,shY+.005,-S*.22,{sx:S*.62,sy:S*.38,sz:S*.32,...SH});put(B,G.sph,shadeHex(top,-.12),0,shY+.015,-S*.16,{sx:S*.42,sy:S*.24,sz:S*.2});
  for(const s of[-1,1]){put(B,G.cyl,'#ffffff',s*S*.14,shY-tl*.14,S*.5,{sx:.0035,sy:tl*.22,sz:.0035,rx:-.15});sp(B,'#f2f2f2',s*S*.14,shY-tl*.27,S*.53,.006)}
  put(B,G.cyl12,top,0,shY+.008,0,{sx:S*.42,sy:.02,sz:S*.34})}
 if(type=='mt'){ // open denim shirt + white tee
  
  put(B,G.cyl12,'#f6f6f4',0,shY+.004,0,{sx:S*.4,sy:.02,sz:S*.33});
  for(const s of[-1,1]){bx(B,top,s*S*.24,shY-.012,S*.4,S*.14,S*.34,.012,{rz:s*.75,rx:-.3});
   bx(B,shadeHex(top,-.1),s*S*.4,shY-tl*.27,S*.47,S*.2,S*.18,.004)}
  belt('#2d2a2a',torso0+tl*.15,Wh*1.08)}
 if(type=='ma'){ // blazer + grey tee
  put(B,G.cyl12,'#5c6068',0,shY+.004,0,{sx:S*.38,sy:.02,sz:S*.33});
  for(const s of[-1,1]){bx(B,shadeHex(top,.06),s*S*.27,shY-tl*.24,S*.44,S*.2,tl*.5,.015,{rz:-s*.35,rx:-.08});bx(B,shadeHex(top,-.08),s*S*.42,torso0+tl*.3,S*.47,S*.28,.01,.02);put(B,G.box,'#d9d4c8',s*-S*.55,shY-tl*.2,S*.5,{sx:S*.16,sy:.006,sz:.006})}
  sp(B,'#1a1a1a',S*.0,torso0+tl*.35,S*.5,.006);
  belt('#3b2a1e',torso0+tl*.15,Wh*1.08)}
 if(type=='fc'){ // mint dress, white collar, pleated skirt
  for(const s of[-1,1])put(B,G.sph,'#ffffff',s*S*.26,shY-.008,S*.28,{sx:S*.32,sy:S*.08,sz:S*.26,rz:s*.25,rx:.4});
  put(B,pleat(Wh*1.0,Wh*1.95,H*.15,10,.07),top,0,hipY-H*.04,0,{sz:dz*1.15,...SH});put(B,G.cyl12,shadeHex(top,-.08),0,hipY+H*.035,0,{sx:Wh*1.02,sy:.012,sz:Wh*1.02*dz})}
 if(type=='ft'){ // cardigan + pleated skirt
  for(let i=0;i<4;i++)sp(B,shadeHex(top,-.1),S*.0,shY-tl*(.4+i*.14),S*.5,.006);
  
  put(B,lathe('ft_hem',[[Wh*1.12,0],[Wh*1.16,.015],[Wh*1.1,.03]]),shadeHex(top,-.05),0,hipY+H*.02,0,{sz:dz*1.05});
  put(B,pleat(Wh*1.05,Wh*1.9,H*.14,12,.06),pants,0,hipY-H*.035,0,{sz:dz*1.2,...SH})}
 if(type=='fa'){ // blouse tucked into wide trousers
  bx(B,shadeHex(top,-.08),0,shY-tl*.15,S*.36,S*.32,S*.06,.01,{rx:-.3});
  for(let i=0;i<3;i++)sp(B,'#f6f0ff',0,shY-tl*(.22+i*.17),S*.5,.005);}
 // ---- head
 const h=(g,col,x,y,z,o)=>{o=Object.assign({},o||{});o.sx=(o.sx??1)*rx;o.sy=(o.sy??1)*ry;o.sz=(o.sz??1)*rz;return put(B,g,col,x*rx,hy+y*ry,z*rz,o)};
 h(HEAD,skin,0,0,0,{shade:[1.12,.08,.05]});
 h(G.sph,skin,0,-.16,.94,{sx:.07,sy:.1,sz:.07,shade:[1.12,.08,.05]});// nose
 for(const s of[-1,1])h(G.sph,skin,s*.95,-.12,0,{sx:.14,sy:.24,sz:.16});// ears
 // hair
 const hs=[.6,.5,.1],HC=hair,HD=shadeHex(hair,-.06),HL=shadeHex(hair,.08);
 const cap=(sc,bk)=>{h(partial(0,Math.PI*2,0,Math.PI*.36),HC,0,.05,-.02,{sx:1.1*sc,sy:1.08*sc,sz:1.1*sc,shade:hs});h(partial(Math.PI/2+.75,Math.PI*2-1.5,0,Math.PI*(bk||.62)),HC,0,.04,-.03,{sx:1.08*sc,sy:1.1*sc,sz:1.12*sc,shade:hs})};
 const tuft=(col,x,y,z,sx,sy,sz,rx_,rz_)=>h(G.sph,col,x,y,z,{sx,sy,sz,rx:rx_||0,rz:rz_||0,shade:hs});
 if(type=='mc'){cap(1.03,.56);const T=[[0,.82,.5,-.2,0],[.35,.78,.55,-.2,-.5],[-.38,.76,.55,-.2,.5],[.6,.5,.62,-.1,-.9],[-.62,.5,.62,-.1,.9],[.2,.55,.85,.6,-.3],[-.25,.55,.85,.6,.3],[.05,.62,.8,.5,0],[0,.9,-.2,-.6,0],[.5,.7,-.3,-.4,-.6],[-.5,.7,-.3,-.4,.6]];
  T.forEach(([x,y,z,a,b],i)=>tuft(i%3?HC:HL,x,y,z,.36,.28,.4,a,b));for(const s of[-1,1])tuft(HC,s*.9,.05,.2,.18,.38,.3)}
 if(type=='mt'){cap(1.04,.55);const T=[[0,.85,.45,-.1,0],[.4,.8,.5,-.2,-.6],[-.42,.78,.5,-.2,.6],[.15,.5,.9,.7,-.4],[-.25,.48,.88,.8,.5],[.5,.38,.82,.6,-.8],[-.55,.36,.8,.6,.8],[0,.95,-.3,-.5,0],[.65,.6,-.2,0,-1],[-.65,.6,-.2,0,1]];
  T.forEach(([x,y,z,a,b],i)=>tuft(i%4?HC:HD,x,y,z,.38,.26,.42,a,b));for(const s of[-1,1])tuft(HC,s*.93,.0,.15,.17,.42,.32)}
 if(type=='ma'){cap(1.02,.54);tuft(HC,.12,.75,.45,.85,.32,.6,-.3,-.15);tuft(HL,.3,.8,.55,.45,.18,.38,-.4,-.3);tuft(HC,-.45,.62,.55,.42,.25,.42,-.2,.4);for(const s of[-1,1])tuft(HC,s*.95,.08,.05,.14,.38,.42)}
 if(type=='fc'){cap(1.03,.66);for(const s of[-1,1]){tuft(HC,s*.62,1.0,-.05,.42,.42,.42);tuft(HD,s*.62,.97,-.02,.3,.32,.3,.8,0);tuft(HC,s*.9,-.1,.25,.2,.42,.3)}
  for(let i=-2;i<=2;i++)tuft(i%2?HC:HL,i*.2,.56,.86,.22,.22,.18,.6,-i*.15)}
 if(type=='ft'){cap(1.04,.82);for(let i=-3;i<=3;i++)tuft(i%3?HC:HD,i*.15,.46,.86,.24,.34,.16,.2,-i*.04);
  put(B,lathe('ft_back',[[0,0],[rx*.95,-.02],[rx*1.15,-hh*.4],[rx*1.2,-hh*1.2],[rx*1.1,-hh*1.9],[rx*.5,-hh*2.0],[0,-hh*2.01]],12),HC,0,hy+ry*.3,-rz*.35,{sz:.6,shade:hs});
  for(const s of[-1,1])put(B,limb(rx*.26,rx*.22,hh*1.5),HC,s*rx*.92,hy-ry*.1,rz*.15,{sz:.7,rz:s*.06,shade:hs})}
 if(type=='fa'){cap(1.05,.82);tuft(HC,-.35,.72,.55,.7,.32,.6,-.3,.45);tuft(HL,.45,.62,.6,.5,.3,.5,-.2,-.5);
  for(let i=0;i<5;i++){const y=-.1-i*.48;for(const s of[-1,0,1])tuft(i%2?HC:HD,s*.6+(i%2?.1:-.1)*s,y,-.5+Math.abs(s)*.15,.62,.5,.45,0,s*.25)}
  for(const s of[-1,1])for(let i=0;i<4;i++)tuft(i%2?HD:HC,s*(1.0+(i%2)*.14),-.25-i*.5,.25-i*.06,.36,.4,.34,0,s*(i%2?.5:-.2))}
 // hats
 const hat=look.hat,k=1.6;
 if(hat=='cap'){h(partial(0,Math.PI*2,0,Math.PI/2),'#d32f2f',0,.25,0,{sx:1.18,sy:1.0,sz:1.18});h(geo('brim',()=>new THREE.CylinderGeometry(1,1,1,12,1,false,-Math.PI/2,Math.PI)),'#c62828',0,.3,.45,{sx:.9,sy:.06,sz:.9})}
 if(hat=='beanie'){h(partial(0,Math.PI*2,0,Math.PI/2),'#3949ab',0,.15,0,{sx:1.2,sy:1.3,sz:1.2});h(G.cyl12,'#5c6bc0',0,.2,0,{sx:1.22,sy:.3,sz:1.22});h(G.sph,'#ffffff',0,1.45,0,{sx:.3,sy:.3,sz:.3})}
 if(hat=='straw'){h(G.cyl12,'#e2b866',0,.55,0,{sx:2.1,sy:.06,sz:2.1});h(G.cyl12,'#e2b866',0,.8,0,{sx:1.1,sy:.6,sz:1.1});h(G.cyl12,'#c62828',0,.65,0,{sx:1.13,sy:.18,sz:1.13})}
 if(hat=='ribbon'){for(const s of[-1,1])h(G.cone4,'#ec407a',.5+s*.4,.85,-.3,{sx:.35,sy:.7,sz:.35,rz:s*Math.PI/2});h(G.sph,'#ad1457',.5,.85,-.3,{sx:.18,sy:.18,sz:.18})}
 if(hat=='crown'){h(geo('crown',()=>new THREE.CylinderGeometry(1,1,1,10,1,true)),'#ffd54f',0,1.0,0,{sx:.7,sy:.35,sz:.7});for(let i=0;i<6;i++){const a=i/6*Math.PI*2;h(G.cone4,'#ffd54f',Math.sin(a)*.7,1.3,Math.cos(a)*.7,{sx:.2,sy:.35,sz:.2})}}
 mk(B,body);
 if(!faceMat[type])faceMat[type]=faceTex(type);
 const fm=new THREE.Mesh(FACEG,faceMat[type]);fm.scale.set(rx,ry,rz);fm.position.set(0,hy,0);fm.renderOrder=1;body.add(fm);
 // ---- limbs
 const J={},ul=(hipY-H*.25),ll=H*.25-H*.045,ankle=H*.045;
 const armL=shY-hipY+H*.02,ua=armL*.54,fa_=armL*.46;
 for(const s of[-1,1]){
  const hipG=new THREE.Group();hipG.position.set(s*Wh*.52,hipY,0);body.add(hipG);const U=[];
  const kn=new THREE.Group();kn.position.set(0,-ul,0);hipG.add(kn);const D=[];
  const skinLeg=()=>{put(U,limb(P.lr,P.lr*.78,ul,.05),skin,0,0,0,SH);put(D,limb(P.lr*.8,P.lr*.55,ll,.12),skin,0,0,0,SH)};
  if(type=='mc'){skinLeg();put(U,tube([P.lr*1.45,P.lr*1.42,P.lr*1.38],ul*.62,'mcs'),pants,0,.03,0,SH);put(U,tube([P.lr*1.55,P.lr*1.55],ul*.13,'mcc'),shadeHex(pants,.1),0,.03-ul*.55,0);
   put(D,tube([P.lr*.75,P.lr*.68,P.lr*.68],ll*.3,'mcsk'),'#fbfbfb',0,-ll*.7,0)}
  if(type=='mt'||type=='ma'){const r=type=='ma'?1.32:1.28;put(U,limb(P.lr*r,P.lr*1.1,ul,.02),pants,0,0,0,SH);put(D,limb(P.lr*1.08,P.lr*.98,ll+.01,0),pants,0,0,0,SH);
   put(D,tube([P.lr*1.12,P.lr*1.14],ll*.09,'cf'+type),type=='mt'?shadeHex(pants,.12):shadeHex(pants,-.05),0,-ll*.86,0)}
  if(type=='fc'){skinLeg();put(D,tube([P.lr*.7,P.lr*.66,P.lr*.64],ll*.22,'fcsk'),'#ffffff',0,-ll*.78,0);put(D,tube([P.lr*.76,P.lr*.76],ll*.05,'fcsk2'),'#ffffff',0,-ll*.76,0)}
  if(type=='ft'){skinLeg();put(D,tube([P.lr*.7,P.lr*.64],ll*.18,'ftsk'),'#ffffff',0,-ll*.82,0)}
  if(type=='fa'){put(U,tube([P.lr*1.85,P.lr*1.75,P.lr*1.72],ul+.02,'fawu'),pants,0,.02,0,SH);put(D,tube([P.lr*1.7,P.lr*1.8,P.lr*1.95,P.lr*2.0],ll+.01,'faw'),pants,0,0,0,SH);
   put(D,G.box,shadeHex(pants,-.08),0,-ll*.5,P.lr*1.9,{sx:.002,sy:ll*.98,sz:.003});put(U,G.box,shadeHex(pants,-.08),0,-ul*.5,P.lr*1.68,{sx:.002,sy:ul*.9,sz:.003})}
  // shoes
  const sy0=-ll-ankle*.25,sl=P.lr*(kid?2.6:2.5),sw=P.lr*(kid?1.0:.95);
  if(type=='mc'){sp(D,'#f6c514',0,sy0+.012,sl*.25,1,{sx:sw,sy:ankle*.55,sz:sl*.62,shade:[.8,.3]});put(D,G.cyl12,'#ffffff',0,sy0-ankle*.25,sl*.25,{sx:sw*1.05,sy:ankle*.3,sz:sl*.62});put(D,G.box,'#ffffff',0,sy0+ankle*.35,sl*.45,{sx:sw*.5,sy:.004,sz:sl*.35,rx:-.3})}
  if(type=='mt'){sp(D,'#8f9298',0,sy0+.012,sl*.25,1,{sx:sw,sy:ankle*.55,sz:sl*.62,shade:[.8,.3]});put(D,G.cyl12,'#f4f4f4',0,sy0-ankle*.22,sl*.25,{sx:sw*1.05,sy:ankle*.32,sz:sl*.62});for(let i=0;i<3;i++)put(D,G.box,'#ffffff',0,sy0+ankle*.42-i*.002,sl*(.35+i*.1),{sx:sw*.6,sy:.003,sz:.004})}
  if(type=='ma'){sp(D,'#5a3420',0,sy0+.008,sl*.3,1,{sx:sw*.9,sy:ankle*.5,sz:sl*.68,shade:[.75,.4]});put(D,G.cyl12,'#2a1a10',0,sy0-ankle*.25,sl*.3,{sx:sw*.92,sy:ankle*.18,sz:sl*.68})}
  if(type=='fc'){sp(D,top,0,sy0+.008,sl*.22,1,{sx:sw*.95,sy:ankle*.5,sz:sl*.58,shade:[.75,.4]});put(D,G.box,shadeHex(top,-.12),0,sy0+ankle*.45,sl*.05,{sx:sw*2.1,sy:.004,sz:.006})}
  if(type=='ft'){sp(D,'#fafafa',0,sy0+.012,sl*.25,1,{sx:sw*1.05,sy:ankle*.6,sz:sl*.64,shade:[.8,.3]});put(D,G.cyl12,'#e8e4de',0,sy0-ankle*.3,sl*.25,{sx:sw*1.1,sy:ankle*.42,sz:sl*.66})}
  if(type=='fa'){sp(D,skin,0,sy0+.006,sl*.3,1,{sx:sw*.75,sy:ankle*.38,sz:sl*.62});put(D,G.box,'#ffffff',0,sy0-ankle*.2,sl*.3,{sx:sw*1.4,sy:ankle*.15,sz:sl*1.2});put(D,G.box,'#ffffff',0,sy0+ankle*.2,sl*.55,{sx:sw*1.5,sy:ankle*.12,sz:.01});put(D,G.cyl,'#f2f2f2',0,sy0-ankle*.25,-sl*.2,{sx:sw*.3,sy:ankle*.9,sz:sw*.3})}
  mk(U,hipG);mk(D,kn);
  // arms
  const shG=new THREE.Group();shG.position.set(s*S*.88,shY-H*.03,0);body.add(shG);const A=[];
  const el=new THREE.Group();el.position.set(0,-ua,0);shG.add(el);const E=[];
  const sleeveFull=type=='mc'||type=='ma'||type=='ft'||type=='fa';const sc=type=='fa'?1.25:type=='mc'?1.3:1.18;
  sp(A,top,0,0,0,P.ar*(type=='fc'?1.9:1.0),{sz:P.ar*1.0,...SH});
  if(type=='fc'){put(A,limb(P.ar,P.ar*.85,ua),skin,0,0,0,SH);put(A,tube([P.ar*1.9,P.ar*1.7,P.ar*1.35],ua*.35,'fcsl'),top,0,0,0,SH)}
  else put(A,limb(P.ar*sc,P.ar*sc*.92,ua,.04),top,0,0,0,SH);
  if(type=='mt')put(A,tube([P.ar*1.45,P.ar*1.5,P.ar*1.4],ua*.22,'mtroll'),shadeHex(top,.05),0,-ua*.82,0,SH);
  if(sleeveFull){put(E,limb(P.ar*sc*.92,P.ar*sc*.8,fa_*.9,.04),top,0,0,0,SH);put(E,tube([P.ar*sc*.85,P.ar*sc*.85],fa_*.12,'cuff'+type),type=='mc'?shadeHex(top,-.06):type=='ma'?'#c9c3b8':shadeHex(top,-.05),0,-fa_*.8,0)}
  else put(E,limb(P.ar*.9,P.ar*.68,fa_*.92,.06),skin,0,0,0,SH);
  sp(E,skin,0,-fa_*.98,P.ar*.1,1,{sx:P.ar*.75,sy:hh*.33,sz:P.ar*1.15,...SH});sp(E,skin,s*-P.ar*.7,-fa_*.93,P.ar*.5,P.ar*.38);
  mk(A,shG);mk(E,el);
  J['hip'+s]=hipG;J['kn'+s]=kn;J['sh'+s]=shG;J['el'+s]=el}
 root.userData={J,body,meshes,h:H,type,idle:P.idle};return root};
M3.pose=function(p,phase,moving,t){const{J,body,idle}=p.userData;const w=moving?Math.sin(phase):0;
 for(const s of[-1,1]){J['hip'+s].rotation.x=-s*w*.5;J['kn'+s].rotation.x=moving?Math.max(0,Math.sin(phase+(s>0?0:Math.PI)+1.2))*.7:0;
  const sh=J['sh'+s],el=J['el'+s];
  if(moving){sh.rotation.set(s*w*.5,0,s*.07);el.rotation.set(-.3,0,0)}
  else if(idle=='clasp'){sh.rotation.set(-.15,0,-s*.06);el.rotation.set(-.62,0,-s*.8)}
  else if(idle=='pocket'||(idle=='pocket1'&&s>0)){sh.rotation.set(.12,0,s*.2);el.rotation.set(-.25,0,-s*.38)}
  else if(idle=='hip'&&s<0){sh.rotation.set(0,0,s*.35);el.rotation.set(-.4,0,-s*.85)}
  else{sh.rotation.set(0,0,s*.07);el.rotation.set(-.12,0,0)}}
 body.position.y=moving?Math.abs(Math.cos(phase))*.016:Math.sin(t*.002)*.002};
M3.dispose=function(p){p.userData.meshes.forEach(m=>m.geometry.dispose())};
// ---------- room & furniture
M3.furn=function(id){const L=[],m=(c,x,y,z,w,h,d)=>bx(L,c,x,y,z,w,h,d,{shade:[.75,.3,.1]});
 if(id=='bed'){m('#6d4c35',.5,.25,.12,.9,.5,.08);m('#7b5236',.5,.12,.52,.9,.2,.78);m('#fafafa',.5,.28,.52,.84,.12,.74);m('#ffffff',.5,.38,.26,.6,.08,.2);m('#3f6fb5',.5,.37,.66,.86,.06,.5)}
 if(id=='chair'){m('#a0683c',.5,.32,.5,.4,.05,.4);m('#a0683c',.5,.56,.32,.4,.42,.05);for(const x of[.33,.67])for(const z of[.33,.67])m('#8a5530',x,.16,z,.04,.32,.04)}
 if(id=='table'){put(L,G.cyl12,'#8a5a3a',.5,.5,.5,{sx:.4,sy:.05,sz:.4});put(L,G.cyl,'#6d4c35',.5,.25,.5,{sx:.06,sy:.5,sz:.06});put(L,G.cyl12,'#6d4c35',.5,.015,.5,{sx:.2,sy:.03,sz:.2});put(L,G.cyl12,'#e3f2fd',.5,.58,.5,{sx:.04,sy:.1,sz:.04})}
 if(id=='plant'){put(L,G.cyl12,'#c4572e',.5,.15,.5,{sx:.15,sy:.3,sz:.15});for(const[x,y,z,r]of[[0,.5,0,.18],[.12,.42,.05,.13],[-.1,.45,-.05,.13],[0,.65,0,.12]])put(L,G.ico,'#3f8a3a',.5+x,y,.5+z,{sx:r,sy:r,sz:r,shade:[.45,.7],jit:.2})}
 if(id=='tv'){m('#5d4037',.5,.175,.5,.8,.35,.35);m('#151515',.5,.6,.45,.7,.42,.05);m('#4fc3f7',.5,.6,.48,.64,.36,.01)}
 if(id=='sofa'){m('#b23b3b',.5,.15,.55,.9,.22,.6);m('#a83434',.5,.4,.3,.9,.35,.15);for(const x of[.1,.9])m('#a83434',x,.25,.55,.12,.32,.6);for(const x of[.3,.7])m('#c94a4a',x,.29,.6,.36,.06,.45)}
 if(id=='lamp'){put(L,G.cyl12,'#444',.5,.02,.5,{sx:.13,sy:.04,sz:.13});put(L,G.cyl,'#888',.5,.5,.5,{sx:.015,sy:1,sz:.015});put(L,G.cyl12,'#fff3c4',.5,1.05,.5,{sx:.17,sy:.25,sz:.17})}
 if(id=='rug'){m('#9c2f2f',.5,.008,.5,.95,.015,.95);m('#e8c07a',.5,.017,.5,.6,.003,.6);m('#2f4a7a',.5,.02,.5,.3,.003,.3)}
 if(id=='shelf'){m('#6d4c35',.5,.65,.35,.8,1.3,.3);for(let r=0;r<3;r++)for(let i=0;i<6;i++)m(['#c62828','#1565c0','#f9a825','#2e7d32','#6a1b9a','#ef6c00'][(i+r*2)%6],.18+i*.12,.2+r*.42,.42,.09,.25,.22)}
 if(id=='piano'){m('#141414',.5,.5,.38,.9,1,.35);m('#141414',.5,.55,.65,.9,.06,.25);m('#fafafa',.5,.59,.7,.86,.02,.14);m('#141414',.5,.38,.92,.6,.06,.25)}
 const me=new THREE.Mesh(merge(L),VC);me.castShadow=me.receiveShadow=true;return me};
M3.room=function(){const L=[];for(let x=0;x<6;x++)for(let z=0;z<6;z++)for(let k=0;k<2;k++)bx(L,(x+z+k)%2?'#c49a6c':'#b78a5c',x+.5,-.04,z+.25+k*.5,1,.08,.5);
 bx(L,'#f3e3b8',3,1.3,-.05,6,2.6,.1);bx(L,'#e6d3a0',-.05,1.3,3,.1,2.6,6);for(let i=0;i<12;i++)bx(L,'#e8d29c',i*.5+.25,1.3,.005,.12,2.6,.01);
 bx(L,'#7b5236',3,.075,.02,6,.15,.04);bx(L,'#7b5236',.02,.075,3,.04,.15,6);
 bx(L,'#ffffff',3,1.5,.02,1.7,1.2,.04);bx(L,'#9fd3f5',3,1.5,.05,1.5,1,.02);bx(L,'#ffffff',3,1.5,.07,.05,1.05,.02);bx(L,'#6d4c41',.02,1.5,2.2,.05,.6,.8);bx(L,'#9ccc65',.05,1.5,2.2,.02,.5,.7);
 const m=new THREE.Mesh(merge(L),VC);m.receiveShadow=true;return m};
})();
// ---------- Meshy 모델 (사용자가 만든 3D, 압축 .bin + .jpg) — 3D 모델 출처: Meshy
(function(){
M3.meshy={};const TYPES=M3.TYPES,SRC={mc:1,mt:1,ma:1,fc:1,ft:1,fa:1};
function decode(buf){const hl=128,h=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,0,hl)));
 const vb=new Uint8Array(h.nv*16),ib=new Uint32Array(h.ni);MeshoptDecoder.decodeVertexBuffer(vb,h.nv,16,new Uint8Array(buf,hl,h.ev));MeshoptDecoder.decodeIndexBuffer(new Uint8Array(ib.buffer),h.ni,4,new Uint8Array(buf,hl+h.ev,h.ei));
 const dv=new DataView(vb.buffer),P=new Float32Array(h.nv*3),N=new Float32Array(h.nv*3),U=new Float32Array(h.nv*2),k=1/32767/1.98;
 for(let i=0;i<h.nv;i++){const o=i*16;for(let j=0;j<3;j++){P[i*3+j]=dv.getInt16(o+j*2,true)*k;N[i*3+j]=dv.getInt8(o+8+j)/127}U[i*2]=dv.getUint16(o+12,true)/65535;U[i*2+1]=1-dv.getUint16(o+14,true)/65535}
 return{h,P,N,U,I:h.nv<65536?new Uint16Array(ib):ib}}
M3.preload=async function(){if(!window.MeshoptDecoder)return;await MeshoptDecoder.ready;
 await Promise.all(Object.keys(SRC).map(async t=>{try{const r=await fetch((M3.BASE||'')+'models/'+t+'.bin');if(!r.ok)return;const d=decode(await r.arrayBuffer());
  const P=TYPES[t],s=P.H/d.h.h;for(let i=0;i<d.P.length;i+=3){d.P[i]*=s;d.P[i+1]=(d.P[i+1]+d.h.h/2)*s;d.P[i+2]*=s}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(d.P,3));g.setAttribute('normal',new THREE.BufferAttribute(d.N,3));g.setAttribute('uv',new THREE.BufferAttribute(d.U,2));g.setIndex(new THREE.BufferAttribute(d.I,1));g.computeBoundingSphere();
  const img=new Image();img.src=(M3.BASE||'')+'models/'+t+'.jpg';await img.decode();const tx=new THREE.CanvasTexture(img);tx.colorSpace=THREE.SRGBColorSpace;tx.needsUpdate=true;tx.anisotropy=2;
  M3.meshy[t]={g,tx}}catch(e){console.warn('meshy',t,e)}}))};
const _c1=new THREE.Color(),_c2=new THREE.Color();
function meshyMat(t,look){const P=TYPES[t],m=new THREE.MeshLambertMaterial({map:M3.meshy[t].tx});
 const U={uPh:{value:0},uAmp:{value:0},uHip:{value:P.H*P.leg},uHx:{value:P.Wh*.5},
  uT0:{value:_c1.set(P.def.top).clone()},uT1:{value:_c2.set(look.top||P.def.top).clone()},uP0:{value:new THREE.Color(P.def.pants)},uP1:{value:new THREE.Color(look.pants||P.def.pants)},uPat:{value:look.pat||0}};
 m.userData.U=U;
 m.onBeforeCompile=s=>{Object.assign(s.uniforms,U);
  s.vertexShader='uniform float uPh,uAmp,uHip,uHx;varying vec3 vLp;\n'+s.vertexShader.replace('#include <begin_vertex>',`vec3 transformed=position;vLp=position;
   if(position.y<uHip){float sd=position.x>0.?1.:-1.;float a=sin(uPh)*uAmp*sd*smoothstep(uHip,uHip*.8,position.y);float dy=position.y-uHip;float c=cos(a),sn=sin(a);transformed.y=uHip+dy*c-position.z*sn;transformed.z=dy*sn+position.z*c;}`);
  s.fragmentShader='uniform vec3 uT0,uT1,uP0,uP1;uniform float uPat;varying vec3 vLp;\n'+s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   {vec3 c=diffuseColor.rgb;float dt=distance(c/(dot(c,vec3(.33))+.05),uT0/(dot(uT0,vec3(.33))+.05));float wt=(1.-smoothstep(.12,.3,dt))*step(.001,distance(uT0,uT1));
    diffuseColor.rgb=mix(c,c*uT1/max(uT0,vec3(.03)),wt);
    if(uPat>.5){float tm=1.-smoothstep(.12,.3,dt);float pf=uPat<1.5?step(.5,fract(vLp.y*26.)):uPat<2.5?step(length(fract(vec2(vLp.x*1.3+vLp.z,vLp.y)*20.)-.5),.2):step(.5,fract(vLp.x*14.))*step(.5,fract(vLp.y*14.))+step(fract(vLp.x*14.),.5)*step(fract(vLp.y*14.),.5);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*(uPat>3.5?vec3(1.25,1.2,.9):vec3(.68)),tm*pf);}
    c=diffuseColor.rgb;float dp=distance(c/(dot(c,vec3(.33))+.05),uP0/(dot(uP0,vec3(.33))+.05));float wp=(1.-smoothstep(.12,.3,dp))*step(.001,distance(uP0,uP1));
    diffuseColor.rgb=mix(c,clamp(c*uP1/max(uP0,vec3(.03)),0.,1.),wp);}`)};
 m.customProgramCacheKey=()=>'meshy';return m}
const base=M3.person;
M3.person=function(type,look){const M=M3.meshy[type];if(!M)return base(type,look);
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);const mat=meshyMat(type,look);const me=new THREE.Mesh(M.g,mat);me.castShadow=true;me.userData.shared=1;body.add(me);
 root.userData={J:null,body,meshes:[me],h:TYPES[type].H,type,meshy:mat.userData.U,mat};return root};
const basePose=M3.pose;
M3.pose=function(p,phase,moving,t){const U=p.userData.meshy;if(!U)return basePose(p,phase,moving,t);
 U.uPh.value=phase;U.uAmp.value+=((moving?.42:0)-U.uAmp.value)*.25;const b=p.userData.body;
 b.position.y=moving?Math.abs(Math.cos(phase))*.02:0;b.rotation.z=moving?Math.sin(phase)*.03:Math.sin(t*.0012)*.01;b.rotation.x=moving?.04:0};
const baseDisp=M3.dispose;
M3.dispose=function(p){if(p.userData.meshy){p.userData.mat.dispose();return}baseDisp(p)};
})();
