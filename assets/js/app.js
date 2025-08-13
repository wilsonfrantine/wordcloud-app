/* ================== Stopwords ================== */
const STOP_PT = new Set(("a,à,agora,ai,ao,aos,aqui,as,até,com,como,da,das,de,dela,dele,demais,desde,do,dos,e,ela,elas,ele,eles,em,entre,era,eram,essa,esse,esta,este,eu,foi,foram,isso,isto,já,la,lá,lhe,logo,mais,mas,me,mesmo,meu,minha,na,nas,nem,no,nos,nós,o,os,ou,para,pela,pelas,pelo,pelos,pois,por,porém,que,quem,se,sem,ser,sua,suas,te,tem,ter,tu,tua,tuas,um,uma,uns,umas,vai,você,vocês").split(","));
const STOP_EN = new Set(("a,an,and,are,as,at,be,by,for,from,has,have,he,her,him,his,i,in,is,it,its,me,more,my,not,of,on,or,our,out,she,so,that,the,their,them,there,they,this,to,us,was,we,were,what,when,which,who,will,with,you,your").split(","));

/* ================== Palettes ================== */
const PALETTES = {
  viridis: ["#440154","#46327E","#365C8D","#277F8E","#1FA187","#4AC16D","#A0DA39","#FDE725"],
  plasma:  ["#0D0887","#6A00A8","#B12A90","#E16462","#FCA636","#F0F921"],
  cividis: ["#00204C","#193060","#36476B","#516F6B","#7B986A","#B9C369","#FFEA46"],
  warm:    ["#8A2BE2","#FF7F50","#FF6B6B","#FFD166","#F2A65A","#D7263D"],
  cool:    ["#00B5AD","#00A6FB","#6DC0D5","#8D99AE","#A29BFE","#74B9FF"],
  mono:    ["#111111","#333333","#555555","#777777","#999999","#BBBBBB","#DDDDDD"],
  contrast:["#000000","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF","#FFFFFF"]
};
function hashColor(word, paletteName){
  const arr = PALETTES[paletteName] || PALETTES.viridis;
  let h = 0;
  for(let i=0;i<word.length;i++){ h = (h*31 + word.charCodeAt(i)) >>> 0; }
  return arr[h % arr.length];
}

/* ================== Helpers ================== */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function normalizeText(str, {lowercase=true, stripPunct=true}){
  let s = str || "";
  if(stripPunct){ s = s.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/g, " "); }
  if(lowercase) s = s.toLowerCase();
  return s;
}
function tokenize(text){ return (text||"").split(/\s+/).filter(Boolean); }
function removeStop(tokens, usePT, useEN, extra){
  const extraSet = new Set((extra||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean));
  return (tokens||[]).filter(w=>{
    const lw = (w||"").toLowerCase();
    if(extraSet.has(lw)) return false;
    if(usePT && STOP_PT.has(lw)) return false;
    if(useEN && STOP_EN.has(lw)) return false;
    return true;
  });
}
function countFreq(tokens){
  const map = new Map();
  for(const t of (tokens||[])){ map.set(t, (map.get(t)||0)+1); }
  return Array.from(map.entries());
}
function parsePairs(text, sepSel, sepCustom){
  let sep;
  switch(sepSel){
    case "semicolon": sep = ";"; break;
    case "tab": sep = "\t"; break;
    case "pipe": sep = "|"; break;
    case "custom": sep = sepCustom || ","; break;
    case "comma":
    default: sep = ",";
  }
  try{
    if(sepSel==="custom" && sep.startsWith("/") && sep.endsWith("/")){
      sep = new RegExp(sep.slice(1,-1));
    }
  }catch{/* keep as string */}
  const lines = (text||"").split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const list = [];
  for(const line of lines){
    const parts = (typeof sep==="string") ? line.split(sep) : line.split(sep);
    if(parts.length < 2) continue;
    const word = (parts[0]||"").trim();
    const freq = Number((parts[1]||"").trim().replace(",", "."));
    if(!word || !isFinite(freq) || freq <= 0) continue;
    list.push([word, freq]);
  }
  return {list, errors: []};
}

/* ================== Canvas (High-res fixed) & display ================== */
const canvas = $("#cloudCanvas");
const wrap   = $("#canvasWrap");
const handle = $("#resizeHandle");

const HIRES_W = 3200;
const HIRES_H = 2200;

function setCanvasHiRes(){
  canvas.width  = HIRES_W;
  canvas.height = HIRES_H;
  const wIn = $("#wcWidth");  if (wIn)  wIn.value  = HIRES_W;
  const hIn = $("#wcHeight"); if (hIn) hIn.value = HIRES_H;
}
setCanvasHiRes();

/* Resize handle: adjusts CSS display window (not the canvas pixels) */
let dragging = false, startX=0, startY=0, startW=0, startH=0;
if (handle) {
  handle.addEventListener("mousedown", (e)=>{
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    const rect = wrap.getBoundingClientRect();
    startW = rect.width; startH = rect.height;
    document.body.style.userSelect = "none";
  });
}
window.addEventListener("mousemove", (e)=>{
  if(!dragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  wrap.style.width  = Math.max(360, startW + dx) + "px";
  wrap.style.height = Math.max(300, startH + dy) + "px";
});
window.addEventListener("mouseup", ()=>{
  if(dragging){ dragging = false; document.body.style.userSelect = ""; }
});

/* Display size inputs (CSS only) */
$("#wcWidth")?.addEventListener("change", ()=>{
  const v = Math.max(360, Math.min(4000, Number($("#wcWidth").value)||900));
  wrap.style.width = v + "px";
});
$("#wcHeight")?.addEventListener("change", ()=>{
  const v = Math.max(300, Math.min(3000, Number($("#wcHeight").value)||500));
  wrap.style.height = v + "px";
});

/* ================== Steppers (+/−) ================== */
function updateStepper(id, delta){
  const input = $("#"+id);
  const span  = $("#"+id+"Val");
  if (!input || !span) return;
  let v = Number(input.value);
  v = Math.max(8, Math.min(200, v + delta));
  input.value = v; span.textContent = v;
  if(id==="minFont"){
    const max = Number($("#maxFont").value);
    if(v >= max-2){ $("#maxFont").value = v+2; $("#maxFontVal").textContent = v+2; }
  }
}
$$(".step").forEach(b=>{
  b.addEventListener("click", ()=> updateStepper(b.dataset.target, Number(b.dataset.delta)));
});

/* ================== Data & render ================== */
function getListFromInputs(){
  const mode = (document.querySelector('input[name="mode"]:checked')?.value) || "free";
  const maxWords = Math.max(20, Math.min(1000, Number($("#maxWords")?.value)||150));
  const lowercase = $("#lowercase")?.checked ?? true;
  const stripPunct = $("#stripPunct")?.checked ?? true;
  const rmPT = $("#rmPT")?.checked ?? true;
  const rmEN = $("#rmEN")?.checked ?? false;
  const extraStop = $("#extraStop")?.value || "";

  let list = [];

  if (mode === "free") {
    let text = $("#freeInput")?.value || "";
    if (!text.trim()) {
      text = "wordcloud cloud words visualization frequency frequency data example example";
    }
    const norm = normalizeText(text, {lowercase, stripPunct});
    const toks = tokenize(norm);
    const toks2 = removeStop(toks, rmPT, rmEN, extraStop);
    list = countFreq(toks2.length ? toks2 : toks);
  } else {
    const pairsText = $("#pairsInput")?.value || "";
    const {list: pairs} = parsePairs(pairsText, $("#sepSelect")?.value, $("#sepCustom")?.value);
    list = pairs.length ? pairs : [];
    if (!list.length) {
      const text = $("#freeInput")?.value || "wordcloud cloud words example example";
      const norm = normalizeText(text, {lowercase, stripPunct});
      const toks = tokenize(norm);
      const toks2 = removeStop(toks, rmPT, rmEN, extraStop);
      list = countFreq(toks2.length ? toks2 : toks);
    }
  }

  list.sort((a,b)=> b[1]-a[1]);
  return { list: list.slice(0, maxWords) };
}

function computeWeightFactor(minFont, maxFont, list){
  const freqs = list.map(x=>x[1]);
  const fmin = Math.min(...freqs);
  const fmax = Math.max(...freqs);
  const span = Math.max(1, fmax - fmin);
  return weight => Math.round(minFont + ((weight - fmin)/span)*(maxFont - minFont));
}
function rotationConfig(mode){
  if(mode==="none") return {rotateRatio:0, rotationSteps:1};
  if(mode==="orth") return {rotateRatio:.35, rotationSteps:2};
  return {rotateRatio:.6, rotationSteps:6};
}

function setGenerating(isOn){
  const btn = $("#btnGenerate");
  if (!btn) return;
  btn.disabled = !!isOn;
  if (isOn) { btn.dataset.label = btn.textContent; btn.textContent = "Generating…"; }
  else if (btn.dataset.label) { btn.textContent = btn.dataset.label; }
}

/* Release UI if lib signals stop/abort */
canvas.addEventListener("wordcloudstop", () => setGenerating(false));
canvas.addEventListener("wordcloudabort", () => setGenerating(false));

function renderCloud(){
  setGenerating(true);

  const { list } = getListFromInputs();
  if(!list.length){ setGenerating(false); return; }

  const minFontCss = Math.max(8,  Number($("#minFont")?.value) || 90);
  const maxFontCss = Math.max(minFontCss+4, Number($("#maxFont")?.value) || 150);
  const minFontPx  = Math.round(minFontCss * 3.2); // scale up for 3200×2200
  const maxFontPx  = Math.round(maxFontCss * 3.2);

  const rot = $("#rotation")?.value || "mix";
  const {rotateRatio, rotationSteps} = rotationConfig(rot);
  const palette    = $("#palette")?.value || "viridis";
  const fontFamily = $("#fontFamily")?.value || "Inter, system-ui, sans-serif";

  const ctx = canvas.getContext("2d");
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--panel").trim() || "#ffffff";
  ctx.fillStyle = bg; ctx.fillRect(0,0,canvas.width, canvas.height);

  const weightFactor = computeWeightFactor(minFontPx, maxFontPx, list);
  const gridSize = Math.round(0.016 * Math.min(canvas.width, canvas.height));

  setTimeout(()=>{
    WordCloud(canvas, {
      list,
      gridSize,
      weightFactor,
      fontFamily,
      rotateRatio,
      rotationSteps,
      color: (word) => hashColor(word, palette),
      clearCanvas: true,
      backgroundColor: bg,
      drawOutOfBound: false,
      shrinkToFit: true,
      origin: [canvas.width/2, canvas.height/2],
      done: () => setGenerating(false)
    });
  }, 0);
}

/* ================== Help modal ================== */
$("#btnHelp")?.addEventListener("click", ()=>{
  $("#helpModal")?.showModal();
});
$("#closeHelp")?.addEventListener("click", ()=> $("#helpModal")?.close());

/* ================== Mode & separator toggles ================== */
$$('input[name="mode"]').forEach(r=>{
  r.addEventListener("change", (e)=>{
    const mode = e.target.value;
    $("#freeInputWrap")?.classList.toggle("hidden", mode!=="free");
    $("#pairsInputWrap")?.classList.toggle("hidden", mode!=="pairs");
  });
});
$("#sepSelect")?.addEventListener("change", (e)=>{
  $("#sepCustom")?.classList.toggle("hidden", e.target.value!=="custom");
});

/* ================== Init ================== */
function ready(fn){ 
  if (document.readyState !== 'loading') fn(); 
  else document.addEventListener('DOMContentLoaded', fn); 
}
ready(()=>{
  if (wrap) { wrap.style.width = "100%"; wrap.style.height = "70vh"; }
  if (!$("#freeInput")?.value?.trim()) {
    $("#freeInput").value = "wordcloud cloud words visualization frequency frequency data example";
  }
  $("#btnGenerate")?.addEventListener("click", renderCloud);
  renderCloud();
});

