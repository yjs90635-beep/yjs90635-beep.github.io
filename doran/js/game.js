// 도란도란 마을 - 실시간 3D (Three.js)
const $=id=>document.getElementById(id);
const cv=$('c'),ov=$('o');let ctx=ov.getContext('2d');
let DPR=Math.min(2,window.devicePixelRatio||1),VW=0,VH=0,PXU=52;
const R3=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false});
R3.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));R3.shadowMap.enabled=true;R3.shadowMap.type=THREE.PCFShadowMap;R3.outputColorSpace=THREE.SRGBColorSpace;
function resize(){VW=innerWidth;VH=innerHeight;R3.setSize(VW,VH,false);ov.width=VW*DPR;ov.height=VH*DPR;PXU=Math.max(56,Math.min(80,VW/5.4))}
addEventListener('resize',resize);resize();
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9fd3f5);
const cam=new THREE.OrthographicCamera(-1,1,1,-1,.5,120);
const hemi=new THREE.HemisphereLight(0xdcebff,0x7a6a52,1.1);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff1dc,2.1);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:45});sun.shadow.bias=-.0015;sun.shadow.normalBias=.02;scene.add(sun,sun.target);
const fill=new THREE.DirectionalLight(0xa9c4ff,.45);scene.add(fill,fill.target);
M3.buildWorld(scene);
// ---------- state
const KEY='doran2';
function defS(){return{name:'',type:'',top:'#e57373',pants:'#3949ab',hair:'#4e342e',hat:'',tops:['#e57373'],pantsOwn:['#3949ab'],hats:[''],money:100,bag:{},furn:['plant','chair'],room:Array(36).fill(''),jxp:{post:0,clean:0,bake:0,fish:0},lastDay:'',min:540,px:36.5,py:9.6,friend:{},fishN:0}}
let S;try{S=Object.assign(defS(),JSON.parse(localStorage.getItem(KEY))||{})}catch(e){S=defS()}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
const player={x:S.px,y:S.py,path:[],dir:[0,1],phase:0,moving:false,onArrive:null};
if(!walk(Math.floor(player.x),Math.floor(player.y))){player.x=36.5;player.y=9.6}
function poly(p,c){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fillStyle=c;ctx.fill()}
function ell(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.2832);ctx.fill()}
function rr(x,y,w,h,r,c){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fillStyle=c;ctx.fill()}
function nightF(){const h=(S.min/60)%24;if(h>=7&&h<17)return 0;if(h>=17&&h<20)return(h-17)/3;if(h>=20||h<5)return 1;return 1-(h-5)/2}
function warmF(){const h=(S.min/60)%24;return Math.max(0,1-Math.abs(h-18)/1.8)}
const ITN={coin:'동전',clover:'네잎클로버',bottle:'빈 병',flower:'들꽃',acorn:'도토리',bread:'빵',trash:'쓰레기'};
// ---------- path
function astar(sx,sy,tx,ty){if(!walk(tx,ty))return null;const s=I(sx,sy),t=I(tx,ty),N=W*H,g=new Float32Array(N).fill(1e9),f=new Float32Array(N),came=new Int32Array(N).fill(-1),cl=new Uint8Array(N),open=[s];g[s]=0;
 while(open.length){let bi=0;for(let i=1;i<open.length;i++)if(f[open[i]]<f[open[bi]])bi=i;const c=open[bi];open[bi]=open[open.length-1];open.pop();if(c==t)break;if(cl[c])continue;cl[c]=1;const cx=c%W,cy=(c/W)|0;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=cx+dx,ny=cy+dy;if(!walk(nx,ny))continue;if(dx&&dy&&(!walk(cx+dx,cy)||!walk(cx,cy+dy)))continue;const n=I(nx,ny),ng=g[c]+(dx&&dy?1.414:1);if(ng<g[n]){g[n]=ng;came[n]=c;const ax=Math.abs(nx-tx),ay=Math.abs(ny-ty);f[n]=ng+Math.max(ax,ay)+.414*Math.min(ax,ay);open.push(n)}}}
 if(s!=t&&came[t]<0)return null;const out=[];let c=t;while(c!=s&&c>=0){out.push([c%W+.5,((c/W)|0)+.5]);c=came[c]}return out.reverse()}
function nearestWalk(x,y){if(walk(x,y))return[x,y];for(let r=1;r<6;r++){let best=null,bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(walk(x+dx,y+dy)){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=[x+dx,y+dy]}}}if(best)return best}return null}
function goTo(e,tx,ty,cb,short){const n=nearestWalk(tx,ty);if(!n)return false;const p=astar(Math.floor(e.x),Math.floor(e.y),n[0],n[1]);if(!p)return false;if(short&&p.length)p.pop();e.path=p;e.onArrive=cb||null;if(!p.length&&cb){e.onArrive=null;cb()}return true}
function setDir(e,dx,dy){const l=Math.hypot(dx,dy);if(l>1e-4)e.dir=[dx/l,dy/l]}
function follow(e,dt,spd){if(!e.path.length){e.moving=false;return}const t=e.path[0],dx=t[0]-e.x,dy=t[1]-e.y,d=Math.hypot(dx,dy),st=spd*dt;
 if(d<=st){e.x=t[0];e.y=t[1];e.path.shift();if(!e.path.length){e.moving=false;const f=e.onArrive;e.onArrive=null;if(f)f();return}}else{e.x+=dx/d*st;e.y+=dy/d*st}setDir(e,dx,dy);e.moving=true;e.phase+=dt*spd*4.2}
// ---------- NPC
const NPCDEF=[
{n:'박 할머니',top:'#8e24aa',pants:'#6d4c41',hair:'#e0e0e0',hat:'',home:[10,12],hi:['어이구, 왔구나! 밥은 먹었니?','오늘 바람이 참 선선하지?'],talk:['수집소 앞 풀밭에 네잎클로버가 잘 보이더라.','젊을 땐 이 거리가 다 논이었단다.','도토리는 공원 나무 밑에 많아.','손주가 다음 달에 온대. 설레는구나.'],ask:'수집소에서 들꽃을 사 준대. 주워다 팔아 보렴.',bub:['날씨 좋다~','허리야…','꽃이 곱네']},
{n:'민수',top:'#ffa000',pants:'#1e88e5',hair:'#3e2723',hat:'cap',home:[20,9],s:.82,hi:['안녕하세요! 저랑 놀아요!','형아, 아니 누나? 아무튼 안녕!'],talk:['길에 반짝이는 거 보면 동전일 수도 있어요!','어제 강에서 엄청 큰 물고기 봤어요.','차 조심해야 돼요. 횡단보도로 건너요!'],ask:'청소소 아저씨가 쓰레기 줍는 사람 찾던데요?',bub:['야호!','심심해~','동전 어딨지?']},
{n:'하늘이',top:'#f06292',pants:'#7986cb',hair:'#5d4037',hat:'ribbon',home:[6,23],hi:['안녕! 오늘 옷 예쁘다.','반가워요~'],talk:['옷방에 새 후드가 들어왔대요.','식당 크림빵은 꼭 먹어 봐야 해요!','나중에 내 방도 놀러 와요.'],ask:'식당 사장님이 배달 알바 구한대요.',bub:['랄라~','빵 냄새 좋다','오늘 뭐 입지']},
{n:'김 반장님',top:'#455a64',pants:'#263238',hair:'#212121',hat:'beanie',home:[32,15],hi:['어, 반가워요. 동네 일은 나한테 물어봐요.','좋은 아침입니다!'],talk:['우리 마을엔 길이 세 개 있어요. 주택가, 상가거리, 강변공원.','밤에는 가로등이 켜져서 운치가 있지요.','뚝딱 공방에서 침대를 사면 방이 확 달라져요.'],ask:'마을회관에 편지가 밀렸다던데, 도와주면 좋겠어요.',bub:['흠흠','순찰 중','오늘도 평화롭군']},
{n:'소라 누나',top:'#fafafa',pants:'#4e342e',hair:'#bf360c',hat:'',home:[26,23],hi:['어서 와요~ 찻집 들렀다 가요!','안녕하세요!'],talk:['커피 마시면 발걸음이 가벼워져요.','저녁 노을 질 때 강변이 제일 예뻐요.','단골손님한테는 비밀 메뉴도 있어요.'],ask:'빵 배달 오면 제가 받을게요!',bub:['커피 한 잔?','바쁘다 바빠','라떼 아트 성공!']},
{n:'도윤 할아버지',top:'#558b2f',pants:'#5d4037',hair:'#bdbdbd',hat:'straw',home:[20,30],hi:['허허, 낚시하러 왔나?','어서 오게.'],talk:['물고기는 끈기가 필요하지.','느낌표가 뜨면 재빨리 당기게.','저 다리 끝이 명당이라네.','옛날엔 이 강에 문어도 살았다네.'],ask:'낚시터에서 낚시꾼 일을 해 보게. 용돈벌이로 그만이야.',bub:['입질이 없군','허허','오늘은 붕어다']}];
const npcs=NPCDEF.map(d=>({def:d,x:d.home[0]+.5,y:d.home[1]+.5,path:[],dir:[0,1],phase:0,moving:false,wait:Math.random()*3,bt:-Math.random()*6,bub:'',talking:false,ti:0,onArrive:null}));
function npcUpdate(dt){for(const n of npcs){n.bt-=dt;if(n.bt<-7-Math.random()*6){n.bt=3.2;n.bub=pick(n.def.bub)}
 if(n.talking){n.moving=false;continue}if(n.path.length)follow(n,dt,1.5);else{n.moving=false;n.wait-=dt;if(n.wait<=0){n.wait=2+Math.random()*5;const tx=n.def.home[0]+Math.floor(rnd(-6,7)),ty=n.def.home[1]+Math.floor(rnd(-4,5));if(walk(tx,ty)&&!isRoadT(T[I(tx,ty)]))goTo(n,tx,ty)}}}}
// ---------- items
let items=[],iid=0,spawnT=0;
function spawnItem(type,x,y){items.push({id:iid++,type,x,y,ph:Math.random()*6})}
function pickType(){const r=Math.random()*100;return r<30?'coin':r<55?'flower':r<73?'acorn':r<90?'bottle':'clover'}
function randomSpot(cx,cy,rx,ry,onlyWalk){for(let k=0;k<60;k++){const x=Math.floor(cx+rnd(-rx,rx)),y=Math.floor(cy+rnd(-ry,ry));if(walk(x,y)&&!isRoadT(T[I(x,y)])&&!isDoor(x,y))return[x,y]}return null}
for(let k=0;k<16;k++){const p=randomSpot(22,18,22,16);if(p)spawnItem(pickType(),p[0]+.5,p[1]+.5)}
function collect(it){items=items.filter(i=>i!==it);if(it.type=='coin'){const v=5+Math.floor(Math.random()*11);S.money+=v;fx(it,`+${v}방울`)}
 else if(it.type=='trash'){if(job&&job.id=='clean'){job.done++;fx(it,`쓰레기 ${job.done}/${job.total}`);if(job.done>=job.total)finishJob()}}
 else{S.bag[it.type]=(S.bag[it.type]||0)+1;fx(it,'+'+ITN[it.type]);if(it.type=='clover')toast('🍀 행운의 네잎클로버를 주웠어요!')}save()}
function itemUpdate(dt){spawnT-=dt;if(spawnT<=0){spawnT=6;if(items.filter(i=>i.type!='trash').length<16){const p=randomSpot(player.x,player.y,11,11);if(p)spawnItem(pickType(),p[0]+.5,p[1]+.5)}}
 for(const it of items.slice())if(Math.hypot(it.x-player.x,it.y-player.y)<.6)collect(it)}
let ft=[];function fx(p,t){ft.push({x:p.x,y:p.y,t,a:1.4})}
// ---------- jobs
const JOBS={post:{n:'우체부',ic:'📮',pay:40,at:'마을회관',desc:'편지 3통을 집집마다 배달해요'},clean:{n:'환경미화원',ic:'🧹',pay:35,at:'반짝 청소소',desc:'거리의 쓰레기 5개를 주워요'},bake:{n:'식당 배달',ic:'🍞',pay:45,at:'솥단지 식당',desc:'갓 구운 빵을 찻집와 손님 집에 배달해요'},fish:{n:'낚시꾼',ic:'🎣',pay:30,at:'강변 낚시터',desc:'물고기 3마리를 낚아요'}};
let job=null;const lvl=id=>1+Math.floor(S.jxp[id]/3),payOf=id=>Math.round(JOBS[id].pay*(1+.2*(lvl(id)-1)));
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((p,q)=>p[0]-q[0]).map(v=>v[1]);
function startJob(id){if(job){toast('지금 하는 일을 먼저 끝내요');return}job={id,done:0,total:3,t:[]};const houses=BLD.filter(b=>b.kind=='house'),dp=b=>({x:b.door.x+.5,y:b.door.y+.5,l:b.name});
 if(id=='post')job.t=shuffle(houses).slice(0,3).map(dp);
 if(id=='bake'){job.t=[dp(BLD.find(b=>b.kind=='cafe')),dp(pick(houses))];job.total=2}
 if(id=='clean'){let n=0;for(let k=0;k<40&&n<5;k++){const p=randomSpot(player.x,player.y,9,7);if(p&&T[I(p[0],p[1])]==1&&!items.some(i=>Math.floor(i.x)==p[0]&&Math.floor(i.y)==p[1])){spawnItem('trash',p[0]+.5,p[1]+.5);n++}}job.total=n}
 if(id=='fish')job.t=[{x:21.5,y:34.5,l:'낚시터 다리 끝'}];
 if(id!='fish')closePanel();toast(`${JOBS[id].ic} ${JOBS[id].n} 일을 시작해요!<br>노란 화살표를 따라가세요`)}
function jobTarget(){if(!job)return null;if(job.id=='clean'){let b=null,bd=1e9;for(const it of items)if(it.type=='trash'){const d=Math.hypot(it.x-player.x,it.y-player.y);if(d<bd){bd=d;b=it}}return b?{x:b.x,y:b.y,l:'쓰레기'}:null}if(job.id=='fish')return job.t[0];return job.t[job.done]}
function jobUpdate(){if(!job||(job.id!='post'&&job.id!='bake'))return;const t=job.t[job.done];if(t&&Math.hypot(player.x-t.x,player.y-t.y)<1){job.done++;fx(t,job.id=='post'?'💌 배달 완료':'🍞 배달 완료');toast(`${job.id=='post'?'💌 편지를':'🍞 빵을'} ${t.l}에 전했어요 (${job.done}/${job.total})`);if(job.done>=job.total)finishJob()}}
function finishJob(){const id=job.id,J=JOBS[id],L=lvl(id),pay=payOf(id);S.money+=pay;S.jxp[id]++;const L2=lvl(id);job=null;save();setTimeout(()=>toast(`🎉 ${J.n} 일 끝! 급여 ${pay}방울`+(L2>L?`<br>⭐ ${J.n} 레벨 ${L2}!`:'')),900)}
// ---------- UI
let pClose=null,curB=null;
function openPanel(h,oc){if(pClose&&pClose!==oc){const f=pClose;pClose=null;f()}pClose=oc||null;const p=$('panel');p.innerHTML=h;p.style.display='block'}
function closePanel(){$('panel').style.display='none';clearTimeout(fs.tm);fs.st='idle';const f=pClose;pClose=null;if(f)f()}
const panelOpen=()=>$('panel').style.display=='block';
let toastT;function toast(h){const t=$('toast');t.innerHTML=h;t.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>t.style.display='none',2300)}
const CLOSE='<button class="big gray" onclick="closePanel()">닫기</button>';
function jobBox(id){const J=JOBS[id];if(job&&job.id==id)return`<p>지금 ${J.n} 일을 하는 중이에요 (${job.done}/${job.total})</p>`;return`<div class="row"><span>${J.ic} <b>${J.n}</b> · 레벨 ${lvl(id)}<br><small>${J.desc} · 급여 ${payOf(id)}방울</small></span><button onclick="startJob('${id}')">일하기</button></div>`}
const SELL={flower:8,clover:20,acorn:3,bottle:5};
function sellRows(ts){return ts.map(t=>`<div class="row"><span>${ITN[t]} ×${S.bag[t]||0}<br><small>개당 ${SELL[t]}방울</small></span><button onclick="sell('${t}')">모두 팔기</button></div>`).join('')}
function sell(t){const n=S.bag[t]||0;if(!n){toast('팔 물건이 없어요');return}S.money+=n*SELL[t];S.bag[t]=0;save();toast(`${ITN[t]} ${n}개를 ${n*SELL[t]}방울에 팔았어요`);enter(curB)}
function coffee(){if(S.money<15){toast('돈이 모자라요');return}S.money-=15;boost=60;save();toast('☕ 따뜻한 커피! 1분 동안 걸음이 빨라져요')}
function buyBread(){if(S.money<12){toast('돈이 모자라요');return}S.money-=12;S.bag.bread=(S.bag.bread||0)+1;save();toast('🍞 빵을 가방에 넣었어요. 주민에게 선물해 보세요')}
function enter(b){curB=b;player.path=[];const k=b.kind;
 if(k=='home'){enterRoom();return}if(k=='house'){toast(`🏠 ${b.name}이에요.<br>문이 닫혀 있어요.`);return}
 if(k=='clothes'){shopClothes();return}if(k=='furn'){shopFurn();return}
 let h=`<h3>${SIGN[k]} ${b.name}</h3>`;
 if(k=='post')h+='<p>마을회관장: "편지가 산더미예요. 도와줄래요?"</p>'+jobBox('post');
 if(k=='clean')h+='<p>센터장: "깨끗한 거리는 모두의 자랑이죠!"<br><small>빈 병도 여기서 사요.</small></p>'+jobBox('clean')+sellRows(['bottle']);
 if(k=='bakery')h+='<p>사장님: "고소한 냄새 나죠? 배달 좀 부탁해요!"</p>'+jobBox('bake')+`<div class="row"><span>🍞 갓 구운 빵</span><button onclick="buyBread()">12방울</button></div>`;
 if(k=='flower')h+='<p>수집소 주인: "들꽃, 클로버, 도토리를 사요!"</p>'+sellRows(['flower','clover','acorn']);
 if(k=='cafe')h+=`<p>소라 누나가 일하는 찻집예요.</p><div class="row"><span>☕ 따뜻한 커피<br><small>1분 동안 걸음이 빨라져요</small></span><button onclick="coffee()">15방울</button></div>`;
 openPanel(h+CLOSE)}
const TOPS=[['#e57373','빨간 티',0],['#64b5f6','하늘 셔츠',60],['#81c784','풀잎 니트',60],['#ba68c8','보라 후드',90],['#ffd54f','노랑 조끼',90],['#f5f5f5','하얀 셔츠',70]];
const PANTS=[['#3949ab','청바지',0],['#5d4037','갈색 바지',50],['#212121','검정 바지',50],['#ef9a9a','분홍 바지',70]];
const HATS=[['','모자 없음',0],['cap','야구 모자',80],['beanie','털모자',80],['straw','밀짚모자',100],['ribbon','리본',60],['crown','작은 왕관',300]];
function myLook(){return{top:S.top,pants:S.pants,hair:S.hair,hat:S.hat}}
function shopClothes(){const row=(t,list,own,cur)=>list.map(([id,n,p])=>{const has=own.includes(id);return`<div class="row"><span>${t=='hat'?'':`<span class="sw" style="background:${id};vertical-align:middle;width:30px;height:30px"></span>`}${n}</span><button onclick="buyC('${t}','${id}',${p})">${has?(cur==id?'착용 중':'입기'):p+'원'}</button></div>`}).join('');
 openPanel(`<h3>👕 옷방</h3><canvas id="pv" width="130" height="150" style="display:block;margin:auto;background:#fff3e0;border-radius:14px"></canvas><h4>윗옷</h4>${row('top',[[M3.TYPES[S.type||'fa'].def.top,'기본 윗옷',0],...TOPS],S.tops,S.top)}<h4>바지</h4>${row('pants',[[M3.TYPES[S.type||'fa'].def.pants,'기본 아래옷',0],...PANTS],S.pantsOwn,S.pants)}<h4>모자</h4>${row('hat',HATS,S.hats,S.hat)}`+CLOSE);drawPreview('pv',myLook())}
function buyC(t,id,p){const own=t=='top'?S.tops:t=='pants'?S.pantsOwn:S.hats;if(!own.includes(id)){if(S.money<p){toast('돈이 조금 모자라요.<br>일을 하거나 낚시해 보세요!');return}S.money-=p;own.push(id)}S[t]=id;save();const sc=$('panel').scrollTop;shopClothes();$('panel').scrollTop=sc}
// furniture
const FURN={
 bed:{n:'침대',p:150},chair:{n:'의자',p:40},table:{n:'탁자',p:60},plant:{n:'화분',p:30},tv:{n:'텔레비전',p:200},sofa:{n:'소파',p:180},lamp:{n:'스탠드',p:50},rug:{n:'러그',p:45},shelf:{n:'책장',p:90},piano:{n:'피아노',p:350}};
function furnCanvas(id){return`<canvas class="fp" data-f="${id}" width="80" height="80" style="vertical-align:middle"></canvas>`}
function shopFurn(){let h='<h3>🛋️ 뚝딱 공방</h3><p><small>산 가구는 내 집에서 배치해요.</small></p>';for(const id in FURN){const f=FURN[id],n=S.furn.filter(v=>v==id).length+ROOM().filter(v=>v==id).length;h+=`<div class="row"><span>${furnCanvas(id)} ${f.n}<br><small>가진 개수 ${n}</small></span><button onclick="buyF('${id}')">${f.p}방울</button></div>`}
 openPanel(h+CLOSE);drawFurnCanvases()}
function buyF(id){const f=FURN[id];if(S.money<f.p){toast('돈이 조금 모자라요');return}S.money-=f.p;S.furn.push(id);save();toast(`${f.n}을(를) 샀어요! 내 집에서 놓아 보세요`);const sc=$('panel').scrollTop;shopFurn();$('panel').scrollTop=sc}
let MODE='town',rpick=null,RO={x:0,y:0,s:1};
function enterRoom(){MODE='room';$('btns').style.display='none';roomUI()}
function leaveRoom(){MODE='town';$('btns').style.display='flex';rpick=null;closePanel();const b=BLD.find(b=>b.kind=='home');player.x=b.door.x+.5;player.y=b.door.y+.5;player.dir=[.45,.9]}
function roomUI(){const cnt={};S.furn.forEach(f=>cnt[f]=(cnt[f]||0)+1);let h=`<h3>${roomTitle()}</h3><p style="margin:4px 0"><small>가구를 고르고 바닥을 누르세요. 놓인 가구를 누르면 보관함으로 돌아가요.</small></p><div>`;
 const ks=Object.keys(cnt);if(!ks.length)h+='<p>보관함이 비었어요. 뚝딱 공방에서 사 오세요!</p>';
 ks.forEach(k=>h+=`<button style="margin:3px;padding:4px 8px;${rpick==k?'background:#ff7043;color:#fff':''}" onclick="rpick='${k}';roomUI()">${furnCanvas(k)}<br>${FURN[k].n}×${cnt[k]}</button>`);
 openPanel(h+'</div>'+(window.roomBtns?roomBtns():'')+'<button class="big" onclick="leaveRoom()">🚪 밖으로 나가기</button>');drawFurnCanvases()}
// fishing
const FISH=[['붕어',15,60,'#90a4ae'],['열대어',30,25,'#ff7043'],['복어',50,10,'#ffd54f'],['새우',8,80,'#f48fb1'],['잉어',80,6,'#ef6c00']];
let fs={st:'idle',tm:0};
function openFish(){openPanel(`<h3>🎣 강변 낚시</h3><div id="fb" style="font-size:70px;text-align:center;height:100px;line-height:100px;background:linear-gradient(#bbdefb,#64b5f6);border-radius:14px">🌊</div><p id="fm" style="text-align:center">낚싯대를 던져 보세요.</p><button class="big" id="fbtn">낚싯대 던지기</button>${!job?`<button class="big" style="background:#aed581" onclick="startJob('fish');openFish()">🎣 낚시꾼 일 하기 (3마리, 급여 ${payOf('fish')}방울)</button>`:''}<button class="big gray" onclick="closePanel()">그만하기</button>`);fs.st='idle';$('fbtn').onclick=fishTap}
function fishTap(){const b=$('fb'),m=$('fm'),k=$('fbtn');if(fs.st=='idle'){fs.st='wait';b.textContent='🎏';m.textContent='기다리는 중... ❗가 뜨면 누르세요!';k.textContent='당기기!';fs.tm=setTimeout(()=>{fs.st='bite';b.textContent='❗';fs.tm=setTimeout(()=>{if(fs.st=='bite'){fs.st='idle';b.textContent='💨';m.textContent='아쉬워요, 놓쳤어요.';k.textContent='낚싯대 던지기'}},1500)},1500+Math.random()*3000)}
 else if(fs.st=='wait'){clearTimeout(fs.tm);fs.st='idle';b.textContent='🌊';m.textContent='너무 빨랐어요! ❗를 기다리세요.';k.textContent='낚싯대 던지기'}
 else if(fs.st=='bite'){clearTimeout(fs.tm);fs.st='idle';let tot=FISH.reduce((a,f)=>a+f[2],0),r=Math.random()*tot,f=FISH[0];for(const x of FISH){if((r-=x[2])<0){f=x;break}}S.money+=f[1];S.fishN++;b.textContent='🐟';m.innerHTML=`<b>${f[0]}</b>을(를) 잡았어요! ${f[1]}방울에 팔았어요.`;k.textContent='낚싯대 던지기';
  if(job&&job.id=='fish'){job.done++;if(job.done>=job.total)finishJob()}save()}}
// talk
function openTalk(n){n.talking=true;setDir(n,player.x-n.x,player.y-n.y);setDir(player,n.x-player.x,n.y-player.y);n.oc=n.oc||(()=>{n.talking=false});talkPanel(n,pick(n.def.hi))}
function talkPanel(n,line){n.bub=line;n.bt=4;const f=S.friend[n.def.n]||0;window._tn=n;
 openPanel(`<h3>${n.def.n} <span style="font-size:16px">${'❤️'.repeat(Math.min(5,f))}${'🤍'.repeat(Math.max(0,5-f))}</span></h3><div style="background:#fff;border-radius:12px;padding:12px;font-size:20px;border:2px solid #ffcc80">"${line}"</div><button class="ch" onclick="tch(0)">👋 인사하기</button><button class="ch" onclick="tch(1)">💬 요즘 이야기 듣기</button><button class="ch" onclick="tch(2)">🎁 선물 주기</button><button class="ch" onclick="tch(3)">🙋 일거리 있을까요?</button><button class="ch gray" onclick="closePanel()">👋 잘 있어요</button>`,n.oc)}
function tch(k){const n=window._tn,d=n.def;if(k==0)talkPanel(n,pick(d.hi));if(k==1){talkPanel(n,d.talk[n.ti++%d.talk.length])}if(k==3)talkPanel(n,d.ask);
 if(k==2){const it=['bread','clover','flower','acorn','bottle'].find(t=>S.bag[t]>0);if(!it){talkPanel(n,'마음만으로도 고마워요. 길에서 주운 걸 주면 좋아해요!');return}S.bag[it]--;S.friend[d.n]=(S.friend[d.n]||0)+1;S.money+=10;save();talkPanel(n,`${ITN[it]}? 정말 고마워요! 작은 답례예요. (+10방울)`)}}
function talkTo(n){if(Math.hypot(n.x-player.x,n.y-player.y)<1.7){openTalk(n);return}n.talking=true;n.path=[];if(!goTo(player,Math.floor(n.x),Math.floor(n.y),()=>openTalk(n),true))n.talking=false;else setTimeout(()=>{if(!panelOpen()&&player.onArrive==null&&!(Math.hypot(n.x-player.x,n.y-player.y)<2))n.talking=false},15000)}
// bag & jobs panel
$('bagb').onclick=()=>{let h='<h3>🎒 가방</h3>';const ks=Object.keys(S.bag).filter(k=>S.bag[k]>0);if(!ks.length)h+='<p>비어 있어요. 길에서 반짝이는 물건을 주워 보세요!</p>';ks.forEach(k=>h+=`<div class="row"><span>${ITN[k]}</span><b>×${S.bag[k]}</b></div>`);h+='<p><small>들꽃·클로버·도토리는 수집소, 빈 병은 청소소에서 팔 수 있어요. 주민에게 선물해도 좋아요.</small></p>';openPanel(h+CLOSE)};
$('jobb').onclick=()=>{let h='<h3>📒 직업 수첩</h3>';for(const id in JOBS){const J=JOBS[id];h+=`<div class="row"><span>${J.ic} <b>${J.n}</b> 레벨 ${lvl(id)}<br><small>${J.at}에서 시작 · ${J.desc}</small></span><span>${payOf(id)}방울</span></div>`}if(job)h+=`<button class="big gray" onclick="job=null;items=items.filter(i=>i.type!='trash');closePanel()">지금 하는 일 그만두기</button>`;openPanel(h+CLOSE)};
let actF=null,pb='',pbt=0;
function say(t){pb=t;pbt=3.5;const n=npcs.find(n=>Math.hypot(n.x-player.x,n.y-player.y)<4&&!n.talking);if(n)setTimeout(()=>{n.bub=pick(n.def.hi);n.bt=3.5;setDir(n,player.x-n.x,player.y-n.y)},1100)}
document.querySelectorAll('#emo button').forEach(b=>b.onclick=()=>say(b.dataset.e));
$('cs').onclick=()=>{const v=$('ci').value.trim();if(v){say(v);$('ci').value='';$('ci').blur()}};$('ci').addEventListener('keydown',e=>{if(e.key=='Enter')$('cs').onclick()});
$('dial').onclick=()=>{const m=$('menu');m.style.display=m.style.display=='flex'?'none':'flex'};
document.querySelectorAll('#menu button').forEach(b=>b.addEventListener('click',()=>$('menu').style.display='none'));
$('helpb').onclick=()=>openPanel('<h3>❔ 도움말</h3><p>· 땅을 누르면 걸어가요. 화면을 끌면 조이스틱처럼 움직여요.<br>· 건물을 누르면 들어가요.<br>· 주민을 누르면 이야기해요.<br>· 반짝이는 물건은 다가가면 주워요.<br>· 아래 얼굴 버튼으로 기분을 표현하고, 글을 적어 말할 수 있어요.</p><p style="font-size:14px;color:#777">만든 이: 도란도란 마을 · 캐릭터 3D 모델: Meshy (meshy.ai) · 3D 엔진: three.js</p>'+CLOSE);$('act').onclick=()=>{if(actF)actF()};
function zoneName(){const y=player.y;return y<10?'솔바람 주택가':y<24?'햇살 상가거리':'은빛 강변공원'}
function nearWater(){const x=Math.floor(player.x),y=Math.floor(player.y);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<W&&ny<H&&T[I(nx,ny)]==4)return true}return false}
function hud(){const h=Math.floor(S.min/60),m=Math.floor(S.min%60);$('clock').textContent=(nightF()>.5?'🌙':warmF()>.3?'🌇':'☀️')+` ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;$('money').textContent='';$('cash').textContent='🔔 '+S.money;$('zone').textContent='📍'+(MODE=='room'?'내 집':zoneName());
 const j=$('job');if(job&&MODE=='town'){j.style.display='block';const J=JOBS[job.id],t=jobTarget();j.innerHTML=`${J.ic} <b>${J.n}</b> ${job.done}/${job.total}${t?' · 목표: '+t.l+' <small>(노란 화살표)</small>':''}`}else j.style.display='none';
 let txt='',f=null;if(MODE=='town'&&!panelOpen()){for(const b of BLD)if(Math.hypot(player.x-b.door.x-.5,player.y-b.door.y-.5)<.9){txt=`🚪 ${b.name} 들어가기`;f=()=>enter(b);break}
  if(!f)for(const n of npcs)if(Math.hypot(player.x-n.x,player.y-n.y)<1.6){txt=`💬 ${n.def.n}와 이야기`;f=()=>openTalk(n);break}
  if(!f&&nearWater()){txt='🎣 낚시하기';f=openFish}}
 actF=f;const a=$('act');if(f){if(a.textContent!=txt)a.textContent=txt;a.style.display='block'}else a.style.display='none'}
function bubble(sx,sy,txt){if(txt.length>16)txt=txt.slice(0,15)+'…';ctx.font='bold 15px sans-serif';const w=ctx.measureText(txt).width+18;rr(sx-w/2,sy-28,w,25,8,'rgba(0,0,0,.62)');poly([[sx-5,sy-3],[sx+5,sy-3],[sx,sy+3]],'rgba(0,0,0,.62)');ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,sx,sy-15.5)}
function daily(){const d=new Date().toLocaleDateString('ko-KR');if(S.lastDay!=d){S.lastDay=d;S.money+=50;save();openPanel(`<h3>🎁 오늘의 출석 선물</h3><p>${S.name}님, 반가워요!<br>오늘도 도란도란 마을에 오셨네요. <b>50방울</b>을 드려요.</p><p><small>화면을 누르면 걸어가고, 끌면 조이스틱처럼 움직여요.</small></p><button class="big" onclick="closePanel()">고마워요</button>`)}}
const TC=['#e57373','#64b5f6','#81c784'],HC=['#4e342e','#212121','#8d6e63','#f9a825','#bdbdbd'];
// ---------- 3D people
const NT=['fa','mc','fc','ma','fa','ma'];NPCDEF.forEach((d,i)=>d.t=NT[i]);
const XRAY=new THREE.MeshBasicMaterial({color:0x6fd36f,transparent:true,opacity:.45,depthFunc:THREE.GreaterDepth,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-8});
for(const n of npcs){n.obj=M3.person(n.def.t,n.def);scene.add(n.obj)}
let pkey='';
function syncPlayer(){const k=S.type+S.top+S.pants+S.hair+S.hat;if(k==pkey&&player.obj)return;pkey=k;let par=scene;if(player.obj){par=player.obj.parent||scene;par.remove(player.obj);M3.dispose(player.obj)}
 player.obj=M3.person(S.type||'fa',myLook());player.obj.userData.xrays=[];for(const m of player.obj.userData.meshes){const x=new THREE.Mesh(m.geometry,XRAY);x.renderOrder=2;x.visible=false;m.add(x);player.obj.userData.xrays.push(x)}par.add(player.obj)}
const carM=cars.map(c=>{const m=M3.car(c.col);m.rotation.y=c.v>0?0:Math.PI;scene.add(m);return m});
const ITYPES=['coin','clover','bottle','flower','acorn','trash','bread'],IM={};
for(const t of ITYPES){if(t=='bread')continue;const im=new THREE.InstancedMesh(M3.itemGeo(t),M3.VC,40);im.count=0;im.frustumCulled=false;scene.add(im);IM[t]=im}
const _d=new THREE.Object3D(),_v=new THREE.Vector3(),_n=new THREE.Vector2(),RC=new THREE.Raycaster(),GP=new THREE.Plane(new THREE.Vector3(0,1,0),0);
const P=(x,y,z)=>{_v.set(x,(z||0)/39.2,y).project(cam);return[(_v.x+1)/2*VW,(1-_v.y)/2*VH]};
// ---------- camera
let ZM=1;let yaw=Math.PI/4,yawT=yaw;const PITCH=.56;
function camUpdate(tx,tz,ty,pxu){yaw+=(yawT-yaw)*.2;const d=40;cam.position.set(tx+Math.sin(yaw)*Math.cos(PITCH)*d,ty+Math.sin(PITCH)*d,tz+Math.cos(yaw)*Math.cos(PITCH)*d);cam.lookAt(tx,ty,tz);
 const hw=VW/2/pxu,hh=VH/2/pxu,off=(panelOpen()?VH*.24:56)/pxu;cam.left=-hw;cam.right=hw;cam.top=hh-off;cam.bottom=-hh-off;cam.updateProjectionMatrix()}
function rot(k){yawT+=k*Math.PI/4}
$('rl').onclick=()=>rot(-1);$('rr').onclick=()=>rot(1);addEventListener('keydown',e=>{if(e.target.tagName=='INPUT')return;if(e.key=='q')rot(-1);if(e.key=='e')rot(1)});
// ---------- previews (offscreen, 같은 GL 컨텍스트 사용)
const pvScene=new THREE.Scene();pvScene.add(new THREE.HemisphereLight(0xffffff,0x8a7a66,1.3));{const l=new THREE.DirectionalLight(0xffffff,1.8);l.position.set(2,4,5);pvScene.add(l)}
const pvCam=new THREE.OrthographicCamera(-1,1,1,-1,.1,50),pvRT={};
function snap(obj,w,h,dir,fs){const k=w+'x'+h;if(!pvRT[k]){pvRT[k]=new THREE.WebGLRenderTarget(w*2,h*2);pvRT[k].texture.colorSpace=THREE.SRGBColorSpace}const rt=pvRT[k];
 pvScene.add(obj);const bb=new THREE.Box3().setFromObject(obj),c=bb.getCenter(new THREE.Vector3()),sz=bb.getSize(new THREE.Vector3());let s=Math.max(sz.y*.56,Math.max(sz.x,sz.z)*.62*h/w);if(fs){s=fs;c.set(0,fs-.04,0)}
 pvCam.left=-s*w/h;pvCam.right=s*w/h;pvCam.top=s;pvCam.bottom=-s;pvCam.position.copy(c).addScaledVector(dir,20);pvCam.lookAt(c);pvCam.updateProjectionMatrix();
 const oc=R3.getClearColor(new THREE.Color()),oa=R3.getClearAlpha();try{R3.setRenderTarget(rt);R3.setClearColor(0,0);R3.clear();R3.render(pvScene,pvCam);var px=new Uint8Array(w*h*16);R3.readRenderTargetPixels(rt,0,0,w*2,h*2,px)}finally{R3.setRenderTarget(null);R3.setClearColor(oc,oa);pvScene.remove(obj)}
 const cvs=document.createElement('canvas');cvs.width=w*2;cvs.height=h*2;const g=cvs.getContext('2d'),id=g.createImageData(w*2,h*2);for(let y=0;y<h*2;y++)id.data.set(px.subarray((h*2-1-y)*w*8,(h*2-y)*w*8),y*w*8);g.putImageData(id,0,0);return cvs}
const FRONT=new THREE.Vector3(.35,.18,1).normalize(),ISO=new THREE.Vector3(.8,.75,1).normalize();
const pvCache={};
function personSnap(type,look,w,h){const k=[type,look.top,look.pants,look.hair,look.hat,w,h].join();if(pvCache[k])return pvCache[k];const p=M3.person(type,look);const c=snap(p,w,h,FRONT,.78);M3.dispose(p);if(Object.keys(pvCache).length>30)for(const q in pvCache)delete pvCache[q];return pvCache[k]=c}
function drawPreview(id,look,type){const c=$(id);if(!c)return;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(personSnap(type||S.type||'fa',look,c.width,c.height),0,0,c.width,c.height)}
const furnGeo={};function furnMesh(id){if(!furnGeo[id])furnGeo[id]=M3.furn(id).geometry;const m=new THREE.Mesh(furnGeo[id],M3.VC);m.castShadow=m.receiveShadow=true;return m}
const furnPv={};
function furnCanvas(id){return`<canvas class="fp" data-f="${id}" width="64" height="64" style="vertical-align:middle"></canvas>`}
function drawFurnCanvases(){document.querySelectorAll('canvas.fp').forEach(c=>{const id=c.dataset.f;if(!furnPv[id])furnPv[id]=snap(furnMesh(id),64,64,ISO);const g=c.getContext('2d');g.clearRect(0,0,64,64);g.drawImage(furnPv[id],0,0,64,64)})}
// ---------- room scene
const roomScene=new THREE.Scene();roomScene.background=new THREE.Color(0x2a1e16);
const rHemi=new THREE.HemisphereLight(0xfff4e0,0x5a4030,1.2),rSun=new THREE.DirectionalLight(0xfff0d0,1.6);rSun.position.set(5,8,7);rSun.target.position.set(3,0,3);rSun.castShadow=true;rSun.shadow.mapSize.set(512,512);Object.assign(rSun.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:1,far:30});roomScene.add(rHemi,rSun,rSun.target,M3.room());
let roomF=[];
function buildRoom(){roomF.forEach(m=>roomScene.remove(m));roomF=[];ROOM().forEach((f,i)=>{if(!f)return;const m=furnMesh(f);m.position.set(i%6,0,(i/6)|0);roomScene.add(m);roomF.push(m)})
 let pc=[2,3];for(const c of[[2,3],[3,2],[3,3],[2,2],[4,4],[1,4],[4,1]])if(!ROOM()[c[1]*6+c[0]]){pc=c;break}syncPlayer();roomScene.add(player.obj);player.obj.position.set(pc[0]+.5,0,pc[1]+.5);player.obj.rotation.y=.6;if(window.roomExtra)roomExtra()}
const _ru=roomUI;roomUI=function(){_ru();buildRoom()};
const _lr=leaveRoom;leaveRoom=function(){_lr();scene.add(player.obj);player.dir=[.3,.95]};
function roomTap(sx,sy){_n.set(sx/VW*2-1,-(sy/VH)*2+1);RC.setFromCamera(_n,cam);if(!RC.ray.intersectPlane(GP,_v))return;const x=Math.floor(_v.x),y=Math.floor(_v.z);if(x<0||y<0||x>5||y>5)return;const i=y*6+x;if(!cellOK(x,y)){toast('이 집은 여기까지만 쓸 수 있어요');return}
 if(ROOM()[i]){S.furn.push(ROOM()[i]);ROOM()[i]=''}else if(rpick&&S.furn.includes(rpick)){S.furn.splice(S.furn.indexOf(rpick),1);ROOM()[i]=rpick;if(!S.furn.includes(rpick))rpick=null}else{toast('먼저 아래에서 가구를 골라요');return}save();roomUI()}
// ---------- input (탭 이동, 한 손가락 조이스틱, 두 손가락 회전)
let pd=null,joy=null,tapM=null;const ptr=new Map();let twoX=null;
ov.addEventListener('pointerdown',e=>{ptr.set(e.pointerId,e.clientX);if(ptr.size>=2){pd=null;joy=null;twoX=[...ptr.values()].reduce((a,b)=>a+b)/ptr.size;return}pd={x:e.clientX,y:e.clientY};joy=null});
ov.addEventListener('pointermove',e=>{if(ptr.has(e.pointerId))ptr.set(e.pointerId,e.clientX);if(ptr.size>=2&&twoX!=null){const m=[...ptr.values()].reduce((a,b)=>a+b)/ptr.size;yawT-=(m-twoX)*.012;yaw=yawT;twoX=m;return}
 if(!pd)return;const dx=e.clientX-pd.x,dy=e.clientY-pd.y;if(!joy&&Math.hypot(dx,dy)>16&&MODE=='town'&&!panelOpen())joy={ox:pd.x,oy:pd.y,dx:0,dy:0};if(joy){joy.dx=dx;joy.dy=dy}});
const endP=e=>{ptr.delete(e.pointerId);if(ptr.size<2)twoX=null;if(!pd)return;if(!joy)tap(e.clientX,e.clientY);pd=null;joy=null;player.moving=player.path.length>0};
ov.addEventListener('pointerup',endP);ov.addEventListener('pointercancel',e=>{ptr.delete(e.pointerId);twoX=null;pd=null;joy=null});
const BOX=BLD.map(b=>new THREE.Box3(new THREE.Vector3(b.x0,0,b.y0),new THREE.Vector3(b.x1,b.hu+(b.style=='house'?.95:.3),b.y1+.5)));
function tap(sx,sy){if(MODE=='room'){roomTap(sx,sy);return}if(panelOpen())closePanel();
 for(const n of npcs){const[fx,fy]=P(n.x,n.y,0),[,hy]=P(n.x,n.y,n.obj.userData.h*39.2);if(Math.abs(sx-fx)<26&&sy>hy-12&&sy<fy+10){talkTo(n);return}}
 _n.set(sx/VW*2-1,-(sy/VH)*2+1);RC.setFromCamera(_n,cam);const g=RC.ray.intersectPlane(GP,new THREE.Vector3());const dg=g?g.distanceTo(RC.ray.origin):1e9;
 let best=null,bd=dg;BLD.forEach((b,i)=>{if(RC.ray.intersectBox(BOX[i],_v)){const d=_v.distanceTo(RC.ray.origin);if(d<bd){bd=d;best=b}}});
 if(best){const b=best;tapM={x:b.door.x+.5,y:b.door.y+.5,a:1};goTo(player,b.door.x,b.door.y,()=>enter(b));return}
 if(!g)return;const tx=Math.floor(g.x),ty=Math.floor(g.z);if(tx<0||ty<0||tx>=W||ty>=H)return;
 const n=nearestWalk(tx,ty);if(!n){toast('물가로 가서 낚시해요');return}tapM={x:n[0]+.5,y:n[1]+.5,a:1};
 goTo(player,n[0],n[1],T[I(tx,ty)]==4?()=>openFish():null)}
// ---------- loop
let boost=0,hudT=0,saveT=5,last=performance.now();
function tryMove(e,dx,dy){const nx=e.x+dx;if(walk(Math.floor(nx+Math.sign(dx)*.22),Math.floor(e.y)))e.x=nx;const ny=e.y+dy;if(walk(Math.floor(e.x),Math.floor(ny+Math.sign(dy)*.22)))e.y=ny}
function update(dt){S.min+=dt*2.4;if(S.min>=1440)S.min-=1440;boost=Math.max(0,boost-dt);pbt-=dt;
 if(MODE=='town'){const spd=3.2*(boost>0?1.5:1)*(S.ride?1.45:1);
  if(joy){const l=Math.hypot(joy.dx,joy.dy);if(l>10){player.path=[];player.onArrive=null;const vx=joy.dx/l,vy=joy.dy/l,c=Math.cos(yaw),s=Math.sin(yaw);const wx=vx*c+vy*s,wy=-vx*s+vy*c;const m=Math.min(1,l/60)*spd*dt;tryMove(player,wx*m,wy*m);setDir(player,wx,wy);player.moving=true;player.phase+=dt*spd*4.2}else player.moving=false}
  else follow(player,dt,spd);
  npcUpdate(dt);itemUpdate(dt);jobUpdate();for(const c of cars){c.x+=c.v*dt;if(c.x>W+3)c.x=-3;if(c.x<-3)c.x=W+3}}
 for(const f of ft)f.a-=dt;ft=ft.filter(f=>f.a>0);if(tapM){tapM.a-=dt*1.2;if(tapM.a<=0)tapM=null}
 hudT-=dt;if(hudT<=0){hudT=.25;hud()}saveT-=dt;if(saveT<=0){saveT=5;S.px=player.x;S.py=player.y;save()}}
const _c1=new THREE.Color(),SKY=new THREE.Color(0x9fd3f5),NSKY=new THREE.Color(0x0d1530),DUSK=new THREE.Color(0xffa060),NH=new THREE.Color(0x3a4a8a);
function placeP(e,t){const o=e.obj,tt=T[I(Math.floor(e.x),Math.floor(e.y))];o.position.set(e.x,tt==1?.04:tt==5?.1:0,e.y);const a=Math.atan2(e.dir[0],e.dir[1]);let d=a-o.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));o.rotation.y+=d*.3;M3.pose(o,e.phase,e.moving,t)}
let wOff=0;
function render(t,dt){ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,VW,VH);syncPlayer();
 if(MODE=='room'){(player.obj.userData.xrays||[]).forEach(x=>x.visible=false);camUpdate(3,3,.6,Math.min(78,VW/7.2));M3.pose(player.obj,0,false,t);R3.render(roomScene,cam);return}
 camUpdate(player.x,player.y,.6,PXU*ZM);
 const nf=nightF(),wf=warmF();
 _c1.copy(SKY).lerp(DUSK,wf*.6).lerp(NSKY,nf);scene.background.copy(_c1);
 sun.intensity=2.1*(1-.88*nf);sun.color.setRGB(1,.95-.25*wf,.86-.45*wf);hemi.intensity=1.1-.55*nf;hemi.color.set(0xdcebff).lerp(NH,nf);fill.intensity=.45*(1-.5*nf);
 M3.GLASS.emissiveIntensity=nf*1.25;
 sun.position.set(player.x-6,14,player.y+3);sun.target.position.set(player.x,0,player.y);fill.position.set(player.x+6,6,player.y-4);fill.target.position.set(player.x,0,player.y);
 if(M3.water){wOff+=dt*.03;M3.water.offset.set(wOff,wOff*.4)}
 cars.forEach((c,i)=>carM[i].position.set(c.x,0,c.y));
 for(const n of npcs)placeP(n,t);placeP(player,t);
 const cnt={};for(const it of items){const im=IM[it.type];if(!im)continue;const k=cnt[it.type]=(cnt[it.type]||0);if(k>=40)continue;cnt[it.type]++;_d.position.set(it.x,.04+Math.abs(Math.sin(t/300+it.ph))*.08,it.y);_d.rotation.set(0,t/700+it.ph,0);_d.updateMatrix();im.setMatrixAt(k,_d.matrix)}
 for(const k in IM){IM[k].count=cnt[k]||0;IM[k].instanceMatrix.needsUpdate=true}
 {_v.set(player.x,.7,player.y);RC.ray.origin.copy(cam.position);RC.ray.direction.copy(_v).sub(cam.position);const dl=RC.ray.direction.length();RC.ray.direction.normalize();const _h=new THREE.Vector3();const hide=BOX.some(b=>RC.ray.intersectBox(b,_h)&&_h.distanceTo(cam.position)<dl-.3);(player.obj.userData.xrays||[]).forEach(x=>x.visible=hide)}
 R3.render(scene,cam);
 // 2D overlay
 if(tapM){const[a,b]=P(tapM.x,tapM.y,0);ctx.strokeStyle=`rgba(255,255,255,${tapM.a})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(a,b,22*(1.3-tapM.a*.3),11*(1.3-tapM.a*.3),0,0,6.2832);ctx.stroke()}
 const jt=jobTarget();if(jt){const[a,b]=P(jt.x,jt.y,0),p=1+Math.sin(t/200)*.15;ctx.strokeStyle='#ffeb3b';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(a,b,20*p,10*p,0,0,6.2832);ctx.stroke()}
 const vis=(a,b,pad)=>a>-pad&&a<VW+pad&&b>-pad&&b<VH+pad;
 if(nf>.2){ctx.globalCompositeOperation='lighter';for(const l of LAMPS){const[a,b]=P(l.x,l.y,0);if(!vis(a,b,100))continue;const g=ctx.createRadialGradient(a,b-50,2,a,b-25,70);g.addColorStop(0,`rgba(255,220,120,${.4*nf})`);g.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=g;ctx.fillRect(a-70,b-130,140,150)}ctx.globalCompositeOperation='source-over'}
 for(const it of items)if(it.type!='trash'&&Math.sin(t/180+it.ph)>.75){const[a,b]=P(it.x,it.y,12);ctx.fillStyle='#fff';ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText('✦',a+10,b-8)}
 for(const n of npcs){const[a,b]=P(n.x,n.y,n.obj.userData.h*39.2+8);if(!vis(a,b,60))continue;if(n.bt>0)bubble(a,b,n.bub);else{ctx.font='bold 12px sans-serif';const w=ctx.measureText(n.def.n).width+8;rr(a-w/2,b-16,w,17,6,'rgba(0,0,0,.45)');ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.def.n,a,b-7.5)}}
 {const[a,b]=P(player.x,player.y,player.obj.userData.h*39.2+8);ctx.font='bold 13px sans-serif';const w=ctx.measureText(S.name).width+10;if(pbt>0)bubble(a,b,pb);else{rr(a-w/2,b-18,w,18,6,'rgba(255,140,0,.85)');ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(S.name,a,b-9)}}
 for(const f of ft){const[a,b]=P(f.x,f.y,0);ctx.globalAlpha=Math.min(1,f.a);ctx.font='bold 17px sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#000';const y=b-70-(1.4-f.a)*30;ctx.strokeText(f.t,a,y);ctx.fillStyle='#ffeb3b';ctx.fillText(f.t,a,y);ctx.globalAlpha=1}
 if(jt){const[a,b]=P(jt.x,jt.y,0),bob=Math.sin(t/180)*6;if(a>30&&a<VW-30&&b>150&&b<VH-130){const y=b-70+bob;poly([[a-15,y-22],[a+15,y-22],[a,y]],'#ffeb3b');ctx.strokeStyle='#e65100';ctx.lineWidth=3;ctx.stroke()}
  else{const cx=VW/2,cy=VH/2,an=Math.atan2(b-cy,a-cx),c=Math.cos(an),s=Math.sin(an),k=Math.min((VW/2-45)/Math.abs(c||1e-6),(VH/2-130)/Math.abs(s||1e-6)),ex=cx+c*k,ey=cy+s*k;ctx.save();ctx.translate(ex,ey);ctx.rotate(an);poly([[22,0],[-14,-17],[-6,0],[-14,17]],'#ffeb3b');ctx.strokeStyle='#e65100';ctx.lineWidth=3;ctx.stroke();ctx.restore()}}
 if(joy){ctx.globalAlpha=.5;ell(joy.ox,joy.oy,55,55,'#ffffff');const l=Math.min(1,50/Math.max(1,Math.hypot(joy.dx,joy.dy)));ctx.globalAlpha=.85;ell(joy.ox+joy.dx*l,joy.oy+joy.dy*l,24,24,'#ffb74d');ctx.globalAlpha=1}}
let fpsA=[];
function loop(t){const dt=Math.min(.05,(t-last)/1000);fpsA.push(t-last);if(fpsA.length>120)fpsA.shift();last=t;update(dt);render(t,dt);requestAnimationFrame(loop)}
// ---------- start (6가지 캐릭터 고르기)
const TYPE_ORDER=['mc','mt','ma','fc','ft','fa'];
function setType(k){const d=M3.TYPES[k].def;S.type=k;S.top=d.top;S.pants=d.pants;S.hair=d.hair;if(!S.tops.includes(d.top))S.tops.push(d.top);if(!S.pantsOwn.includes(d.pants))S.pantsOwn.push(d.pants)}
function create(){if(!S.type)setType('fa');const sw=(list,cur,k)=>list.map(c=>`<span class="sw ${c==cur?'on':''}" style="background:${c}" onclick="S.name=$('nm').value;S.${k}='${c}';create()"></span>`).join('');
 const cards=TYPE_ORDER.map(k=>`<div class="tc ${S.type==k?'on':''}" onclick="S.name=$('nm').value;setType('${k}');create()"><canvas id="tc_${k}" width="92" height="112"></canvas><div>${M3.TYPES[k].n}</div></div>`).join('');
 openPanel(`<h3>🌼 도란도란 마을에 어서 오세요</h3><p style="margin:2px 0">어떤 주민이 될까요?</p><div class="tg">${cards}</div><p>이름</p><input id="nm" maxlength="8" placeholder="이름을 적어 주세요" value="${S.name}"><p>옷 색깔</p>${sw([M3.TYPES[S.type].def.top,...TC],S.top,'top')}<p>머리 색깔</p>${sw([...new Set([M3.TYPES[S.type].def.hair,...HC])],S.hair,'hair')}<button class="big" id="ok">마을로 나가기</button>`);
 TYPE_ORDER.forEach(k=>drawPreview('tc_'+k,k==S.type?myLook():M3.TYPES[k].def,k));
 $('ok').onclick=()=>{const n=$('nm').value.trim();if(!n){toast('이름을 꼭 적어 주세요');return}S.name=n;if(!S.tops.includes(S.top))S.tops.push(S.top);save();closePanel();daily()}}
syncPlayer();if(!S.name||!S.type)create();else daily();requestAnimationFrame(loop);
window.G={S,player,npcs,BLD,get items(){return items},get job(){return job},P,goTo,startJob,enter,spawnItem,get mode(){return MODE},say,rot,get yaw(){return yaw},zoom:z=>ZM=z,R3,fps:()=>{const a=fpsA.slice(-90);return 1000/(a.reduce((x,y)=>x+y,0)/a.length)}};
// Meshy 3D 모델 불러오기 (다 받으면 캐릭터를 바꿔 끼움)
M3.preload().then(()=>{for(const n of npcs){const o=n.obj,par=o.parent;par&&par.remove(o);M3.dispose(o);n.obj=M3.person(n.def.t,n.def);par&&par.add(n.obj)}pkey='';syncPlayer();for(const k in pvCache)delete pvCache[k];if(panelOpen()&&document.getElementById('tc_mc'))create();window.MESHY_READY=1});
