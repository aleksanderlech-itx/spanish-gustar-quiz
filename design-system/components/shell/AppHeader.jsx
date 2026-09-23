import React from "react";

export function AppHeader({title,mark,badge,onBack,style,...rest}){
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",
      padding:"14px 18px",borderBottom:"var(--border-width) solid var(--border-ink)",
      background:"var(--surface-card)",...style}} {...rest}>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        {onBack?<button type="button" onClick={onBack} aria-label="Back"
          style={{border:0,background:"none",color:"var(--text-body)",fontSize:"20px",lineHeight:1,
            cursor:"pointer",padding:0,minWidth:"var(--touch-min)",minHeight:"var(--touch-min)",textAlign:"left"}}>{"\u2190"}</button>:null}
        {mark?<span style={{display:"inline-flex",flex:"none"}}>{mark}</span>:null}
        <span style={{fontFamily:"var(--font-display)",fontSize:"17px",fontWeight:"var(--weight-semibold)"}}>{title}</span>
      </div>
      {badge!=null?(
        <span style={{width:"34px",height:"34px",border:"var(--border-width) solid var(--border-ink)",
          borderRadius:"var(--radius-pill)",background:"var(--state-streak-wash)",display:"grid",
          placeItems:"center",fontSize:"var(--text-caption)",fontWeight:"var(--weight-bold)"}}>{badge}</span>
      ):null}
    </div>
  );
}
