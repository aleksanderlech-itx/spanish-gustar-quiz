import React from "react";

/* Repo: .board-ring / .topic-summary-ring — conic primary over --line, surface disc, no border. */
export function ScoreRing({percent=0,size=56,style,...rest}){
  const p=Math.max(0,Math.min(100,Number(percent)||0));
  const big=size>=80;
  const inner=big?Math.round(size*60/84):Math.round(size*38/56);
  return (
    <div role="img" aria-label={`${p}%`} style={{display:"grid",placeItems:"center",width:size,height:size,flex:"none",borderRadius:"50%",
      background:`conic-gradient(var(--primary) ${p}%, var(--line) ${p}%)`,...style}} {...rest}>
      <div style={{display:"grid",placeItems:"center",width:inner,height:inner,borderRadius:"50%",background:"var(--surface)",
        color:"var(--ink)",fontSize:big?19:12,fontWeight:700}}>{p}%</div>
    </div>
  );
}
