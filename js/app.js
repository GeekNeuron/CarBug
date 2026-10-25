const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const SEV={1:["جزئی","var(--s1)"],2:["مهم","var(--s2)"],3:["خطرناک","var(--s3)"]};
const C={"موتور":"engine","ترمز":"brake","تعلیق و فرمان":"suspension steering","چرخ و تایر":"wheel tire","گیربکس و کلاچ":"transmission clutch","اگزوز":"exhaust","برق":"starter alternator","خنک‌کاری":"cooling system","تهویه":"car AC compressor","بو و دود":"exhaust smoke"};
const T={"تق‌تق":"knocking ticking","جیغ":"squealing","هوم":"humming whine","غرش":"grinding","سوت":"whistling","قیژ":"squeaking","ناله":"whining","لرزش":"vibration","پف‌پف":"misfire","لگد":"slipping jerk","هیس":"hissing","کوبش":"deep knock","تیک":"clicking","بو/دود":"problem"};
const ZONES={front:["موتور","خنک‌کاری","برق"],cabin:["تهویه"],under:["گیربکس و کلاچ","اگزوز"],wheel:["چرخ و تایر","ترمز","تعلیق و فرمان"],smoke:["بو و دود"]};
const f={cat:"",t:"",sev:0,fav:0,m:"",z:"",q:""},W={c:"",t:""};
const RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
const norm=s=>String(s).replace(/ي/g,"ی").replace(/ك/g,"ک").replace(/\u200c/g," ");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const enc=encodeURIComponent,qs=d=>d.q||`${C[d.cat]||""} ${T[d.t]||""} car sound`;
const uniq=k=>[...new Set(DATA.map(d=>d[k]))];
let favs=new Set(),cmp=[],open=new Set();
try{favs=new Set(JSON.parse(localStorage.getItem("fav")||"[]"))}catch(e){}
const save=()=>{try{localStorage.setItem("fav",JSON.stringify([...favs]))}catch(e){}};
DATA.forEach((d,i)=>{d.id=i;d._s=norm(JSON.stringify(d))});

function cnt(el,to){if(RM){el.textContent=to;return}const t0=performance.now();(function s(t){const p=Math.min((t-t0)/800,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(s)})(t0)}
function stats(){
  const n=DATA.length,by=k=>DATA.filter(d=>d.sev===k).length;
  $("#stats").innerHTML=`<div class="tile"><b class="num" data-n="${n}">0</b><span class="lbl">عیب ثبت‌شده در ${uniq("cat").length} دسته</span></div>`+
  [3,2,1].map(k=>`<button class="tile ring" data-sev="${k}" aria-pressed="false" style="--c:${SEV[k][1]}"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34"/><circle class="arc" cx="40" cy="40" r="34" data-p="${by(k)/n}"/></svg><b class="num" data-n="${by(k)}">0</b><span class="lbl">${SEV[k][0]}</span></button>`).join("");
  $$(".num").forEach(e=>cnt(e,+e.dataset.n));
  requestAnimationFrame(()=>requestAnimationFrame(()=>$$(".arc").forEach(a=>a.style.strokeDashoffset=213.6*(1-a.dataset.p))));
}
function chips(id,vals,key){
  const box=$("#"+id);
  ["",...vals].forEach(v=>{
    const b=document.createElement("button");b.className="chip";b.textContent=v||"همه";b.setAttribute("aria-pressed",v==="");
    b.onclick=()=>{f[key]=v;box.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x===b));render()};
    box.appendChild(b);
  });
}
function card(d,i,p){
  const y=enc(qs(d)),on=favs.has(d.id);
  return `<article class="card${open.has(d.id)?" open":""}" id="${p}${d.id}" data-s="${d.sev}" style="--c:${SEV[d.sev][1]};--i:${Math.min(i,12)}">
<div class="top"><button class="head" data-a="tog" data-id="${d.id}"><span class="lamp"></span><div><h3>${esc(d.title)}</h3><p class="meta"><span>${esc(d.cat)}</span><span>${esc(d.t)}</span><span class="sev">${SEV[d.sev][0]}</span>${d.cost?`<span>هزینه ${"$".repeat(d.cost)}</span>`:""}${d.m?`<span>${esc(d.m.join("، "))}</span>`:""}</p></div></button>
<button class="star${on?" on":""}" data-a="fav" data-id="${d.id}" aria-label="ذخیره">★</button></div>
<p class="snd">${esc(d.sound)}</p>
<div class="more"><div><p class="meta">زمان بروز: ${esc(d.when)}</p><ul>${d.causes.map(c=>`<li>${esc(c)}</li>`).join("")}</ul><p><b>اقدام:</b> ${esc(d.act)}</p>
${d.audio?`<audio controls preload="none" src="${esc(d.audio)}"></audio>`:""}
<div class="tools"><label><input type="checkbox" data-a="cmp" data-id="${d.id}" ${cmp.includes(d.id)?"checked":""}> مقایسه</label><button data-a="link" data-id="${d.id}">🔗 کپی لینک</button><span>🎧</span>
${d.link?`<a href="${esc(d.link)}" target="_blank" rel="noopener">▶ منبع</a>`:""}
<a href="https://www.youtube.com/results?search_query=${y}" target="_blank" rel="noopener">یوتیوب</a><a href="https://open.spotify.com/search/${y}" target="_blank" rel="noopener">اسپاتیفای</a><a href="https://www.aparat.com/search/${enc(d.title+" صدا")}" target="_blank" rel="noopener">آپارات</a></div></div></div></article>`;
}
function render(){
  $$(".z").forEach(z=>z.setAttribute("aria-pressed",z.dataset.z===f.z));
  let r=DATA.filter(d=>(!f.cat||d.cat===f.cat)&&(!f.t||d.t===f.t)&&(!f.sev||d.sev===f.sev)&&(!f.fav||favs.has(d.id))&&(!f.m||!d.m||d.m.includes(f.m))&&(!f.z||ZONES[f.z].includes(d.cat))&&(!f.q||d._s.includes(f.q)));
  if($("#sort").value==="1")r=[...r].sort((a,b)=>b.sev-a.sev);
  $("#count").textContent=(f.fav?"ذخیره‌شده‌ها: ":"")+r.length+" مورد";
  $("#list").innerHTML=r.map((d,i)=>card(d,i,"c")).join("")||"<p class='note'>موردی پیدا نشد.</p>";
}
function wiz(){
  const {c,t}=W,st=!c?0:!t?1:2;
  let h=`<ol class="steps">${["بخش خودرو","نوع صدا یا نشانه","نتیجه"].map((s,i)=>`<li class="${i<st?"done":i===st?"cur":""}">${s}</li>`).join("")}</ol>`;
  const opts=(k,a)=>`<div class="opts">${a.map((x,i)=>`<button class="opt" style="--i:${i}" data-w="${k}" data-x="${esc(x)}">${esc(x)}</button>`).join("")}</div>`;
  if(st===0)h+=opts("c",uniq("cat"));
  else if(st===1)h+=opts("t",[...new Set(DATA.filter(d=>d.cat===c).map(d=>d.t))])+`<button class="btn ghost" data-w="back">بازگشت</button>`;
  else h+=`<div class="grid">${DATA.filter(d=>d.cat===c&&d.t===t).sort((a,b)=>b.sev-a.sev).map((d,i)=>card(d,i,"w")).join("")}</div><p><button class="btn ghost" data-w="back">بازگشت</button><button class="btn ghost" data-w="reset">شروع دوباره</button></p>`;
  $("#wb").innerHTML=h;
}
function nav(v){
  f.fav=v==="saved"?1:0;const k=v==="saved"?"lib":v;
  $$(".view").forEach(s=>s.hidden=s.id!=="v-"+k);
  $$(".side [data-v]").forEach(b=>b.classList.toggle("on",b.dataset.v===v));
  if(k==="lib")render();if(k==="wiz")wiz();scrollTo({top:0});
}
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-a],[data-w],[data-v],[data-sev],.z");if(!el)return;
  const D=el.dataset,id=+D.id;
  if(D.v)return nav(D.v);
  if(D.sev){f.sev=f.sev===+D.sev?0:+D.sev;$$(".ring").forEach(r=>r.setAttribute("aria-pressed",+r.dataset.sev===f.sev));return render()}
  if(D.z!==undefined){f.z=f.z===D.z?"":D.z;return render()}
  if(D.w){if(D.w==="c")W.c=D.x;else if(D.w==="t")W.t=D.x;else if(D.w==="back"){W.t?W.t="":W.c=""}else W.c=W.t="";return wiz()}
  if(D.a==="tog"){const c=el.closest(".card"),o=c.classList.toggle("open");open[o?"add":"delete"](id)}
  if(D.a==="fav"){favs.has(id)?favs.delete(id):favs.add(id);save();el.classList.toggle("on");if(f.fav)render()}
  if(D.a==="link"){const u=location.origin+location.pathname+"#c"+id;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>el.textContent="✔ کپی شد").catch(()=>prompt("لینک:",u))}
});
document.addEventListener("change",e=>{
  const el=e.target.closest("[data-a=cmp]");if(!el)return;const id=+el.dataset.id;
  if(el.checked){if(cmp.length>=3){el.checked=false;return}cmp.push(id)}else cmp=cmp.filter(x=>x!==id);
  bar();
});
function bar(){$("#cbar").hidden=cmp.length<2;$("#go").textContent="مقایسه‌ی "+cmp.length+" مورد"}
$("#clr").onclick=()=>{cmp=[];bar();render()};
$("#close").onclick=()=>$("#dlg").close();
$("#go").onclick=()=>{
  const rows=[["عنوان",d=>d.title],["دسته",d=>d.cat],["نوع صدا",d=>d.t],["شدت",d=>SEV[d.sev][0]],["توصیف",d=>d.sound],["زمان بروز",d=>d.when],["علت‌ها",d=>d.causes.join("، ")],["اقدام",d=>d.act]],ds=cmp.map(i=>DATA[i]);
  $("#tbl").innerHTML="<table>"+rows.map(([h,fn])=>`<tr><th>${h}</th>${ds.map(d=>`<td>${esc(fn(d))}</td>`).join("")}</tr>`).join("")+"</table>";
  $("#dlg").showModal();
};
$$(".z").forEach(z=>z.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();z.click()}});
$("#q").oninput=e=>{f.q=norm(e.target.value.trim());if($("#v-lib").hidden)nav("lib");else render()};
$("#sort").onchange=render;
$("#theme").onclick=()=>{const r=document.documentElement,d=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark"};
$("#lb").innerHTML=LIGHTS.map((l,i)=>`<article class="lc" data-u="${l.u}" style="--c:${SEV[l.u][1]};--i:${i}"><span class="bulb">${l.i}</span><div><h3>${esc(l.n)}</h3><span class="sev">${SEV[l.u][0]}</span><p>${esc(l.m)}</p><p><b>اقدام:</b> ${esc(l.a)}</p></div></article>`).join("");
stats();chips("cats",uniq("cat"),"cat");chips("types",uniq("t"),"t");chips("mods",[...new Set(DATA.flatMap(d=>d.m||[]))],"m");
render();bar();
if(/^#c\d+$/.test(location.hash))setTimeout(()=>{const c=$(location.hash);c&&(c.classList.add("open"),open.add(+location.hash.slice(2)),c.scrollIntoView({block:"center"}))},300);
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
