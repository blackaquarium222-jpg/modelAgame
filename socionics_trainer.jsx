import React, { useState } from "react";

const INK = "#2c2118";

const FUNCTIONS = {
  Ne: { el: "N", dir: "e", jp: "外向直観" },
  Ni: { el: "N", dir: "i", jp: "内向直観" },
  Se: { el: "S", dir: "e", jp: "外向感覚" },
  Si: { el: "S", dir: "i", jp: "内向感覚" },
  Te: { el: "T", dir: "e", jp: "外向論理" },
  Ti: { el: "T", dir: "i", jp: "内向論理" },
  Fe: { el: "F", dir: "e", jp: "外向倫理" },
  Fi: { el: "F", dir: "i", jp: "内向倫理" },
};
const ALL8 = ["Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];

// 可愛い×彩度高め。外向=濃い / 内向=淡い
const EL = {
  N: { e: "#a16fe0", i: "#dcc6f5" },  // 直観 = 紫
  S: { e: "#fb6f6f", i: "#ffc6c2" },  // 感覚 = 赤
  T: { e: "#4f9ae8", i: "#bfdcf7" },  // 論理 = 青
  F: { e: "#2ec7a4", i: "#b4ecdf" },  // 倫理 = ミント
};
const OK = "#2ec7a4";
const NG = "#ea5340";
const BLUE = "#4f9ae8";
const RED = "#ef5b6e";
const PURPLE = "#a16fe0";

const POSITIONS = [
  { n: 1, jp: "主導" }, { n: 2, jp: "創造" },
  { n: 3, jp: "規範" }, { n: 4, jp: "脆弱" },
  { n: 5, jp: "暗示" }, { n: 6, jp: "動員" },
  { n: 7, jp: "無視" }, { n: 8, jp: "証明" },
];

const TYPES = [
  { code: "ILE", quadra: "α", stack: ["Ne","Ti","Se","Fi","Si","Fe","Ni","Te"] },
  { code: "SEI", quadra: "α", stack: ["Si","Fe","Ni","Te","Ne","Ti","Se","Fi"] },
  { code: "ESE", quadra: "α", stack: ["Fe","Si","Te","Ni","Ti","Ne","Fi","Se"] },
  { code: "LII", quadra: "α", stack: ["Ti","Ne","Fi","Se","Fe","Si","Te","Ni"] },
  { code: "EIE", quadra: "β", stack: ["Fe","Ni","Te","Si","Ti","Se","Fi","Ne"] },
  { code: "LSI", quadra: "β", stack: ["Ti","Se","Fi","Ne","Fe","Ni","Te","Si"] },
  { code: "SLE", quadra: "β", stack: ["Se","Ti","Ne","Fi","Ni","Fe","Si","Te"] },
  { code: "IEI", quadra: "β", stack: ["Ni","Fe","Si","Te","Se","Ti","Ne","Fi"] },
  { code: "SEE", quadra: "γ", stack: ["Se","Fi","Ne","Ti","Ni","Te","Si","Fe"] },
  { code: "ILI", quadra: "γ", stack: ["Ni","Te","Si","Fe","Se","Fi","Ne","Ti"] },
  { code: "LIE", quadra: "γ", stack: ["Te","Ni","Se","Fi","Si","Fe","Ti","Ne"] },
  { code: "ESI", quadra: "γ", stack: ["Fi","Se","Ti","Ne","Te","Ni","Fe","Si"] },
  { code: "LSE", quadra: "δ", stack: ["Te","Si","Ne","Fi","Ni","Fe","Ti","Se"] },
  { code: "EII", quadra: "δ", stack: ["Fi","Ne","Ti","Se","Te","Ni","Fe","Si"] },
  { code: "IEE", quadra: "δ", stack: ["Ne","Fi","Se","Ti","Si","Te","Ni","Fe"] },
  { code: "SLI", quadra: "δ", stack: ["Si","Te","Ni","Fe","Ne","Fi","Se","Ti"] },
];

const QUADRA = { "α": "アルファ", "β": "ベータ", "γ": "ガンマ", "δ": "デルタ" };

const EROS = {
  ILE: "子供タイプ", LII: "子供タイプ", EII: "子供タイプ", IEE: "子供タイプ",
  SEI: "保護者タイプ", ESE: "保護者タイプ", LSE: "保護者タイプ", SLI: "保護者タイプ",
  SLE: "侵略者タイプ", LSI: "侵略者タイプ", SEE: "侵略者タイプ", ESI: "侵略者タイプ",
  IEI: "犠牲者タイプ", EIE: "犠牲者タイプ", ILI: "犠牲者タイプ", LIE: "犠牲者タイプ",
};
const EROS_PAIR = { "子供タイプ": "保護者タイプ", "保護者タイプ": "子供タイプ", "侵略者タイプ": "犠牲者タイプ", "犠牲者タイプ": "侵略者タイプ" };

const MODES = {
  ego:    { label: "主導・創造", positions: [0, 1] },
  values: { label: "価値機能", positions: [0, 1, 4, 5] },
  full:   { label: "全8機能", positions: [0, 1, 2, 3, 4, 5, 6, 7] },
};
const BLOCKS = [
  { jp: "自我", idx: [0, 1] },
  { jp: "超自我", idx: [2, 3] },
  { jp: "超イド", idx: [4, 5] },
  { jp: "イド", idx: [6, 7] },
];

function randType(exclude) {
  let i = Math.floor(Math.random() * TYPES.length);
  while (i === exclude) i = Math.floor(Math.random() * TYPES.length);
  return i;
}

function tileColors(name, status, lifted) {
  const f = FUNCTIONS[name];
  const fill = EL[f.el][f.dir];
  let border = INK;
  if (status === "correct") border = OK;
  if (status === "wrong") border = NG;
  return {
    background: fill,
    color: INK,
    border: `2.5px solid ${border}`,
    boxShadow: lifted ? `1px 1px 0 ${INK}` : `3px 3px 0 ${INK}`,
    transform: lifted ? "translate(2px,2px)" : "none",
    transition: "transform .1s ease, box-shadow .1s ease",
  };
}

export default function App() {
  const [mode, setMode] = useState("ego");
  const [typeIndex, setTypeIndex] = useState(() => randType(-1));
  const [placement, setPlacement] = useState({});
  const [selFunc, setSelFunc] = useState(null);
  const [selSlot, setSelSlot] = useState(null);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [solved, setSolved] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const type = TYPES[typeIndex];
  const active = MODES[mode].positions;
  const placedFuncs = Object.values(placement);
  const allFilled = active.every((p) => placement[p]);
  const allCorrect = checked && active.every((p) => placement[p] === type.stack[p]);
  const eros = EROS[type.code];

  function clearSel() { setSelFunc(null); setSelSlot(null); }
  function placeFunc(func, posIndex) {
    setPlacement((prev) => {
      const next = {};
      for (const k of Object.keys(prev)) {
        if (prev[k] !== func && Number(k) !== posIndex) next[k] = prev[k];
      }
      next[posIndex] = func;
      return next;
    });
    clearSel();
  }
  function clearBoard() { setPlacement({}); clearSel(); setChecked(false); setRevealed(false); }
  function nextType() { setTypeIndex(randType(typeIndex)); clearBoard(); }
  function changeMode(m) { setMode(m); clearBoard(); }

  function tapPool(name) {
    if (checked) return;
    if (selSlot != null) { placeFunc(name, selSlot); return; }
    setSelFunc((s) => (s === name ? null : name));
    setSelSlot(null);
  }
  function tapSlot(pi) {
    if (checked || !active.includes(pi)) return;
    if (selFunc) { placeFunc(selFunc, pi); return; }
    if (placement[pi]) {
      const f = placement[pi];
      setPlacement((prev) => { const n = { ...prev }; delete n[pi]; return n; });
      setSelFunc(f); setSelSlot(null);
      return;
    }
    setSelSlot((s) => (s === pi ? null : pi));
    setSelFunc(null);
  }

  function check() {
    if (!allFilled) return;
    const ok = active.every((p) => placement[p] === type.stack[p]);
    setChecked(true); clearSel();
    setAttempts((a) => a + 1);
    if (ok) {
      setSolved((s) => s + 1);
      setStreak((s) => { const ns = s + 1; setBest((b) => Math.max(b, ns)); return ns; });
    } else setStreak(0);
  }
  function showAnswer() {
    const next = {};
    active.forEach((p) => (next[p] = type.stack[p]));
    setPlacement(next); clearSel(); setChecked(true); setRevealed(true); setStreak(0);
  }

  const page = {
    background: "#eecabf",
    color: INK,
    fontFamily: "'Helvetica Neue', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', system-ui, sans-serif",
  };
  const panel = { background: "#fdf6ef", border: `2.5px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}` };

  let guide;
  if (selFunc) guide = <span><b style={{ background: "#fff", border: `1.5px solid ${INK}`, borderRadius: 6, padding: "1px 6px" }}>{selFunc}</b> を入れる位置をタップ</span>;
  else if (selSlot != null) guide = <span><b>{POSITIONS[selSlot].jp}</b> に入れる機能をタップ</span>;
  else guide = <span style={{ color: "#8a6f55" }}>位置か機能をタップして組み合わせてね → 答え合わせ</span>;

  return (
    <div className="min-h-screen w-full px-4 py-6 flex justify-center" style={page}>
      <div className="w-full" style={{ maxWidth: 460 }}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 style={{ fontWeight: 900, fontSize: 30, letterSpacing: "-0.03em", lineHeight: 1, color: INK }}>
              Model<span style={{ color: RED }}>·</span>A
            </h1>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".34em", color: BLUE, marginTop: 4 }}>training</div>
          </div>
          <div className="text-right">
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".18em", color: "#b08562" }}>STREAK</div>
            <div style={{ fontWeight: 900, fontSize: 30, lineHeight: 1, color: streak > 0 ? OK : INK }}>{streak}</div>
            <div style={{ fontSize: 9, color: "#bd9270", marginTop: 2 }}>best {best} / {solved}-{attempts}</div>
          </div>
        </div>

        {/* 難易度 */}
        <div className="flex gap-2 mb-3">
          {Object.keys(MODES).map((m) => (
            <button key={m} onClick={() => changeMode(m)}
              className="flex-1 py-2.5 text-xs"
              style={{
                fontWeight: 800, borderRadius: 12,
                background: mode === m ? INK : "#fdf6ef",
                color: mode === m ? "#fdf6ef" : "#9c7a5b",
                border: `2.5px solid ${INK}`,
                boxShadow: mode === m ? `1px 1px 0 ${INK}` : `3px 3px 0 ${INK}`,
                transform: mode === m ? "translate(2px,2px)" : "none",
                transition: "all .1s ease",
              }}>
              {MODES[m].label}
            </button>
          ))}
        </div>

        {/* 使い方ガイド */}
        {!checked && (
          <div className="mb-3 px-3.5 py-2.5" style={{
            borderRadius: 12, fontSize: 12, fontWeight: 800,
            background: (selFunc || selSlot != null) ? "#e0eefc" : "#fdf6ef",
            border: `2px solid ${INK}`,
          }}>
            {guide}
          </div>
        )}

        {/* 出題 */}
        <div className="flex items-center justify-between mb-3 px-5 py-4" style={{ ...panel, borderRadius: 18 }}>
          <span style={{ fontWeight: 900, fontSize: 42, letterSpacing: "-0.03em", lineHeight: 1 }}>{type.code}</span>
          <span style={{ fontSize: 11, fontWeight: 800, padding: "7px 14px", borderRadius: 999, background: "#cfe6fb", border: `2px solid ${INK}` }}>
            {active.length} 枠
          </span>
        </div>

        {/* 盤面 */}
        <div className="space-y-2.5 mb-4">
          {BLOCKS.map((b) => (
            <div key={b.jp} className="p-3" style={{ ...panel, borderRadius: 18, boxShadow: `3px 3px 0 ${INK}` }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em", color: "#bd9270", marginBottom: 8, paddingLeft: 2 }}>{b.jp}</div>
              <div className="grid grid-cols-2 gap-2.5">
                {b.idx.map((pi) => {
                  const pos = POSITIONS[pi];
                  const isActive = active.includes(pi);
                  const func = placement[pi];
                  const isSel = selSlot === pi;
                  const open = isActive && !func && !checked;
                  let status = null;
                  if (checked && isActive) status = func === type.stack[pi] ? "correct" : "wrong";
                  const hint = open && (selFunc || isSel);
                  return (
                    <div key={pi} onClick={() => tapSlot(pi)}
                      style={{
                        minHeight: 72, borderRadius: 14, padding: 10,
                        cursor: isActive ? "pointer" : "default",
                        background: isSel ? "#e6f0fc" : hint ? "#eef5fd" : isActive ? "#fdf6ef" : "#ece0d2",
                        border: `2.5px ${func ? "solid" : "dashed"} ${
                          status === "correct" ? OK : status === "wrong" ? NG : (isSel || hint) ? BLUE : isActive ? INK : "#cdbba6"}`,
                        opacity: isActive ? 1 : 0.5,
                      }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: isSel ? BLUE : "#a98869" }}>{pos.n}. {pos.jp}</div>
                      {func ? (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span style={{ ...tileColors(func, status, false), display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "5px 12px", borderRadius: 10, fontWeight: 900, fontSize: 16 }}>{func}</span>
                          {status === "wrong" && <span style={{ fontSize: 10, fontWeight: 800, color: NG }}>正 {type.stack[pi]}</span>}
                        </div>
                      ) : (open && <div style={{ marginTop: 10, fontSize: 11, fontWeight: 800, color: hint ? BLUE : "#cdb9a3" }}>{hint ? "ここに入れる" : "えらぶ"}</div>)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 機能 */}
        <div className="p-3.5 mb-4" style={{ ...panel, borderRadius: 18, boxShadow: `3px 3px 0 ${INK}`, ...(selSlot != null ? { outline: `2px dashed ${BLUE}`, outlineOffset: 3 } : {}) }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em", color: "#bd9270", marginBottom: 10 }}>FUNCTIONS</div>
          <div className="grid grid-cols-4 gap-3" style={{ gridAutoRows: "66px" }}>
            {ALL8.map((f) => {
              if (placedFuncs.includes(f)) return <div key={f} style={{ opacity: 0 }} />;
              return (
                <button key={f} onClick={() => tapPool(f)}
                  className="flex flex-col items-center justify-center select-none"
                  style={{ ...tileColors(f, null, selFunc === f), borderRadius: 14 }}>
                  <span style={{ fontWeight: 900, fontSize: 20, lineHeight: 1 }}>{f}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, marginTop: 3, opacity: 0.78 }}>{FUNCTIONS[f].jp}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 結果 */}
        {checked && (
          <div className="mb-2.5 text-center"
            style={{
              borderRadius: 14, padding: "12px", fontWeight: 800, fontSize: 14,
              background: allCorrect ? "#c9efe4" : revealed ? "#fdf6ef" : "#f9d6cf",
              color: allCorrect ? "#1f9b7d" : revealed ? "#9c7a5b" : "#c3422f",
              border: `2.5px solid ${allCorrect ? OK : revealed ? INK : NG}`,
              boxShadow: `3px 3px 0 ${allCorrect ? OK : revealed ? INK : NG}`,
            }}>
            {allCorrect ? "CLEAR ✦ せいかい" : revealed ? `${type.code} はこの並び` : "ずれてるよ。赤を直す？答えを見る？"}
          </div>
        )}

        {/* クアドラ・恋愛タイプ */}
        {checked && (allCorrect || revealed) && (
          <div className="mb-3 p-3.5" style={{ ...panel, borderRadius: 18, boxShadow: `3px 3px 0 ${INK}` }}>
            <div className="grid grid-cols-2 gap-3">
              <div style={{ borderRadius: 12, padding: "12px 10px", textAlign: "center", background: "#cfe6fb", border: `2px solid ${INK}` }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".1em", color: "#3877ac" }}>QUADRA</div>
                <div style={{ fontWeight: 900, fontSize: 17, marginTop: 3 }}>{QUADRA[type.quadra]}</div>
                <div style={{ fontSize: 10, color: "#6892b5", marginTop: 1 }}>{type.quadra}</div>
              </div>
              <div style={{ borderRadius: 12, padding: "12px 10px", textAlign: "center", background: "#ffd6d6", border: `2px solid ${INK}` }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".1em", color: "#c14a52" }}>恋愛タイプ</div>
                <div style={{ fontWeight: 900, fontSize: 17, marginTop: 3 }}>{eros}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, textAlign: "center", marginTop: 10, color: "#9c7a5b" }}>
              かみ合う相手は <span style={{ color: "#c14a52", fontWeight: 900 }}>{EROS_PAIR[eros]}</span>
            </div>
          </div>
        )}

        {/* 操作 */}
        <div className="grid grid-cols-2 gap-3">
          {!checked ? (
            <>
              <button onClick={check} disabled={!allFilled}
                style={{
                  borderRadius: 999, padding: "13px", fontWeight: 900, fontSize: 14,
                  background: allFilled ? OK : "#e7dccb",
                  color: allFilled ? "#fdf6ef" : "#bd9270",
                  border: `2.5px solid ${allFilled ? INK : "#cdbba6"}`,
                  boxShadow: allFilled ? `3px 3px 0 ${INK}` : "none",
                }}>
                答え合わせ
              </button>
              <button onClick={showAnswer}
                style={{ borderRadius: 999, padding: "13px", fontWeight: 900, fontSize: 14, background: "#fdf6ef", color: INK, border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}>
                答えを見る
              </button>
            </>
          ) : (
            <button onClick={nextType} className="col-span-2"
              style={{ borderRadius: 999, padding: "14px", fontWeight: 900, fontSize: 14, background: BLUE, color: "#fdf6ef", border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}>
              NEXT →
            </button>
          )}
        </div>
        {!checked && (
          <button onClick={clearBoard}
            className="w-full mt-3"
            style={{ borderRadius: 999, padding: "9px", fontSize: 12, fontWeight: 800, background: "transparent", color: "#9c7a5b", border: `2px solid #cdbba6` }}>
            ぜんぶ外す
          </button>
        )}

        {/* クレジット */}
        <div className="flex justify-center mt-5">
          <span style={{ fontSize: 11, fontWeight: 800, padding: "6px 14px", borderRadius: 999, background: "#fdf6ef", border: `2px solid ${INK}`, boxShadow: `2px 2px 0 ${INK}`, color: INK }}>
            © @fishfishstory
          </span>
        </div>
      </div>
    </div>
  );
}
