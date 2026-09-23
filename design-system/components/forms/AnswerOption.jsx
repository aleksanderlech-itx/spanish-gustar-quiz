import React from "react";

/* Repo: .round-option */
const skins={
  idle:{background:"var(--surface)",border:"var(--border-ink)",shadow:"var(--hard-shadow)"},
  correct:{background:"var(--sage-soft)",border:"var(--sage)",shadow:"2px 2px 0 var(--shadow-col)"},
  wrong:{background:"var(--danger-soft)",border:"var(--danger)",shadow:"2px 2px 0 var(--shadow-col)"},
  other:{background:"var(--panel-soft)",border:"var(--line)",shadow:"none"}
};

export function AnswerOption({state="idle",disabled=false,style,children,...rest}){
  const s=skins[state]||skins.idle;
  return (
    <button type="button" disabled={disabled} className={state==="idle"&&!disabled?"qs-press":undefined}
      style={{width:"100%",minHeight:56,padding:"0 16px",textAlign:"left",cursor:disabled?"default":"pointer",
        border:`var(--border-width) solid ${s.border}`,borderRadius:10,background:s.background,color:"var(--ink)",
        boxShadow:s.shadow,fontFamily:"var(--font-body)",fontSize:17,fontWeight:600,...style}} {...rest}>
      {state==="correct"?"\u2713 ":state==="wrong"?"\u2715 ":""}{children}
    </button>
  );
}
