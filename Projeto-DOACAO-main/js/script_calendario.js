/* ============================================================
   CONFIGS DO CALENDÁRIO
   ------------------------------------------------------------
   data:      "AAAA-MM-DD"
   tipo:      "vacina" | "castracao" | "evento"  (ver TIPOS abaixo)
   titulo:    texto principal do pop-up
   descricao: o que acontecerá no dia
   horario:   (opcional)
   local:     (opcional) endereço
   link:      (opcional) { texto: "...", url: "https://..." }
   PS.: Vários eventos no mesmo dia são permitidos.
   (OBS.: Os dados dos eventos não são datas oficiais!)
   ============================================================ */
const TIPOS = {
  vacina:    { rotulo: "Vacinação gratuita",    cor: "var(--vacina)" },
  castracao: { rotulo: "Campanha de castração", cor: "var(--castracao)" },
  evento:    { rotulo: "Evento / projeto",      cor: "var(--evento)" }
};

const EVENTOS = [
  {
    data: "2026-11-07", tipo: "vacina",
    titulo: "Vacina antirrábica – cães e gatos",
    descricao: "Vacinação gratuita para cães e gatos a partir de 3 meses. Leve a carteirinha do animal, se tiver.",
    horario: "8h às 16h",
    local: "Praça Central, s/n – Centro",
    link: { texto: "Mais informações", url: "https://exemplo.org/vacinacao" }
  },
  {
    data: "2026-11-14", tipo: "castracao",
    titulo: "Mutirão de castração",
    descricao: "Castração gratuita de cães e gatos. Vagas limitadas, com inscrição prévia. Jejum de 8 horas.",
    horario: "7h às 12h",
    local: "Centro de Zoonoses – Rua das Flores, 120",
    link: { texto: "Fazer inscrição", url: "https://exemplo.org/castracao" }
  },
  {
    data: "2026-11-21", tipo: "vacina",
    titulo: "Vacinação de aves domesticáveis",
    descricao: "Vacinação gratuita para galinhas, patos e outras aves domesticáveis, com orientação veterinária.",
    horario: "9h às 14h",
    local: "Secretaria de Agricultura – Av. Brasil, 500",
    link: { texto: "Saiba mais", url: "https://exemplo.org/aves" }
  },
  {
    data: "2026-11-21", tipo: "evento",
    titulo: "Feira de adoção responsável",
    descricao: "ONGs parceiras apresentam animais para adoção, com orientação sobre guarda responsável.",
    horario: "10h às 17h",
    local: "Parque Municipal",
    link: { texto: "Conheça o projeto", url: "https://exemplo.org/adocao" }
  },
  {
    data: "2026-12-05", tipo: "vacina",
    titulo: "Vacina V10 e antirrábica",
    descricao: "Segunda etapa da campanha de vacinação gratuita para cães e gatos.",
    horario: "8h às 15h",
    local: "UBS Vila Nova – Rua Lima, 45",
    link: { texto: "Ver pontos de vacinação", url: "https://exemplo.org/pontos" }
  }
];
/* ============================================================ */

const NOMES_MES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const DIAS = ["Dom.","Seg.","Ter.","Qua.","Qui.","Sex.","Sáb."];

const grade = document.getElementById("grade");
const titulo = document.getElementById("titulo");
const popup = document.getElementById("popup");
const hoje = new Date();
let ano = hoje.getFullYear(), mes = hoje.getMonth();
let fecharTimer = null, celulaAtiva = null;

const pad = n => String(n).padStart(2, "0");
const chave = (a, m, d) => `${a}-${pad(m + 1)}-${pad(d)}`;

const porData = {};
EVENTOS.forEach(e => (porData[e.data] = porData[e.data] || []).push(e));

function el(tag, classe, texto) {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texto != null) n.textContent = texto;
  return n;
}

function render() {
  grade.innerHTML = "";
  titulo.innerHTML = "";
  titulo.append(NOMES_MES[mes] + " ", Object.assign(el("b"), { textContent: ano }));

  DIAS.forEach(d => grade.appendChild(el("div", "dia-semana", d)));

  const primeiro = new Date(ano, mes, 1).getDay();
  const total = new Date(ano, mes + 1, 0).getDate();
  for (let i = 0; i < primeiro; i++) grade.appendChild(el("div", "dia vazio"));

  for (let d = 1; d <= total; d++) {
    const k = chave(ano, mes, d);
    const evs = porData[k];
    const ehHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
    const cel = el(evs ? "button" : "div", "dia" + (ehHoje ? " hoje" : "") + (evs ? " com-evento" : ""), String(d));

    if (evs) {
      cel.type = "button";
      cel.style.setProperty("--cor", TIPOS[evs[0].tipo].cor);
      const pontos = el("span", "pontos");
      [...new Set(evs.map(e => e.tipo))].forEach(t => {
        const p = el("span", "ponto"); p.style.background = TIPOS[t].cor; pontos.appendChild(p);
      });
      cel.appendChild(pontos);
      cel.setAttribute("aria-label", `${d} de ${NOMES_MES[mes]}: ${evs.map(e => e.titulo).join("; ")}`);
      cel.addEventListener("mouseenter", () => abrir(cel, k, evs));
      cel.addEventListener("mouseleave", agendarFechar);
      cel.addEventListener("focus", () => abrir(cel, k, evs));
      cel.addEventListener("blur", agendarFechar);
      cel.addEventListener("click", e => { e.stopPropagation(); abrir(cel, k, evs); });
    }
    grade.appendChild(cel);
  }
  fechar();
}

function abrir(cel, k, evs) {
  clearTimeout(fecharTimer);
  if (celulaAtiva) celulaAtiva.classList.remove("ativo");
  celulaAtiva = cel; cel.classList.add("ativo");

  popup.innerHTML = "";
  const [a, m, d] = k.split("-").map(Number);
  const dataFmt = new Date(a, m - 1, d).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  popup.appendChild(el("div", "data-pop", dataFmt));

  evs.forEach(e => {
    const item = el("div", "item");
    const tag = el("span", "tag", TIPOS[e.tipo].rotulo);
    tag.style.background = TIPOS[e.tipo].cor;
    item.append(tag, el("h3", null, e.titulo), el("p", null, e.descricao));
    if (e.horario) item.appendChild(linha("Horário: ", e.horario));
    if (e.local) item.appendChild(linha("Local: ", e.local));
    if (e.link && /^https?:\/\//i.test(e.link.url)) {
      const p = el("div", "linha");
      const a = el("a", null, (e.link.texto || "Saiba mais") + " →");
      a.href = e.link.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      p.appendChild(a); item.appendChild(p);
    }
    popup.appendChild(item);
  });

  popup.classList.add("aberto");
  const r = cel.getBoundingClientRect();
  const w = popup.offsetWidth, h = popup.offsetHeight;
  let x = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), window.innerWidth - w - 12);
  let y = r.bottom + 8;
  if (y + h > window.innerHeight - 12) y = Math.max(12, r.top - h - 8);
  popup.style.left = x + "px"; popup.style.top = y + "px";
}

function linha(rotulo, texto) {
  const p = el("div", "linha");
  p.append(Object.assign(el("b"), { textContent: rotulo }), texto);
  return p;
}

function agendarFechar() { clearTimeout(fecharTimer); fecharTimer = setTimeout(fechar, 200); }
function fechar() {
  popup.classList.remove("aberto");
  if (celulaAtiva) { celulaAtiva.classList.remove("ativo"); celulaAtiva = null; }
}

popup.addEventListener("mouseenter", () => clearTimeout(fecharTimer));
popup.addEventListener("mouseleave", agendarFechar);
document.addEventListener("click", e => { if (!popup.contains(e.target)) fechar(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") fechar(); });

document.getElementById("anterior").onclick = () => { mes--; if (mes < 0) { mes = 11; ano--; } render(); };
document.getElementById("proximo").onclick = () => { mes++; if (mes > 11) { mes = 0; ano++; } render(); };

const leg = document.getElementById("legenda");
Object.values(TIPOS).forEach(t => {
  const s = el("span"); const i = el("i"); i.style.background = t.cor;
  s.append(i, t.rotulo); leg.appendChild(s);
});

render();