const vm=require("vm"),fs=require("fs"),x={};vm.createContext(x);
vm.runInContext(fs.readFileSync("data.js","utf8")+";this.DATA=DATA;this.LIGHTS=LIGHTS",x);
let bad=0;const err=m=>{console.error("✗",m);bad++};
x.DATA.forEach((d,i)=>{
  for(const k of["cat","t","title","sound","when","act"])if(!d[k]||typeof d[k]!=="string")err(`#${i} فیلد ${k}`);
  if(![1,2,3].includes(d.sev))err(`#${i} sev`);
  if(!Array.isArray(d.causes)||!d.causes.length)err(`#${i} causes`);
  if(d.link&&!/^https?:\/\//.test(d.link))err(`#${i} link`);
  if(d.audio&&!d.audio.startsWith("sounds/"))err(`#${i} audio باید در sounds/ باشد`);
  if(d.cost&&![1,2,3].includes(d.cost))err(`#${i} cost`);
});
console.log(x.DATA.length,"مورد،",x.LIGHTS.length,"چراغ");process.exit(bad?1:0);
