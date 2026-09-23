import React from "react";

export function ProgressBar({value=0,max=100,label,valueLabel,fill="var(--action-primary)",height="12px",style,...rest}){
  const pct=Math.max(0,Math.min(100,(value/(max||1))*100));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"8px",...style}} {...rest}>
      {(label||valueLabel)?(
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"var(--text-body-sm)",fontWeight:"var(--weight-semibold)"}}>
          <span>{label}</span><span>{valueLabel}</span>
        </div>
      ):null}
      <div role="progressbar" aria-valuenow={value} aria-valuemax={max}
        style={{height,border:"var(--border-width) solid var(--border-ink)",borderRadius:"var(--radius-sm)",
          background:"var(--surface-card)",overflow:"hidden"}}>
        <div style={{width:pct+"%",height:"100%",background:fill}}/>
      </div>
    </div>
  );
}
