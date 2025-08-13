/* ===== i18n strings ===== */
const STR = {
  "pt-BR": {
    title: "Gerador de Nuvem de Palavras",
    mode_free: "Texto livre",
    mode_pairs: "Palavra + frequência",
    free_label: "Cole ou digite seu texto:",
    pairs_label: "Uma por linha (palavra,frequência):",
    sep_label: "Separador:",
    opts_title: "Opções",
    palette: "Paleta",
    fontfam: "Família de fonte",
    maxwords: "Máx. palavras",
    rotation: "Rotação",
    minfont: "Fonte min (px)",
    maxfont: "Fonte máx (px)",
    stopwords: "Stopwords",
    norm: "Normalização",
    lower: "minúsculas",
    punct: "remover pontuação",
    generate: "Gerar nuvem",
    download: "Baixar PNG",
    cite: "Por favor, cite o repositório ao usar este app.",
    help_title: "Como usar",
    help_html: `
    <h3>Entradas</h3>
    <ol>
      <li><b>Texto livre:</b> cole qualquer texto. O app conta a frequência de cada palavra.</li>
      <li><b>Palavra + frequência:</b> forneça linhas no formato <code>palavra,frequência</code>.
          Você pode trocar o separador (vírgula, ponto e vírgula, tab, pipe ou personalizado).</li>
    </ol>
    <h3>Opções</h3>
    <ul>
      <li><b>Paleta:</b> esquema de cores para as palavras.</li>
      <li><b>Família de fonte:</b> Sans, Serif ou Mono.</li>
      <li><b>Máx. palavras:</b> limita o total exibido (as mais frequentes).</li>
      <li><b>Rotação:</b> 0°, 0°/90° ou ângulos variados.</li>
      <li><b>Stopwords:</b> remova palavras comuns de PT e EN. Você pode adicionar as suas.</li>
      <li><b>Normalização:</b> minúsculas e remover pontuação.</li>
    </ul>
    <h3>Exportar</h3>
    <p>Clique em “Baixar PNG” para salvar a imagem gerada.</p>
    <h3>Dicas</h3>
    <ul>
      <li>Textos imensos podem ser lentos. Aumente “Máx. palavras” com parcimônia.</li>
      <li>Use stopwords para focar nos termos relevantes.</li>
    </ul>`,
    status_ready: "Pronto.",
    status_building: "Gerando nuvem...",
    status_done: "Nuvem gerada.",
    parse_warn: "Algumas linhas foram ignoradas (formato inválido)."
  },
  "en": {
    title: "Word Cloud Generator",
    mode_free: "Free text",
    mode_pairs: "Word + frequency",
    free_label: "Paste or type your text:",
    pairs_label: "One per line (word,frequency):",
    sep_label: "Separator:",
    opts_title: "Options",
    palette: "Palette",
    fontfam: "Font family",
    maxwords: "Max words",
    rotation: "Rotation",
    minfont: "Min font (px)",
    maxfont: "Max font (px)",
    stopwords: "Stopwords",
    norm: "Normalization",
    lower: "lowercase",
    punct: "strip punctuation",
    generate: "Generate",
    download: "Download PNG",
    cite: "Please cite the repository when using this app.",
    help_title: "How to use",
    help_html: `
    <h3>Inputs</h3>
    <ol>
      <li><b>Free text:</b> paste any text. The app counts word frequencies.</li>
      <li><b>Word + frequency:</b> provide lines as <code>word,frequency</code>.
          You may choose the separator (comma, semicolon, tab, pipe or custom).</li>
    </ol>
    <h3>Options</h3>
    <ul>
      <li><b>Palette:</b> color scheme for words.</li>
      <li><b>Font family:</b> Sans, Serif or Mono.</li>
      <li><b>Max words:</b> limits total displayed (most frequent first).</li>
      <li><b>Rotation:</b> 0°, 0°/90° or mixed angles.</li>
      <li><b>Stopwords:</b> remove common words in PT and EN. Add your own.</li>
      <li><b>Normalization:</b> lowercase and strip punctuation.</li>
    </ul>
    <h3>Export</h3>
    <p>Click “Download PNG” to save the generated image.</p>
    <h3>Tips</h3>
    <ul>
      <li>Huge texts can be slow. Increase “Max words” carefully.</li>
      <li>Use stopwords to focus on relevant terms.</li>
    </ul>`,
    status_ready: "Ready.",
    status_building: "Building cloud...",
    status_done: "Done.",
    parse_warn: "Some lines were ignored (invalid format)."
  }
};

/* ===== simple stopwords (enxutas) ===== */
const STOP_PT = new Set(("a,à,agora,ai,ao,aos,aqui,as,até,com,como,da,das,de,dele,dela,dele,demais,desde,do,dos,e,ela,elas,ele,eles,em,entre,era,eram,era,essa,esse,esta,este,eu,foi,foram,isso,isto,já,la,lá,lhe,logo,mais,mas,me,mesmo,meu,minha,na,nas,nem,no,nos,nós,o,os,ou,para,pela,pelas,pelo,pelos,pois,por,porém,que,quem,se,sem,ser,sua,suas,te,tem,ter,tu,tua,tuas,um,uma,uns,umas,vai,você,vocês").split(","));
const STOP_EN = new Set(("a,an,and,are,as,at,be,by,for,from,has,have,he,her,him,his,i,in,is,it,its,me,more,my,not,of,on,or,our,out,she,so,that,the,their,them,there,they,this,to,us,was,we,were,what,when,which,who,will,with,you,your").split(","));

/* ===== palettes ===== */
const PALETTES = {
  viridis: ["#440154","#46327E","#365C8D","#277F8E","#1FA187","#4AC16D","#A0DA39","#FDE725"],
  plasma:  ["#0D0887","#6A00A8","#B12A90","#E16462","#FCA636","#F0F921"],
  cividis: ["#00204C","#193060","#36476B","#516F6B","#7B986A","#B9C369","#FFEA46"],
  warm:    ["#8A2BE2","#FF7F50","#FF6B6B","#FFD166","#F2A65A","#D7263D"],
  cool:    ["#00B5AD","#00A6FB","#6DC0D5","#8D99AE","#A29BFE","#74B9FF"],
  mono:    ["#E6E8EF","#C7CBD8","#A1A6B3","#7D8496","#5C6375","#3A4050"],
  contrast:["#FFFFFF","#FFD700","#FF00FF","#00FFFF","#00FF00","#FF0000","#000000"]
};

function pickColor(palette, i){
  const arr = PALETTES[palette] || PALETTES.viridis;
  return arr[i % arr.length];
}

/* ===== helpers ===== */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function setLanguage(lang){
  const dict = STR[lang] || STR["pt-BR"];
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(key && dict[key]){
      if(key.endsWith("_html")) el.innerHTML = dict[key];
      else el.textContent = dict[key];
    }
  });
}

function normalizeText(str, {lowercase=true, stripPunct=true}){
  let s = str;
  if(stripPunct){
    // remove pontuação exceto hífen e acentos preservados
    s = s.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/g, " ");
  }
  if(lowercase) s = s.toLowerCase();
  return s;
}

function tokenize(text){
  return text.split(/\s+/).filter(Boolean);
}

function removeStop(tokens, usePT, useEN, extra){
  const extraSet = new Set((extra||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean));
  return tokens.filter(w=>{
    const lw = w.toLowerCase();
    if(extraSet.has(lw)) return false;
    if(usePT && STOP_PT.has(lw)) return false;
    if(useEN && STOP_EN.has(lw)) return false;
    return true;
  });
}

function countFreq(tokens){
  const map = new Map();
  for(const t of tokens){
    map.set(t, (map.get(t)||0)+1);
  }
  return Array.from(map.entries()); // [word, freq]
}

function parsePairs(text, sepSel, sepCustom){
  const errors = [];
  let sep;
  switch(sepSel){
    case "comma": sep = ","; break;
    case "semicolon": sep = ";"; break;
    case "tab": sep = "\t"; break;
    case "pipe": sep = "|"; break;
    case "custom": sep = sepCustom || ","; break;
    default: sep = ",";
  }
  // se foi digitado regex no custom, tente usar
  let splitter = sep;
  try{
    if(sepSel==="custom" && sep.startsWith("/") && sep.endsWith("/")){
      const pat = sep.slice(1,-1);
      splitter = new RegExp(pat);
    }
  }catch{ splitter = sep; }

  const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const list = [];
  for(const line of lines){
    const parts = typeof splitter==="string" ? line.split(splitter) : line.split(splitter);
    if(parts.length < 2){ errors.push(line); continue; }
    const word = parts[0].trim();
    const freq = Number(parts[1].trim().replace(",", "."));
    if(!word || !isFinite(freq) || freq <= 0){ errors.push(line); continue; }
    list.push([word, freq]);
  }
  return {list, errors};
}

/* ===== render ===== */
function computeWeightFactor(minFont, maxFont, list){
  const freqs = list.map(x=>x[1]);
  const fmin = Math.min(...freqs);
  const fmax = Math.max(...freqs);
  const span = Math.max(1, fmax - fmin);
  return function(weight){
    const t = (weight - fmin) / span;
    return Math.round(minFont + t*(maxFont - minFont));
  };
}

function rotationConfig(mode){
  if(mode==="none") return {rotateRatio:0, rotationSteps:1};
  if(mode==="orth") return {rotateRatio:.35, rotationSteps:2};
  return {rotateRatio:.6, rotationSteps:6}; // variada
}

/* ===== main ===== */
const canvas = $("#cloudCanvas");
const status = $("#status");
const btnGenerate = $("#btnGenerate");
const btnDownload = $("#btnDownload");
const btnHelp = $("#btnHelp");
const helpModal = $("#helpModal");
const closeHelp = $("#closeHelp");
const langSelect = $("#langSelect");

function resizeCanvas(){
  // mantém responsivo
  const wrap = canvas.parentElement;
  const w = wrap.clientWidth - 20;
  const h = Math.max(360, Math.min(800, Math.round(w*0.55)));
  canvas.width = w;
  canvas.height = h;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function getListFromInputs(){
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const maxWords = Math.max(20, Math.min(1000, Number($("#maxWords").value)||150));
  const palette = $("#palette").value;
  const fontFamily = $("#fontFamily").value;
  const lowercase = $("#lowercase").checked;
  const stripPunct = $("#stripPunct").checked;
  const rmPT = $("#rmPT").checked;
  const rmEN = $("#rmEN").checked;
  const extraStop = $("#extraStop").value;

  let list = [];
  let parseWarn = false;

  if(mode==="free"){
    let text = $("#freeInput").value || "";
    text = normalizeText(text, {lowercase, stripPunct});
    let tokens = tokenize(text);
    tokens = removeStop(tokens, rmPT, rmEN, extraStop);
    list = countFreq(tokens);
  }else{
    const pairsText = $("#pairsInput").value || "";
    const {list: pairs, errors} = parsePairs(pairsText, $("#sepSelect").value, $("#sepCustom").value);
    list = pairs;
    parseWarn = errors.length>0;
    const errBox = $("#pairsErrors");
    if(parseWarn){
      errBox.classList.remove("hidden");
      errBox.textContent = (langSelect.value==="en" ? STR.en.parse_warn : STR["pt-BR"].parse_warn);
    }else{
      errBox.classList.add("hidden");
    }
  }

  // ordena por frequência desc, limita
  list.sort((a,b)=> b[1]-a[1]);
  list = list.slice(0, maxWords);

  return {list, palette, fontFamily};
}

function renderCloud(){
  const lang = langSelect.value;
  status.textContent = STR[lang].status_building;
  btnDownload.disabled = true;

  const {list, palette, fontFamily} = getListFromInputs();
  if(!list.length){
    status.textContent = STR[lang].status_ready;
    return;
  }

  const minFont = Math.max(8, Number($("#minFont").value)||12);
  const maxFont = Math.max(minFont+4, Number($("#maxFont").value)||72);
  const rot = $("#rotation").value;
  const {rotateRatio, rotationSteps} = rotationConfig(rot);

  const weightFactor = computeWeightFactor(minFont, maxFont, list);

  // limpa
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width, canvas.height);

  WordCloud(canvas, {
    list,
    gridSize: Math.round(0.012 * Math.min(canvas.width, canvas.height)),
    weightFactor,
    fontFamily,
    rotateRatio,
    rotationSteps,
    color: (word, weight, fontSize, distance, theta, i) => pickColor(palette, i),
    backgroundColor: "rgba(0,0,0,0)",
    drawOutOfBound: false,
    shrinkToFit: true,
    origin: [canvas.width/2, canvas.height/2],
    click: (item, dimension, evt) => {
      // opcional: copia a palavra ao clicar
      navigator.clipboard?.writeText(item[0]).catch(()=>{});
    },
    // término
    done: () => {
      status.textContent = STR[lang].status_done;
      btnDownload.disabled = false;
    }
  });
}

/* ===== events ===== */
btnGenerate.addEventListener("click", ()=>{
  renderCloud();
});

btnDownload.addEventListener("click", ()=>{
  const link = document.createElement("a");
  link.download = "wordcloud.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

btnHelp.addEventListener("click", ()=>{
  const lang = langSelect.value;
  $("#helpContent").innerHTML = STR[lang].help_html;
  helpModal.showModal();
});
closeHelp.addEventListener("click", ()=> helpModal.close());

langSelect.addEventListener("change", ()=>{
  const lang = langSelect.value;
  setLanguage(lang);
});

document.addEventListener("DOMContentLoaded", ()=>{
  setLanguage("pt-BR");
});

/* alternância UI */
$$('input[name="mode"]').forEach(r=>{
  r.addEventListener("change", (e)=>{
    const mode = e.target.value;
    $("#freeInputWrap").classList.toggle("hidden", mode!=="free");
    $("#pairsInputWrap").classList.toggle("hidden", mode!=="pairs");
  });
});
$("#sepSelect").addEventListener("change", (e)=>{
  $("#sepCustom").classList.toggle("hidden", e.target.value!=="custom");
});

/* primeira renderização de exemplo */
$("#freeInput").value = "abelhas polinização biodiversidade conservação ecologia genética café café café meliponíneos paisagem paisagem paisagem";
renderCloud();

