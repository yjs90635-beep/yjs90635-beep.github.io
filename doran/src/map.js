const W=44,H=36,T=new Uint8Array(W*H),BL=new Uint8Array(W*H),I=(x,y)=>y*W+x;
const hash=(x,y)=>{const s=Math.sin(x*12.9898+y*78.233)*43758.5453;return s-Math.floor(s)};
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
function setT(x,y,t){if(x>=0&&y>=0&&x<W&&y<H)T[I(x,y)]=t}
for(let y=32;y<H;y++)for(let x=0;x<W;x++)setT(x,y,4);
const HR=[10,24],VR=[14,30];
for(const r of HR)for(let x=0;x<W;x++){setT(x,r-1,1);setT(x,r+2,1)}
for(const c of VR)for(let y=0;y<32;y++){setT(c-1,y,1);setT(c+2,y,1)}
for(const r of HR)for(let x=0;x<W;x++){setT(x,r,2);setT(x,r+1,2)}
for(const c of VR)for(let y=0;y<32;y++){setT(c,y,2);setT(c+1,y,2)}
for(let x=0;x<W;x++)setT(x,31,1);
for(let y=32;y<35;y++){setT(21,y,5);setT(22,y,5)}
for(const r of HR)for(const c of VR){for(const rr of[r,r+1]){setT(c-1,rr,3);setT(c+2,rr,3)}for(const cc of[c,c+1]){setT(cc,r-1,6);setT(cc,r+2,6)}}
for(let y=27;y<=30;y++)for(let x=2;x<=12;x++)setT(x,y,1);
const FOUNT={x0:6,y0:27,x1:9,y1:30};for(let y=27;y<30;y++)for(let x=6;x<9;x++)BL[I(x,y)]=1;
const isRoadT=t=>t==2||t==3||t==6;
// buildings
const BLD=[];
function bld(x,y,w,d,h,wall,roof,name,kind,style){const b={x0:x,y0:y,x1:x+w,y1:y+d,h,wall,roof,name,kind,style,door:{x:x+Math.floor(w/2),y:y+d}};BLD.push(b);for(let yy=y;yy<y+d;yy++)for(let xx=x;xx<x+w;xx++)BL[I(xx,yy)]=1}
bld(1,6,3,3,54,'#ffe0b2','#c62828','민수네','house','house');
bld(5,6,3,3,54,'#e1f5fe','#1565c0','하늘이네','house','house');
bld(9,6,3,3,54,'#f1f8e9','#6d4c41','박 할머니 댁','house','house');
bld(18,6,3,3,54,'#fce4ec','#4e342e','소라네','house','house');
bld(22,6,3,3,54,'#fff9c4','#2e7d32','도윤 할아버지 댁','house','house');
bld(26,6,3,3,66,'#cfd8dc','#455a64','반짝 청소소','clean','shop');
bld(34,5,4,4,62,'#fff3e0','#ef6c00','내 집','home','house');
bld(39,6,3,3,54,'#ede7f6','#5e35b1','김 반장님 댁','house','house');
bld(1,18,5,5,96,'#ffccbc','#8d6e63','솥단지 식당','bakery','shop');
bld(7,18,5,5,86,'#f8bbd0','#558b2f','들풀 수집소','flower','shop');
bld(18,18,5,5,116,'#ffcdd2','#b71c1c','마을회관','post','shop');
bld(24,18,5,5,96,'#d7ccc8','#4e342e','도란 찻집','cafe','shop');
bld(34,18,4,5,96,'#b3e5fc','#0277bd','실바늘 옷방','clothes','shop');
bld(39,18,4,5,96,'#dcedc8','#33691e','뚝딱 공방','furn','shop');
for(const b of BLD){b.hu=b.style=='house'?1.9:b.kind=='post'?2.9:b.kind=='clean'?2.0:2.6;b.h=b.hu*39.2}
const SIGN={bakery:'🍲',flower:'🌱',post:'🏛️',cafe:'☕',clothes:'🧵',furn:'🔨',clean:'♻️',home:'🏠',house:'🏠'};
const AWN={bakery:'#e53935',flower:'#43a047',cafe:'#6d4c41',clothes:'#1e88e5',furn:'#fb8c00',post:'#c62828',clean:'#00897b'};
const TREES=[],LAMPS=[],BENCH=[],PROPS=[];
for(const x of[4,9,19,25,35,40]){if(!BL[I(x,27)]){BENCH.push({x,y:27});BL[I(x,27)]=1}}
for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(T[I(x,y)]||BL[I(x,y)])continue;let ok=true;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<W&&ny<H&&T[I(nx,ny)]!=0)ok=false}
 if(!ok)continue;const p=(y>=27&&y<=30)?.2:.14;if(hash(x,y)<p){TREES.push({x,y,s:.85+hash(y,x)*.35,pine:hash(x+3,y)<.35});BL[I(x,y)]=1}}
const isDoor=(x,y)=>BLD.some(b=>b.door.x==x&&b.door.y==y);
for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(T[I(x,y)]==1&&!isDoor(x,y)){if((x*3+y*5)%17==0)LAMPS.push({x:x+.5,y:y+.5});else if((x*7+y*3)%29==0)PROPS.push({x:x+.5,y:y+.5,t:'bin'})}
PROPS.push({x:19.4,y:23.5,t:'mail'});PROPS.push({x:3.4,y:23.6,t:'sign'});
const cars=[{x:3,y:10.5,v:-2.6,col:'#e53935'},{x:30,y:11.5,v:2.2,col:'#1e88e5'},{x:12,y:25.5,v:2.8,col:'#fdd835'},{x:40,y:24.5,v:-2.4,col:'#ffffff'}];
const walk=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&!BL[I(x,y)]&&T[I(x,y)]!=4;
