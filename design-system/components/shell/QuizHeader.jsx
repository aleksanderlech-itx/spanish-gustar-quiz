import React from "react";

export function QuizHeader({current=1,total=10,steps,onBack,style,...rest}){
  const n=Number(steps??total);
  return (
    <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"14px 18px 0",...style}} {...rest}>
      <button type="button" onClick={onBack} aria-label="Back to topic"
        style={{display:"inline-grid",placeItems:"center",width:"40px",height:"40px",flex:"none",
          border:"var(--border-width) solid var(--border-ink)",borderRadius:"12px",background:"var(--surface-card)",
          color:"var(--text-body)",fontSize:"20px",fontWeight:"var(--weight-bold)",cursor:"pointer",padding:0}}>{"\u2190"}</button>
      <div role="progressbar" aria-valuemin={1} aria-valuemax={n} aria-valuenow={current} style={{display:"flex",flex:1,gap:"4px"}}>
        {Array.from({length:n},(_,i)=>(
          <span key={i} style={{flex:1,height:"8px",border:"1.5px solid var(--border-ink)",borderRadius:"2px",
            background:i<current-1?"var(--action-primary)":i===current-1?"var(--state-streak)":"transparent"}}/>
        ))}
      </div>
      <span style={{flex:"none",color:"var(--text-muted)",fontSize:"var(--text-caption)",fontWeight:"var(--weight-bold)",whiteSpace:"nowrap"}}>{current}/{total}</span>
    </div>
  );
}
