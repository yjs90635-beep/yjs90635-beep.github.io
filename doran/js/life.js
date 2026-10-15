// 도란도란 마을 - 생활 시스템 (자체 창작: 직업 순환·꾸미기·집·모임터·돗자리·퀴즈·꽃길 예식)
// ---------- 이름 (모두 새로 지은 것)
const CUR='방울';
const TNAME={mc:['콩이','남자 어린이'],mt:['하루','청소년 남자'],ma:['도현','성인 남자'],fc:['새봄','여자 어린이'],ft:['이나','청소년 여자'],fa:['윤슬','성인 여자']};
for(const k in TNAME)M3.TYPES[k].n=`${TNAME[k][0]}<br><small>${TNAME[k][1]}</small>`;
const today=()=>new Date().toLocaleDateString('ko-KR');
// ---------- 상태 기본값
(function(){const d={lv:{seed:0,bug:0,rock:0,tailor:0,cook:0,make:0,trade:0},gjob:'',pat:0,pats:[0],acc:{glass:'',bag:''},glassOwn:[''],bagOwn:[''],house:'apt',houses:['apt'],club:null,stall:{on:false,slots:[],t:Date.now(),earn:0,log:[]},spouse:'',kids:[],talkDay:{},ride:false,bike:false,quizWin:0,luxLeft:3};
 for(const k in d)if(S[k]===undefined)S[k]=d[k];for(const k in d.lv)if(S.lv[k]===undefined)S.lv[k]=0})();
// ---------- 물건
Object.assign(ITN,{seed:'들씨앗',berry:'산열매',cotton:'솜꽃',glow:'반딧톡',fly:'팔랑이',pebble:'조약돌',iron:'쇠돌',gem:'반짝돌',jam:'열매잼빵',porridge:'씨앗죽',tea:'들꽃차',cake:'산열매 케이크',ring:'꽃반지'});
const ICON={coin:'🪙',clover:'🍀',bottle:'🍾',flower:'🌼',acorn:'🌰',bread:'🍞',seed:'🌱',berry:'🍓',cotton:'☁️',glow:'✨',fly:'🦋',pebble:'🪨',iron:'⚙️',gem:'💎',jam:'🥯',porridge:'🥣',tea:'🍵',cake:'🍰',ring:'💍'};
const VAL={clover:20,bottle:5,flower:8,acorn:3,bread:10,seed:4,berry:6,cotton:7,glow:12,fly:16,pebble:5,iron:10,gem:30,jam:28,porridge:18,tea:22,cake:60,ring:90};
const FOOD={jam:'걸음이 1분 반 동안 빨라져요',porridge:'든든해서 좋아요 (+5 경험)',tea:'마음이 편해져요',cake:'모두가 좋아하는 선물이에요'};
const GJOB={seed:{n:'들풀지기',ic:'🌱',d:'들씨앗·산열매·솜꽃을 많이 주워요'},bug:{n:'반딧잡이',ic:'✨',d:'반딧톡·팔랑이를 잡아요 (이 일을 해야 잡혀요)'},rock:{n:'돌캐미',ic:'⛏️',d:'조약돌·쇠돌·반짝돌을 캐요 (이 일을 해야 캐져요)'}};
const CJOB={tailor:{n:'실바늘공',ic:'🧵',at:'실바늘 옷방'},cook:{n:'솥단지공',ic:'🍲',at:'솥단지 식당'},make:{n:'뚝딱공',ic:'🔨',at:'뚝딱 공방'},trade:{n:'돗자리상',ic:'🧺',at:'광장 돗자리'}};
const GROUP={seed:['seed','berry','cotton'],bug:['glow','fly'],rock:['pebble','iron','gem']};
const grpOf=t=>{for(const g in GROUP)if(GROUP[g].includes(t))return g;return''};
const lvOf=id=>Math.min(10,1+Math.floor((S.lv[id]||0)/5));
function addXp(id,n){const a=lvOf(id);S.lv[id]=(S.lv[id]||0)+(n||1);const b=lvOf(id);if(b>a)setTimeout(()=>toast(`⭐ ${(GJOB[id]||CJOB[id]).n} 레벨 ${b}!`),600)}
const has=(need)=>Object.keys(need).every(k=>(S.bag[k]||0)>=need[k]);
const needTxt=need=>Object.keys(need).map(k=>`${ICON[k]||''}${ITN[k]}×${need[k]} <small>(${S.bag[k]||0})</small>`).join(' ');
// 3D 모양 (작고 단순, 인스턴싱)
(function(){const P=M3.put,G=M3.G,L=[],mk=f=>{f();return M3.merge(L)};
 const geos={seed:()=>{for(let i=0;i<3;i++)P(L,G.sph,'#8d6e3c',(i-1)*.07,.05,(i%2)*.05,{sx:.05,sy:.04,sz:.05})},
 berry:()=>{for(let i=0;i<3;i++)P(L,G.sph,'#e53935',(i-1)*.08,.07,(i%2)*.06,{sx:.065,sy:.065,sz:.065});P(L,G.cone4,'#43a047',0,.15,0,{sx:.12,sy:.05,sz:.12})},
 cotton:()=>{P(L,G.cyl,'#558b2f',0,.12,0,{sx:.012,sy:.24,sz:.012});for(let i=0;i<4;i++){const a=i*1.57;P(L,G.sph,'#fafafa',Math.cos(a)*.05,.26,Math.sin(a)*.05,{sx:.07,sy:.06,sz:.07})}},
 glow:()=>{P(L,G.sph,'#fff176',0,.3,0,{sx:.07,sy:.06,sz:.09});P(L,G.sph,'#5d4037',0,.32,.07,{sx:.04,sy:.04,sz:.04});for(const s of[-1,1])P(L,G.sph,'#e3f2fd',s*.08,.35,0,{sx:.08,sy:.015,sz:.05})},
 fly:()=>{P(L,G.cyl,'#4e342e',0,.3,0,{rx:1.57,sx:.015,sy:.12,sz:.015});for(const s of[-1,1]){P(L,G.sph,'#ff7043',s*.09,.33,-.02,{sx:.09,sy:.012,sz:.08});P(L,G.sph,'#ffca28',s*.07,.31,.05,{sx:.06,sy:.012,sz:.05})}},
 pebble:()=>{P(L,G.ico,'#9e9e9e',0,.07,0,{sx:.13,sy:.08,sz:.11});P(L,G.ico,'#bdbdbd',.12,.04,.05,{sx:.06,sy:.04,sz:.06})},
 iron:()=>{P(L,G.ico,'#546e7a',0,.08,0,{sx:.14,sy:.1,sz:.12});P(L,G.ico,'#ff8f00',.05,.13,.05,{sx:.03,sy:.03,sz:.03})},
 gem:()=>{P(L,G.ico,'#78909c',0,.06,0,{sx:.12,sy:.07,sz:.1});P(L,G.cone4,'#4dd0e1',0,.16,0,{sx:.09,sy:.18,sz:.09});P(L,G.cone4,'#e040fb',.07,.12,.03,{sx:.05,sy:.1,sz:.05})}};
 for(const t in geos){const im=new THREE.InstancedMesh(mk(geos[t]),M3.VC,30);im.count=0;im.frustumCulled=false;scene.add(im);IM[t]=im}})();
// 줍기 확장
pickType=function(){const r=Math.random()*100,lb=lvOf('bug')>=2,lr=lvOf('rock')>=2,j=S.gjob;
 if(j&&Math.random()<.35){const g=GROUP[j];if(j=='bug')return lb&&Math.random()<.4?'fly':'glow';if(j=='rock')return lr&&Math.random()<.25?'gem':Math.random()<.45?'iron':'pebble';return g[Math.floor(Math.random()*3)]}
 return r<18?'coin':r<30?'flower':r<38?'acorn':r<46?'bottle':r<50?'clover':r<60?'seed':r<68?'berry':r<75?'cotton':r<83?'glow':r<87?'fly':r<93?'pebble':r<98?'iron':'gem'};
for(let k=0;k<10;k++){const p=randomSpot(22,18,22,16);if(p)spawnItem(pickType(),p[0]+.5,p[1]+.5)}
let needT=0;const _collect=collect;
collect=function(it){const g=grpOf(it.type);if(!g){_collect(it);return}
 if((g=='bug'||g=='rock')&&S.gjob!=g){if(needT<=0){needT=4;toast(`${GJOB[g].ic} ${GJOB[g].n} 일을 해야 ${g=='bug'?'잡을':'캘'} 수 있어요<br><small>들풀 수집소에서 일을 골라요</small>`)}return}
 items=items.filter(i=>i!==it);let n=1;if(S.gjob==g&&Math.random()<lvOf(g)*.08)n=2;S.bag[it.type]=(S.bag[it.type]||0)+n;fx(it,`+${ITN[it.type]}${n>1?' ×2':''}`);if(S.gjob==g)addXp(g);save()};
const _iu=itemUpdate;
itemUpdate=function(dt){needT-=dt;for(const it of items)if(it.type=='glow'||it.type=='fly'){it.vt=(it.vt||0)-dt;if(it.vt<=0){it.vt=1+Math.random()*2;it.vx=(Math.random()-.5)*.8;it.vy=(Math.random()-.5)*.8}const nx=it.x+it.vx*dt,ny=it.y+it.vy*dt;if(walk(Math.floor(nx),Math.floor(ny))){it.x=nx;it.y=ny}}
 _iu(dt);if(S.gjob){const r=.6+lvOf(S.gjob)*.12;for(const it of items.slice())if(grpOf(it.type)==S.gjob&&Math.hypot(it.x-player.x,it.y-player.y)<r)collect(it)}};
// ---------- 꾸미기 (색·무늬 + 작은 소품)
const PATS=[[0,'무늬 없음'],[1,'줄무늬'],[2,'물방울'],[3,'체크'],[4,'반짝이']];
const GLASS=[['','안경 없음',0],['round','동글 안경',70],['sun','까만 선글라스',90]];
const BAGS=[['','가방 없음',0],['pack','작은 배낭',80],['cross','꽃 크로스백',100]];
myLook=function(){return{top:S.top,pants:S.pants,hair:S.hair,hat:S.hat,pat:S.pat,glass:S.acc.glass,bag:S.acc.bag}};
const ACCM=new THREE.MeshLambertMaterial({vertexColors:true}),accGeo={},headInfo={};
const HK={mc:.27,fc:.28,mt:.15,ft:.15,ma:.14,fa:.14};
function head(type,g){if(headInfo[type])return headInfo[type];const P=g.attributes.position.array,H=M3.TYPES[type].H,hh=H*HK[type],eyeY=H-hh*.48,by=H*(type[1]=='c'?.56:.66);let r=0,fz=-9,bz=9;
 for(let i=0;i<P.length;i+=3){const x=P[i],y=P[i+1],z=P[i+2];if(Math.abs(y-(H-hh*.42))<hh*.08)r=Math.max(r,Math.abs(x));if(Math.abs(y-eyeY)<hh*.06&&Math.abs(x)<hh*.2)fz=Math.max(fz,z);if(Math.abs(y-by)<H*.03&&Math.abs(x)<H*.05)bz=Math.min(bz,z)}
 return headInfo[type]={r,neck:H-hh,hh,eyeY,faceZ:fz,backZ:bz,bagY:by}}
function aGeo(k){if(accGeo[k])return accGeo[k];const P=M3.put,G=M3.G,L=[];
 if(k=='cap'){P(L,G.sph,'#d32f2f',0,0,0,{sy:.55});P(L,G.cyl12,'#c62828',0,.02,.75,{sx:.6,sy:.05,sz:.5})}
 if(k=='beanie'){P(L,G.sph,'#3949ab',0,0,0,{sy:.75});P(L,G.cyl12,'#5c6bc0',0,-.05,0,{sx:1.03,sy:.25,sz:1.03});P(L,G.sph,'#fff',0,.75,0,{sx:.22,sy:.22,sz:.22})}
 if(k=='straw'){P(L,G.cyl12,'#e2b866',0,0,0,{sx:1.7,sy:.05,sz:1.7});P(L,G.cyl12,'#e2b866',0,.25,0,{sx:.95,sy:.5,sz:.95});P(L,G.cyl12,'#c62828',0,.1,0,{sx:.97,sy:.12,sz:.97})}
 if(k=='ribbon'){for(const s of[-1,1])P(L,G.cone4,'#ec407a',s*.35,.1,0,{sx:.35,sy:.6,sz:.3,rz:s*1.57});P(L,G.sph,'#ad1457',0,.1,0,{sx:.16,sy:.16,sz:.16})}
 if(k=='crown'){P(L,G.cyl12,'#ffd54f',0,.05,0,{sx:.6,sy:.25,sz:.6});for(let i=0;i<6;i++){const a=i/6*6.283;P(L,G.cone4,'#ffca28',Math.sin(a)*.55,.3,Math.cos(a)*.55,{sx:.16,sy:.3,sz:.16})}P(L,G.sph,'#e91e63',0,.05,.6,{sx:.08,sy:.08,sz:.05})}
 if(k=='round'||k=='sun'){const c=k=='sun'?'#111':'#5d4037',ln=k=='sun'?'#263238':'#e3f2fd';for(const s of[-1,1]){P(L,G.cyl12,c,s*.32,0,0,{rx:1.57,sx:.27,sy:.05,sz:.27});P(L,G.cyl12,ln,s*.32,0,.012,{rx:1.57,sx:.22,sy:.05,sz:.22})}P(L,G.box,c,0,.03,0,{sx:.2,sy:.05,sz:.05})}
 if(k=='pack'){M3.bx(L,'#ef6c00',0,0,0,.9,1,.45);M3.bx(L,'#ffb74d',0,-.2,-.25,.7,.4,.12)}
 if(k=='cross'){M3.bx(L,'#f8bbd0',0,0,0,.8,.6,.3);P(L,G.sph,'#e91e63',0,.05,-.17,{sx:.12,sy:.12,sz:.05})}
 return accGeo[k]=M3.merge(L)}
const _person=M3.person;
M3.person=function(type,look){const r=_person(type,look);const U=r.userData;if(!U.meshy||!look)return r;const hi=head(type,U.meshes[0].geometry),b=U.body,add=(k,x,y,z,s,ry)=>{const m=new THREE.Mesh(aGeo(k),ACCM);m.position.set(x,y,z);m.scale.setScalar(s);if(ry)m.rotation.y=ry;m.userData.acc=1;b.add(m)};
 if(look.hat){if(look.hat=='ribbon')add('ribbon',hi.r*.55,M3.TYPES[type].H-hi.hh*.12,-hi.r*.2,hi.r*.7);else add(look.hat,0,M3.TYPES[type].H-hi.hh*(look.hat=='straw'?.12:look.hat=='crown'?.04:type[1]=='c'?.17:.3),0,hi.r*(look.hat=='crown'?.75:1.0))}
 if(look.glass)add(look.glass,0,hi.eyeY,hi.faceZ+.004,hi.hh*.28);
 if(look.bag)add(look.bag,0,hi.bagY,hi.backZ-.02,M3.TYPES[type].H*.13,look.bag=='cross'?.0:0);
 return r};
const _disp=M3.dispose;M3.dispose=function(p){_disp(p)};
personSnap=function(type,look,w,h){const k=type+JSON.stringify(look)+w+'x'+h;if(pvCache[k])return pvCache[k];const p=M3.person(type,look);const c=snap(p,w,h,FRONT,.78);M3.dispose(p);if(Object.keys(pvCache).length>30)for(const q in pvCache)delete pvCache[q];return pvCache[k]=c};
const BIKE=(()=>{const L=[],P=M3.put,G=M3.G;for(const z of[-.32,.32])P(L,G.cyl12,'#263238',0,.15,z,{rz:1.57,sx:.15,sy:.03,sz:.15});M3.bx(L,'#29b6f6',0,.22,0,.04,.04,.6);M3.bx(L,'#29b6f6',0,.32,.25,.04,.25,.04);M3.bx(L,'#fff',0,.42,.25,.3,.03,.03);return M3.merge(L)})();
syncPlayer=function(){const k=S.type+JSON.stringify(myLook())+S.ride;if(k==pkey&&player.obj)return;pkey=k;let par=scene;if(player.obj){par=player.obj.parent||scene;par.remove(player.obj);M3.dispose(player.obj)}
 player.obj=M3.person(S.type||'fa',myLook());player.obj.userData.xrays=[];for(const m of player.obj.userData.meshes){const x=new THREE.Mesh(m.geometry,XRAY);x.renderOrder=2;x.visible=false;m.add(x);player.obj.userData.xrays.push(x)}
 if(S.ride){const bm=new THREE.Mesh(BIKE,ACCM);player.obj.add(bm)}par.add(player.obj)};
pkey='';
// ---------- 옷방 (가게 + 실바늘공 제작)
const SPECIAL_TOPS=[['#ff8a65','노을빛 윗옷'],['#283593','밤하늘 윗옷'],['#80cbc4','민트 윗옷']];
let shopTab='buy';
shopClothes=function(){const T=M3.TYPES[S.type||'fa'].def;let h=`<h3>🧵 실바늘 옷방</h3><canvas id="pv" width="130" height="150" style="display:block;margin:auto;background:#fff3e0;border-radius:14px"></canvas>
 <div style="display:flex;gap:6px;margin:8px 0"><button style="flex:1;${shopTab=='buy'?'background:#ff7043;color:#fff':''}" onclick="shopTab='buy';shopClothes()">🛍️ 사기·입기</button><button style="flex:1;${shopTab=='make'?'background:#ff7043;color:#fff':''}" onclick="shopTab='make';shopClothes()">🧵 직접 만들기</button></div>`;
 const row=(t,list,own,cur)=>list.map(([id,n,p])=>{const o=own.includes(id);return`<div class="row"><span>${t=='top'||t=='pants'?`<span class="sw" style="background:${id};vertical-align:middle;width:30px;height:30px"></span>`:''}${n}</span><button onclick="buyC('${t}','${id}',${p})">${o?(cur==id?'착용 중':'입기'):p+CUR}</button></div>`}).join('');
 if(shopTab=='buy'){const sp=SPECIAL_TOPS.filter(x=>S.tops.includes(x[0])).map(x=>[x[0],x[1]+' ⭐',0]);
  h+=`<p><small>가게에선 기본 옷만 팔아요. 무늬 옷과 특별한 색은 '직접 만들기'로 만들어요.</small></p><h4>윗옷</h4>${row('top',[[T.top,'기본 윗옷',0],...TOPS.slice(0,4),...sp],S.tops,S.top)}<h4>아래옷</h4>${row('pants',[[T.pants,'기본 아래옷',0],...PANTS],S.pantsOwn,S.pants)}
  <h4>무늬 <small>(만든 것만)</small></h4>${PATS.filter(p=>S.pats.includes(p[0])).map(p=>`<button style="margin:3px;${S.pat==p[0]?'background:#ff7043;color:#fff':''}" onclick="S.pat=${p[0]};save();reShop()">${p[1]}</button>`).join('')}
  <h4>모자</h4>${row('hat',HATS.filter(x=>x[0]!='crown'||S.hats.includes('crown')),S.hats,S.hat)}<h4>안경</h4>${row('glass',GLASS,S.glassOwn,S.acc.glass)}<h4>가방</h4>${row('bag',BAGS,S.bagOwn,S.acc.bag)}`}
 else h+=craftList('tailor');
 openPanel(h+CLOSE);drawPreview('pv',myLook())};
function reShop(){const sc=$('panel').scrollTop;shopClothes();$('panel').scrollTop=sc}
buyC=function(t,id,p){const own={top:S.tops,pants:S.pantsOwn,hat:S.hats,glass:S.glassOwn,bag:S.bagOwn}[t];if(!own.includes(id)){if(S.money<p){toast(`${CUR}이 조금 모자라요.<br>일을 하거나 주운 걸 팔아 보세요!`);return}S.money-=p;own.push(id)}if(t=='glass'||t=='bag')S.acc[t]=id;else S[t]=id;save();reShop()};
// ---------- 제작 (0~100% 게이지)
const RCP={
 tailor:[{id:'p1',n:'줄무늬 옷본',need:{cotton:3},out:{pat:1},lv:1},{id:'p2',n:'물방울 옷본',need:{cotton:3,berry:2},out:{pat:2},lv:1},{id:'t1',n:'노을빛 윗옷',need:{cotton:2,berry:3},out:{top:'#ff8a65'},lv:1},{id:'t2',n:'밤하늘 윗옷',need:{cotton:3,glow:1},out:{top:'#283593'},lv:2},{id:'p3',n:'체크 옷본',need:{cotton:4,fly:1},out:{pat:3},lv:2},{id:'t3',n:'민트 윗옷',need:{cotton:3,seed:3},out:{top:'#80cbc4'},lv:2},{id:'p4',n:'반짝이 옷본',need:{cotton:4,gem:1},out:{pat:4},lv:3},{id:'cr',n:'작은 왕관',need:{gem:2,iron:2},out:{hat:'crown'},lv:3}],
 cook:[{id:'porridge',n:'씨앗죽',need:{seed:3},out:{item:'porridge'},lv:1},{id:'jam',n:'열매잼빵',need:{berry:2,seed:1},out:{item:'jam'},lv:1},{id:'tea',n:'들꽃차',need:{flower:2},out:{item:'tea'},lv:1},{id:'cake',n:'산열매 케이크',need:{berry:4,acorn:2,cotton:1},out:{item:'cake'},lv:2}],
 make:[{id:'chair',n:'원목 의자',need:{acorn:3,pebble:1},out:{furn:'chair'},lv:1},{id:'lamp',n:'반딧 스탠드',need:{iron:2,glow:1},out:{furn:'lamp'},lv:1},{id:'shelf',n:'튼튼 책장',need:{acorn:4,iron:2},out:{furn:'shelf'},lv:2},{id:'tv',n:'네모 텔레비전',need:{iron:3,gem:1},out:{furn:'tv'},lv:2},{id:'piano',n:'꿈결 피아노',need:{iron:4,gem:2},out:{furn:'piano'},lv:3},{id:'ring',n:'꽃반지 (예식용)',need:{gem:1,flower:1},out:{item:'ring'},lv:1},{id:'bike',n:'씽씽 자전거',need:{iron:5,pebble:2},out:{bike:1},lv:2}]};
function craftList(j){const L=lvOf(j);let h=`<p>${CJOB[j].ic} <b>${CJOB[j].n}</b> 레벨 ${L} <small>(만들수록 빨라지고 새 물건이 열려요)</small></p>`;
 for(const r of RCP[j]){const lock=r.lv>L,ok=has(r.need)&&!lock;h+=`<div class="row"><span><b>${r.n}</b>${lock?` <small>🔒 레벨 ${r.lv}</small>`:''}<br><small>${needTxt(r.need)}</small></span><button class="${ok?'':'gray'}" onclick="craft('${j}','${r.id}')">만들기</button></div>`}return h}
let cr=null;
function craft(j,id){const r=RCP[j].find(x=>x.id==id);if(r.lv>lvOf(j)){toast(`레벨 ${r.lv}이 되면 만들 수 있어요`);return}if(!has(r.need)){toast('재료가 모자라요.<br>길에서 주워 오세요!');return}
 for(const k in r.need)S.bag[k]-=r.need[k];save();cr={j,r,p:0};
 openPanel(`<h3>${CJOB[j].ic} ${r.n} 만드는 중</h3><div style="background:#eee;border-radius:14px;height:34px;overflow:hidden;border:2px solid #ffb300"><div id="gb" style="height:100%;width:0;background:linear-gradient(90deg,#ffca28,#ff7043);transition:width .1s"></div></div><p id="gp" style="text-align:center;font-size:28px;font-weight:bold;margin:8px">0%</p><button class="big" id="gpush" style="font-size:24px;padding:20px">${j=='tailor'?'🪡 바느질!':j=='cook'?'🥄 휘휘 젓기!':'🔨 뚝딱!'} <small>(누르면 빨라져요)</small></button>`,()=>{if(cr&&cr.p<100){for(const k in r.need)S.bag[k]+=r.need[k];save();toast('만들기를 멈추고 재료를 돌려받았어요')}cr=null;clearInterval(cr_t)});
 $('gpush').onclick=()=>{if(cr)cr.p+=7};clearInterval(cr_t);cr_t=setInterval(craftTick,100)}
let cr_t=0;
function craftTick(){if(!cr){clearInterval(cr_t);return}cr.p=Math.min(100,cr.p+.9+lvOf(cr.j)*.25);const b=$('gb'),q=$('gp');if(b)b.style.width=cr.p+'%';if(q)q.textContent=Math.floor(cr.p)+'%';if(cr.p>=100){clearInterval(cr_t);const{j,r}=cr;cr.p=100;const o=r.out;let msg='';
 if(o.pat){if(!S.pats.includes(o.pat))S.pats.push(o.pat);S.pat=o.pat;msg=`${r.n}이 생겼어요! 바로 입었어요`}if(o.top){if(!S.tops.includes(o.top))S.tops.push(o.top);S.top=o.top;msg=`${r.n}을 입었어요`}if(o.hat){if(!S.hats.includes(o.hat))S.hats.push(o.hat);S.hat=o.hat;msg='반짝이는 작은 왕관을 썼어요!'}
 if(o.item){S.bag[o.item]=(S.bag[o.item]||0)+1;msg=`${ICON[o.item]} ${ITN[o.item]}을 가방에 넣었어요`}if(o.furn){S.furn.push(o.furn);msg=`${r.n}을 만들었어요! 집에서 놓아 보세요`}if(o.bike){S.bike=true;msg='🚲 씽씽 자전거 완성! 메뉴에서 탈 수 있어요'}
 addXp(j,2);save();cr=null;$('panel').querySelector('h3').textContent='🎉 완성!';const gb=$('gpush');gb.textContent='좋아요';gb.onclick=()=>{curB?enter(curB):closePanel()};toast(msg)}}
// ---------- 가게·건물
let furnTab='buy';const CRAFT_ONLY=['lamp','shelf','tv','piano'];
shopFurn=function(){let h=`<h3>🔨 뚝딱 공방</h3><div style="display:flex;gap:6px;margin:8px 0"><button style="flex:1;${furnTab=='buy'?'background:#ff7043;color:#fff':''}" onclick="furnTab='buy';shopFurn()">🛍️ 가구 사기</button><button style="flex:1;${furnTab=='make'?'background:#ff7043;color:#fff':''}" onclick="furnTab='make';shopFurn()">🔨 직접 만들기</button></div>`;
 if(furnTab=='buy'){h+='<p><small>스탠드·책장·텔레비전·피아노는 뚝딱공이 만들어야 해요.</small></p>';for(const id in FURN){if(CRAFT_ONLY.includes(id))continue;const f=FURN[id],n=S.furn.filter(v=>v==id).length+S.room.filter(v=>v==id).length;h+=`<div class="row"><span>${furnCanvas(id)} ${f.n}<br><small>가진 개수 ${n}</small></span><button onclick="buyF('${id}')">${f.p}${CUR}</button></div>`}}
 else h+=craftList('make');openPanel(h+CLOSE);drawFurnCanvases()};
const _enter=enter;
enter=function(b){curB=b;player.path=[];const k=b.kind;
 if(k=='flower'){let h=`<h3>🌱 들풀 수집소</h3><p>수집소 주인: "길에서 주운 건 뭐든 사요. 1차 직업도 여기서 골라요!"</p><h4>줍는 직업 고르기</h4>`;
  for(const g in GJOB)h+=`<div class="row"><span>${GJOB[g].ic} <b>${GJOB[g].n}</b> 레벨 ${lvOf(g)}<br><small>${GJOB[g].d}</small></span><button ${S.gjob==g?'class="gray"':''} onclick="S.gjob='${S.gjob==g?'':g}';save();enter(curB)">${S.gjob==g?'그만두기':'일하기'}</button></div>`;
  h+='<h4>팔기</h4>'+sellAll(['seed','berry','cotton','glow','fly','pebble','iron','gem','flower','clover','acorn']);openPanel(h+CLOSE);return}
 if(k=='bakery'){openPanel(`<h3>🍲 솥단지 식당</h3><p>주방장: "재료를 가져오면 같이 요리해요. 배달도 부탁해요!"</p>${craftList('cook')}${jobBox('bake')}<div class="row"><span>🍞 갓 구운 빵</span><button onclick="buyBread()">12${CUR}</button></div><h4>음식 팔기</h4>${sellAll(['porridge','jam','tea','cake'])}`+CLOSE);return}
 if(k=='post'){hallUI();return}
 _enter(b)};
function sellAll(ts){const r=ts.filter(t=>S.bag[t]>0);if(!r.length)return'<p><small>팔 물건이 아직 없어요.</small></p>';return r.map(t=>`<div class="row"><span>${ICON[t]} ${ITN[t]} ×${S.bag[t]}<br><small>개당 ${VAL[t]}${CUR}</small></span><button onclick="sellV('${t}')">모두 팔기</button></div>`).join('')}
function sellV(t){const n=S.bag[t]||0;if(!n)return;S.money+=n*VAL[t];S.bag[t]=0;save();toast(`${ITN[t]} ${n}개를 ${n*VAL[t]}${CUR}에 팔았어요`);const sc=$('panel').scrollTop;enter(curB);$('panel').scrollTop=sc}
// 가방 (먹기)
$('bagb').onclick=bagUI;
function bagUI(){let h='<h3>🎒 가방</h3>';const ks=Object.keys(S.bag).filter(k=>S.bag[k]>0);if(!ks.length)h+='<p>비어 있어요. 길에서 반짝이는 물건을 주워 보세요!</p>';
 ks.forEach(k=>h+=`<div class="row"><span>${ICON[k]||''} ${ITN[k]} <b>×${S.bag[k]}</b>${FOOD[k]?`<br><small>${FOOD[k]}</small>`:''}</span>${FOOD[k]||k=='bread'?`<button onclick="eat('${k}')">먹기</button>`:''}</div>`);
 openPanel(h+'<p><small>주운 건 들풀 수집소, 음식은 솥단지 식당에서 팔아요. 돗자리에 올려 두면 자리를 비워도 팔려요.</small></p>'+CLOSE)}
function eat(k){S.bag[k]--;if(k=='jam')boost=90;else if(k=='porridge')addXp(S.gjob||'cook',5);else boost=Math.max(boost,30);save();toast(`${ICON[k]} 냠냠! ${FOOD[k]||'맛있어요'}`);bagUI()}
// ---------- 직업 수첩
$('jobb').onclick=()=>{let h='<h3>📒 직업 수첩</h3><p><small>줍기 → 만들기 → 팔기 가 이어져요. 재료를 모아 물건을 만들고, 돗자리에서 팔아요.</small></p><h4>1. 줍는 일 (하나만)</h4>';
 for(const g in GJOB)h+=`<div class="row"><span>${GJOB[g].ic} <b>${GJOB[g].n}</b> 레벨 ${lvOf(g)} ${S.gjob==g?'✅':''}<br><small>${GJOB[g].d}</small></span></div>`;
 h+='<h4>2. 만드는 일 · 3. 파는 일</h4>';for(const c in CJOB)h+=`<div class="row"><span>${CJOB[c].ic} <b>${CJOB[c].n}</b> 레벨 ${lvOf(c)}<br><small>${CJOB[c].at}</small></span></div>`;
 h+='<h4>동네 알바</h4>';for(const id in JOBS){const J=JOBS[id];h+=`<div class="row"><span>${J.ic} <b>${J.n}</b> 레벨 ${lvl(id)}<br><small>${J.at} · ${J.desc}</small></span><span>${payOf(id)}${CUR}</span></div>`}
 if(job)h+=`<button class="big gray" onclick="job=null;items=items.filter(i=>i.type!='trash');closePanel()">지금 하는 알바 그만두기</button>`;openPanel(h+CLOSE)};
// ---------- 돗자리 (자리를 비워도 팔림)
const STALL={x:11.5,y:28.6},BUYERS=['박 할머니','민수','하늘이','김 반장님','소라 누나','도윤 할아버지','지나가던 손님','옆 마을 손님'];
const stallMax=()=>Math.min(5,3+Math.floor((lvOf('trade')-1)/3));
function stallSim(sec){const st=S.stall;if(!st.on)return 0;let sold=0;sec=Math.min(sec,8*3600);
 for(const sl of st.slots){if(sl.n<=0)continue;const rate=(1/45)*Math.pow(VAL[sl.it]/sl.price,2)*(1+.08*lvOf('trade'));let k=Math.floor(sec*rate+Math.random());k=Math.min(k,sl.n);if(k>0){sl.n-=k;st.earn+=k*sl.price;sold+=k;for(let i=0;i<k;i++)S.lv.trade++;st.log.unshift(`${pick(BUYERS)}이(가) ${ITN[sl.it]} ${k}개를 샀어요`);st.log.length=Math.min(st.log.length,6)}}
 st.slots=st.slots.filter(s=>s.n>0);st.t=Date.now();return sold}
{const away=(Date.now()-(S.stall.t||Date.now()))/1000;const n=stallSim(away);if(n>0)setTimeout(()=>toast(`🧺 자리를 비운 동안 돗자리에서 ${n}개가 팔렸어요!`),2600)}
setInterval(()=>{const n=stallSim(5);if(n)toast(`🧺 ${S.stall.log[0]}`);save()},5000);
function stallUI(){const st=S.stall,L=lvOf('trade');let h=`<h3>🧺 내 돗자리 <small>· 돗자리상 레벨 ${L}</small></h3>`;
 if(!st.on)h+=`<p>광장에 돗자리를 깔면 내가 없어도 물건이 팔려요.</p><button class="big" onclick="S.stall.on=true;S.stall.t=Date.now();save();stallUI();stallMesh()">🧺 돗자리 깔기</button>`;
 else{h+=`<div class="row"><span>💰 모인 돈 <b>${st.earn}${CUR}</b></span><button onclick="S.money+=S.stall.earn;S.stall.earn=0;save();stallUI()">받기</button></div><h4>올려 둔 물건 (${st.slots.length}/${stallMax()})</h4>`;
  st.slots.forEach((s,i)=>h+=`<div class="row"><span>${ICON[s.it]} ${ITN[s.it]} ×${s.n}<br><small>${s.price}${CUR}씩</small></span><button class="gray" onclick="unStall(${i})">내리기</button></div>`);
  if(st.slots.length<stallMax()){const can=Object.keys(S.bag).filter(k=>S.bag[k]>0&&VAL[k]);h+='<h4>올릴 물건 고르기</h4>'+(can.length?can.map(k=>`<div class="row"><span>${ICON[k]} ${ITN[k]} ×${S.bag[k]}<br><small>보통 ${VAL[k]}${CUR}</small></span><span><button onclick="putStall('${k}',1)">${VAL[k]}</button> <button onclick="putStall('${k}',1.5)">${Math.round(VAL[k]*1.5)}</button></span></div>`).join(''):'<p><small>가방이 비었어요.</small></p>')+'<p><small>비싸게 올리면 천천히 팔려요.</small></p>'}
  if(st.log.length)h+='<h4>판매 기록</h4><small>'+st.log.join('<br>')+'</small>';h+=`<button class="big gray" onclick="foldStall()">돗자리 걷기</button>`}
 openPanel(h+CLOSE)}
function putStall(k,m){const n=S.bag[k];S.bag[k]=0;S.stall.slots.push({it:k,n,price:Math.round(VAL[k]*m)});S.stall.t=Date.now();save();stallUI();stallMesh();toast(`${ITN[k]} ${n}개를 올렸어요`)}
function unStall(i){const s=S.stall.slots.splice(i,1)[0];S.bag[s.it]=(S.bag[s.it]||0)+s.n;save();stallUI();stallMesh()}
function foldStall(){S.stall.slots.forEach(s=>S.bag[s.it]=(S.bag[s.it]||0)+s.n);S.stall.slots=[];S.money+=S.stall.earn;S.stall.earn=0;S.stall.on=false;save();stallMesh();closePanel();toast('돗자리를 걷었어요')}
const stallG=new THREE.Group();scene.add(stallG);
function stallMesh(){while(stallG.children.length)stallG.remove(stallG.children[0]);if(!S.stall.on)return;const L=[];M3.bx(L,'#e57373',0,.01,0,1.3,.02,.95);for(let i=0;i<4;i++)M3.bx(L,'#fff59d',-.5+i*.33,.022,0,.12,.005,.95);
 S.stall.slots.forEach((s,i)=>M3.put(L,M3.G.box,['#ffb74d','#81c784','#64b5f6','#ba68c8','#f06292'][i],-.45+i*.23,.08,-.15+(i%2)*.3,{sx:.16,sy:.12,sz:.16}));M3.bx(L,'#8d6e63',.55,.25,-.4,.04,.5,.04);M3.bx(L,'#fff',.55,.48,-.4,.4,.2,.03);
 const m=new THREE.Mesh(M3.merge(L),M3.VC);m.receiveShadow=true;stallG.add(m);stallG.position.set(STALL.x,0,STALL.y)}
stallMesh();
// ---------- 집 (원룸 / 가족방 / 한정 저택) + 모임터
const HOUSES={apt:{n:'콩알 원룸',d:'혼자 사는 작은 방 (4×4칸)',p:0},fam:{n:'한지붕 가족방',d:'가족이 함께 쓰는 넓은 방 (6×6칸)',p:600},lux:{n:'별빛언덕 저택',d:'마을에 8채뿐인 귀한 집 (6×6칸 + 샹들리에)',p:2500}};
let RK='home';
function ROOM(){return RK=='club'?S.club.room:S.room}
function cellOK(x,y){return RK=='club'||S.house!='apt'||(x<4&&y<4)}
function roomTitle(){return RK=='club'?`🎪 모임터 「${S.club.name}」`:`🏠 ${S.name}의 ${HOUSES[S.house].n}`}
function roomBtns(){return RK=='club'?`<button class="big" style="background:#aed581" onclick="clubBox()">📦 함께 쓰는 창고</button>`:`<button class="big" style="background:#90caf9" onclick="houseUI()">🏡 집 바꾸기</button>`}
function houseUI(){let h='<h3>🏡 집 고르기</h3>';for(const k in HOUSES){const H=HOUSES[k],o=S.houses.includes(k),lux=k=='lux';const price=k=='fam'&&S.spouse?0:H.p;
  h+=`<div class="row"><span><b>${H.n}</b>${lux?` <small>· 남은 집 ${S.luxLeft}/8</small>`:''}<br><small>${H.d}${k=='fam'&&S.spouse?' · 결혼해서 무료!':''}</small></span><button onclick="pickHouse('${k}',${price})">${S.house==k?'사는 중':o?'이사':price+CUR}</button></div>`}
 openPanel(h+`<button class="big gray" onclick="roomUI()">돌아가기</button>`)}
function pickHouse(k,p){if(!S.houses.includes(k)){if(k=='lux'&&S.luxLeft<=0){toast('저택이 모두 팔렸어요');return}if(S.money<p){toast(`${CUR}이 모자라요`);return}S.money-=p;S.houses.push(k);if(k=='lux')S.luxLeft--}
 if(k=='apt')S.room.forEach((f,i)=>{if(f&&!((i%6)<4&&((i/6)|0)<4)){S.furn.push(f);S.room[i]=''}});S.house=k;save();toast(`${HOUSES[k].n}(으)로 이사했어요!`);roomUI()}
const roomX=new THREE.Group();roomScene.add(roomX);const blockM=new THREE.MeshBasicMaterial({color:0x111111,transparent:true,opacity:.55}),plG=new THREE.PlaneGeometry(1,1);
const CHAND=(()=>{const L=[],P=M3.put,G=M3.G;P(L,G.cyl,'#bfa04a',0,2.9,0,{sx:.02,sy:.5,sz:.02});P(L,G.cyl12,'#ffd54f',0,2.6,0,{sx:.5,sy:.06,sz:.5});for(let i=0;i<6;i++){const a=i*1.047;P(L,G.sph,'#fff8e1',Math.cos(a)*.45,2.68,Math.sin(a)*.45,{sx:.07,sy:.1,sz:.07})}return M3.merge(L)})();
function roomExtra(){while(roomX.children.length)roomX.remove(roomX.children[0]);roomScene.background.set(RK=='club'?0x1e2a3a:S.house=='lux'?0x3a2a10:S.house=='fam'?0x23302a:0x2a1e16);
 for(let y=0;y<6;y++)for(let x=0;x<6;x++)if(!cellOK(x,y)){const m=new THREE.Mesh(plG,blockM);m.rotation.x=-Math.PI/2;m.position.set(x+.5,.02,y+.5);roomX.add(m)}
 if(RK!='club'&&S.house=='lux'){const c=new THREE.Mesh(CHAND,M3.VC);c.position.set(3,0,3);roomX.add(c)}
 if(RK=='club'||S.house!='apt'){const fam=RK=='club'?S.club.members:[S.spouse,...S.kids].filter(Boolean);fam.slice(0,3).forEach((nm,i)=>{const n=npcs.find(q=>q.def.n==nm);if(!n)return;const o=M3.person(n.def.t,n.def);o.position.set(4.5-i*1.0,0,4.6);o.rotation.y=-.4;roomX.add(o);o.userData.np=1})}}
const _lr2=leaveRoom;leaveRoom=function(){const c=RK=='club';roomX.children.filter(o=>o.userData.np).forEach(o=>M3.dispose(o));_lr2();if(c){const b=BLD.find(b=>b.kind=='post');player.x=b.door.x+.5;player.y=b.door.y+.5}RK='home'};
const _enterRoom=enterRoom;enterRoom=function(){if(curB&&curB.kind=='home')RK='home';_enterRoom()};
// 모임터 (마을회관)
function clubCreate(){const v=($('cn')||{}).value;const nm=(v||'').trim();if(!nm){toast('모임터 이름을 적어 주세요');return}if(S.money<200){toast(`200${CUR}이 필요해요`);return}S.money-=200;S.club={name:nm,room:Array(36).fill(''),box:{},members:[],day:''};clubJoin();save();hallUI();toast(`🎪 모임터 「${nm}」를 열었어요!`)}
function clubJoin(){for(const n of npcs)if((S.friend[n.def.n]||0)>=2&&!S.club.members.includes(n.def.n))S.club.members.push(n.def.n)}
function clubEnter(){clubJoin();const c=S.club,d=today();if(c.day!=d&&c.members.length){c.day=d;const gifts=[];c.members.forEach(m=>{const t=pick(['seed','berry','cotton','pebble','flower','acorn']);c.box[t]=(c.box[t]||0)+1;gifts.push(`${m}: ${ITN[t]}`)});setTimeout(()=>toast('📦 친구들이 창고에 물건을 두고 갔어요<br><small>'+gifts.slice(0,3).join(', ')+'</small>'),500)}save();RK='club';closePanel();MODE='room';$('btns').style.display='none';roomUI()}
function clubBox(){const c=S.club;let h=`<h3>📦 함께 쓰는 창고</h3><p><small>모임터 친구들과 같이 쓰는 창고예요. 넣고 꺼낼 수 있어요.</small></p><h4>창고에 있는 것</h4>`;
 const bk=Object.keys(c.box).filter(k=>c.box[k]>0);h+=bk.length?bk.map(k=>`<div class="row"><span>${ICON[k]} ${ITN[k]} ×${c.box[k]}</span><button onclick="boxMove('${k}',-1)">꺼내기</button></div>`).join(''):'<p><small>비었어요</small></p>';
 const mk=Object.keys(S.bag).filter(k=>S.bag[k]>0);h+='<h4>내 가방</h4>'+(mk.length?mk.map(k=>`<div class="row"><span>${ICON[k]||''} ${ITN[k]} ×${S.bag[k]}</span><button onclick="boxMove('${k}',1)">넣기</button></div>`).join(''):'<p><small>비었어요</small></p>');
 h+=`<p><small>회원: ${c.members.join(', ')||'아직 없어요 (하트 2개 이상 친구가 들어와요)'}</small></p>`;openPanel(h+`<button class="big gray" onclick="roomUI()">돌아가기</button>`)}
function boxMove(k,d){const c=S.club,from=d>0?S.bag:c.box,to=d>0?c.box:S.bag;if(!(from[k]>0))return;from[k]--;to[k]=(to[k]||0)+1;save();const sc=$('panel').scrollTop;clubBox();$('panel').scrollTop=sc}
// ---------- 마을회관: 알바·퀴즈·예식·가족·모임터
function hallUI(){let h=`<h3>🏛️ 마을회관</h3><p>회관 직원: "마을 행사와 모임은 다 여기서 해요!"</p>
 <button class="big" style="background:#fff176" onclick="quizStart()">⭕❌ 맞다틀리다 한마당 (OX 퀴즈)</button>
 <button class="big" style="background:#f8bbd0" onclick="friendsUI()">👪 친구·가족 (결혼·입양)</button>`;
 h+=S.club?`<button class="big" style="background:#aed581" onclick="clubEnter()">🎪 모임터 「${S.club.name}」 들어가기</button>`:`<div class="row" style="display:block"><b>🎪 모임터 만들기</b> <small>(200${CUR})</small><input id="cn" maxlength="10" placeholder="모임터 이름" style="margin:6px 0"><button class="big" onclick="clubCreate()">열기</button></div>`;
 openPanel(h+jobBox('post')+CLOSE)}
// 친구·결혼·입양
const KID=n=>n.def.t=='mc'||n.def.t=='fc';
function rel(n){const nm=n.def.n,f=S.friend[nm]||0;if(S.spouse==nm)return'💍 배우자';if(S.kids.includes(nm))return'👶 우리 아이';return f>=4?'💛 단짝':f>=2?'🙂 친구':'👋 이웃'}
function friendsUI(){let h='<h3>👪 친구·가족</h3><p><small>이야기를 나누고(하루 한 번) 선물을 주면 하트가 늘어요. 하트 5개 + 💍꽃반지면 청혼할 수 있어요.</small></p>';
 for(const n of npcs){const f=S.friend[n.def.n]||0;let b='';if(!S.spouse&&!KID(n)&&f>=5)b=`<button onclick="propose('${n.def.n}')">💍 청혼</button>`;if(S.spouse&&KID(n)&&!S.kids.includes(n.def.n))b=f>=2?`<button onclick="adopt('${n.def.n}')">👶 가족 맞이</button>`:'<small>하트 2개 필요</small>';
  h+=`<div class="row"><span><b>${n.def.n}</b> ${rel(n)}<br>${'❤️'.repeat(Math.min(5,f))}${'🤍'.repeat(Math.max(0,5-f))}</span>${b}</div>`}
 if(S.spouse&&!npcs.some(n=>KID(n)&&!S.kids.includes(n.def.n)))h+='<p><small>가족이 모두 모였어요!</small></p>';openPanel(h+CLOSE)}
function propose(nm){const n=npcs.find(q=>q.def.n==nm);if(!(S.bag.ring>0)){toast('💍 꽃반지가 필요해요<br><small>뚝딱 공방에서 만들어요</small>');return}S.bag.ring--;save();closePanel();wedding(n)}
function adopt(nm){S.kids.push(nm);save();toast(`👶 ${nm}이(가) 우리 가족이 되었어요!<br><small>이제 한지붕 가족방을 함께 써요</small>`);friendsUI()}
// 꽃길 예식 이벤트
let EV=null;
function wedding(n){const others=npcs.filter(q=>q!==n);EV={t:11,n,petals:Array.from({length:50},()=>({x:Math.random(),y:Math.random()*-1,v:.08+Math.random()*.12,c:pick(['#f48fb1','#fff','#ffcdd2','#f8bbd0','#fff59d'])}))};
 npcs.forEach(q=>{q.talking=true;q.path=[]});player.path=[];player.x=10.4;player.y=29.4;player.dir=[.7,.7];n.x=11.3;n.y=29;n.dir=[.7,.7];
 others.forEach((q,i)=>{q.x=8.9+i*.85;q.y=28+(i%2)*.4;q.dir=[.5,.86];setTimeout(()=>{q.bub=pick(['축하해요! 🎉','행복하세요!','와아~ 👏','잘 어울려요!']);q.bt=3.5},1200+i*700)});
 S.spouse=n.def.n;const gift=others.length*30;S.money+=gift;save();ZM=1.5;
 setTimeout(()=>toast(`💐 ${S.name} ♥ ${n.def.n} 꽃길 예식!<br><small>하객들이 축하금 ${gift}${CUR}을 주었어요</small>`),400);setTimeout(()=>{n.bub='평생 함께해요 ❤️';n.bt=4},2500)}
// ---------- 대화 확장 (하루 한 번 이야기 → 하트, 청혼)
const _tch=tch;
tch=function(k){const n=window._tn,nm=n.def.n,d=today();
 if(k==2){const it=['cake','jam','tea','porridge'].find(t=>S.bag[t]>0);if(it){S.bag[it]--;S.friend[nm]=(S.friend[nm]||0)+2;save();talkPanel(n,`${ITN[it]}! 직접 만든 거예요? 최고예요! ❤️❤️`);return}}
 _tch(k);if(k==1&&S.talkDay[nm]!=d){S.talkDay[nm]=d;S.friend[nm]=(S.friend[nm]||0)+1;save();toast('❤️ 조금 더 친해졌어요');talkPanel(n,n.bub)}};
const _tp=talkPanel;
talkPanel=function(n,line){if(S.spouse==n.def.n)line=pick(['여보, 오늘도 수고했어요!','같이 산책할까요?','집에 새 가구 놓을까요?',line]);if(S.kids.includes(n.def.n))line=pick(['엄마아빠, 같이 놀아요!','오늘 뭐 먹어요?',line]);_tp(n,line);
 const f=S.friend[n.def.n]||0,p=$('panel'),last=p.querySelector('button.gray');if(!S.spouse&&!KID(n)&&f>=5&&last){const b=document.createElement('button');b.className='ch';b.style.background='#f8bbd0';b.textContent='💍 청혼하기';b.onclick=()=>propose(n.def.n);p.insertBefore(b,last)}};
// 말풍선 대답 (낱말 알아듣기)
const REPLY=[[/안녕|하이|반가/,'안녕하세요! 반가워요~'],[/배고|밥|먹/,'솥단지 식당에 가 봐요!'],[/옷|예쁘|멋/,'오늘 옷 정말 예뻐요!'],[/돈|방울|일/,'수집소에서 줍는 일을 골라 봐요.'],[/퀴즈|ox|OX/,'마을회관에서 OX 퀴즈 해요!'],[/사랑|좋아/,'에헤헤, 부끄러워요 ❤️'],[/고마/,'천만에요!']];
say=function(t){pb=t;pbt=3.5;const n=npcs.find(n=>Math.hypot(n.x-player.x,n.y-player.y)<4&&!n.talking);if(n)setTimeout(()=>{const r=REPLY.find(r=>r[0].test(t));n.bub=r?r[1]:pick(n.def.hi);n.bt=3.5;setDir(n,player.x-n.x,player.y-n.y)},1000)};
// ---------- OX 퀴즈
const QZ=[['무지개는 흔히 일곱 빛깔이라고 말해요.',1],['펭귄은 하늘을 날 수 있어요.',0],['한글을 만든 임금님은 세종대왕이에요.',1],['바닷물은 민물보다 짜요.',1],['거미의 다리는 6개예요.',0],['해는 서쪽에서 떠요.',0],['고래는 젖을 먹여 키우는 포유류예요.',1],['달은 스스로 빛을 내요.',0],['얼음은 물에 가라앉아요.',0],['대한민국의 수도는 서울이에요.',1],['박쥐는 새의 한 종류예요.',0],['개미는 곤충이에요.',1],['오징어 다리는 8개예요.',0],['김치는 발효 음식이에요.',1],['지구는 태양 둘레를 돌아요.',1],['토끼는 알을 낳아요.',0],['1년은 보통 365일이에요.',1],['물은 바다 높이에서 100도에 끓어요.',1],['꿀벌은 꿀을 만들어요.',1],['태양계에서 가장 큰 행성은 금성이에요.',0]];
let QS=null;
function quizStart(){QS={qs:[...QZ].sort(()=>Math.random()-.5).slice(0,7),i:0,alive:24,ok:0};quizQ()}
function quizQ(msg){const q=QS.qs[QS.i];openPanel(`<h3>⭕❌ 맞다틀리다 한마당</h3><p style="margin:2px 0"><small>${QS.i+1}번째 문제 · 남은 참가자 <b>${QS.alive}</b>명</small></p>${msg?`<p>${msg}</p>`:''}<div style="background:#fff;border:3px solid #ffb300;border-radius:14px;padding:16px;font-size:22px;text-align:center;margin:8px 0">${q[0]}</div><div style="display:flex;gap:10px"><button style="flex:1;font-size:54px;padding:18px;background:#90caf9" onclick="quizA(1)">⭕</button><button style="flex:1;font-size:54px;padding:18px;background:#ef9a9a" onclick="quizA(0)">❌</button></div>`+CLOSE,()=>{QS=null})}
function quizA(a){if(!QS)return;const q=QS.qs[QS.i];if(a!=q[1]){const prize=QS.ok*15;S.money+=prize;save();const r=QS.ok;QS=null;openPanel(`<h3>아쉬워요!</h3><p>정답은 ${q[1]?'⭕':'❌'}였어요.<br>${r}문제를 맞혀서 <b>${prize}${CUR}</b>을 받았어요.</p><button class="big" onclick="quizStart()">다시 하기</button>`+CLOSE);return}
 QS.ok++;QS.i++;QS.alive=Math.max(1,Math.round(QS.alive*(.55+Math.random()*.25)));if(QS.i>=QS.qs.length){const prize=300;S.money+=prize;S.quizWin++;save();QS=null;openPanel(`<h3>🏆 퀴즈 왕!</h3><p>모든 문제를 맞혔어요! 상금 <b>${prize}${CUR}</b></p>`+CLOSE);return}quizQ(`⭕ 정답! ${QS.alive}명이 살아남았어요.`)}
// ---------- 옷장·자전거 메뉴
(function(){const m=$('menu'),mk=(id,t,f)=>{const b=document.createElement('button');b.id=id;b.textContent=t;b.onclick=()=>{m.style.display='none';f()};m.insertBefore(b,m.firstChild)};
 mk('rideb','🚲 자전거',()=>{if(!S.bike){toast('🚲 뚝딱 공방에서 씽씽 자전거를 만들 수 있어요');return}S.ride=!S.ride;save();toast(S.ride?'🚲 씽씽! 빨리 달려요':'자전거에서 내렸어요')});
 mk('famb','👪 친구·가족',friendsUI);mk('wardb','👗 옷장',()=>{shopTab='buy';shopClothes();$('panel').querySelector('h3').textContent='👗 내 옷장 · 옷방'})})();
// ---------- 가족은 따라다녀요
const _nu=npcUpdate;
npcUpdate=function(dt){if(EV){EV.t-=dt;if(EV.t<=0){npcs.forEach(q=>q.talking=false);EV=null;ZM=1}return}_nu(dt);
 for(const n of npcs){const nm=n.def.n;if(n.talking||(S.spouse!=nm&&!S.kids.includes(nm)))continue;const d=Math.hypot(n.x-player.x,n.y-player.y);if(d>2.6&&!n.path.length){n.ft=(n.ft||0)-dt;if(n.ft<=0){n.ft=1;if(d>14){n.x=player.x+.8;n.y=player.y+.3;continue}goTo(n,Math.floor(player.x)+1,Math.floor(player.y),null,true)}}}};
// ---------- 화면 덧그리기 (돗자리 표시, 꽃잎)
const _hud=hud;
hud=function(){_hud();if(MODE=='room')$('zone').textContent='📍'+(RK=='club'?'모임터':HOUSES[S.house].n);if(MODE=='town'&&!panelOpen()&&!actF&&Math.hypot(player.x-STALL.x,player.y-STALL.y)<1.4){actF=stallUI;const a=$('act');a.textContent=S.stall.on?'🧺 내 돗자리':'🧺 돗자리 깔기';a.style.display='block'}};
const _render=render;
render=function(t,dt){_render(t,dt);if(MODE!='town'){if(EV){EV.t-=dt;if(EV.t<=0){npcs.forEach(q=>q.talking=false);EV=null;ZM=1}}return}
 if(S.stall.on){const[a,b]=P(STALL.x+.55,STALL.y-.4,40);ctx.font='bold 13px sans-serif';const tx=`🧺 ${S.name}의 돗자리`,w=ctx.measureText(tx).width+10;rr(a-w/2,b-18,w,18,6,'rgba(198,40,40,.85)');ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(tx,a,b-9)}
 if(EV){for(const p of EV.petals){p.y+=p.v*dt;p.x+=Math.sin(t/500+p.v*50)*.0015;if(p.y>1.05)p.y=-.05;ell(p.x*VW,p.y*VH,6,4,p.c)}const tx=`💐 ${S.name} ♥ ${EV.n.def.n} 꽃길 예식 💐`;ctx.font='bold 20px sans-serif';const w=ctx.measureText(tx).width+24;rr(VW/2-w/2,52,w,38,14,'rgba(233,30,99,.88)');ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(tx,VW/2,71)}};
// 처음 화면 다시 그리기 (새 이름 반영)
if(panelOpen()&&$('tc_mc'))create();
$('helpb').onclick=()=>openPanel(`<h3>❔ 도움말</h3><p>· 땅을 누르면 걸어가요. 화면을 끌면 조이스틱처럼 움직여요.<br>· 🌱 들풀 수집소에서 줍는 일을 골라요 → 길에서 재료를 주워요.<br>· 🧵 옷방, 🍲 식당, 🔨 공방에서 재료로 물건을 만들어요 (게이지가 100%가 되면 완성).<br>· 🧺 광장 돗자리에 올려 두면 자리를 비워도 팔려요.<br>· 🏛️ 마을회관: OX 퀴즈, 모임터, 친구·가족.<br>· 돈 이름은 ${CUR}(🔔)이에요.</p><p style="font-size:14px;color:#777">도란도란 마을 · 캐릭터 3D 모델: Meshy (meshy.ai) · 3D 엔진: three.js</p>`+CLOSE);
window.L={stallSim,wedding,quizStart,craft,stallUI,houseUI,clubEnter,hallUI,get EV(){return EV}};
