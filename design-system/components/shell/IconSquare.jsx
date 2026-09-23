import React from "react";

const SunIcon=()=>(
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{width:"55%",height:"55%"}}>
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
);
const MoonIcon=()=>(
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{width:"55%",height:"55%"}}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
  </svg>
);
const Hamburger=()=>(
  <span aria-hidden="true" style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:"3px",width:"18px"}}>
    <span style={{height:"2px",background:"currentColor"}}/><span style={{height:"2px",background:"currentColor"}}/><span style={{height:"2px",background:"currentColor"}}/>
  </span>
);

/* The 44px bordered square used for header actions (repo: .mode-switch, .topic-back, .round-back). */
export function IconSquare({icon="back",size=44,radius=12,label,style,children,...rest}){
  const glyph=icon==="menu"?<Hamburger/>:icon==="sun"?<SunIcon/>:icon==="moon"?<MoonIcon/>:
    icon==="close"?"\u2715":<span aria-hidden="true" style={{fontSize:"20px",fontWeight:"var(--weight-bold)"}}>{"\u2190"}</span>;
  return (
    <button type="button" aria-label={label} className="qs-press-sm"
      style={{display:"inline-grid",placeItems:"center",width:size,minHeight:size,height:size,flex:"none",padding:0,
        border:"var(--border-width) solid var(--border-ink)",borderRadius:radius,background:"var(--surface-card)",
        color:"var(--text-body)",cursor:"pointer",...style}} {...rest}>
      {children??glyph}
    </button>
  );
}
