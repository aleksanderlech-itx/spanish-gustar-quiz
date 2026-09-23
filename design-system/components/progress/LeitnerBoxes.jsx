import React from "react";

const INTERVALS=["Every session","1 day","3 days","7 days"];

export function LeitnerBoxes({counts=[0,0,0,0],note=true,style,...rest}){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,...style}} {...rest}>
      <section aria-label="Leitner box progress" style={{display:"grid",gridTemplateColumns:"repeat(4, minmax(0, 1fr))",
        border:"var(--border-width) solid var(--border-ink)",borderRadius:"16px 24px 12px 32px",background:"var(--paper-white)",overflow:"hidden"}}>
        {counts.slice(0,4).map((c,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",gap:2,padding:"12px 10px",borderLeft:i?"var(--border-width-hair) solid var(--line)":0}}>
            <span style={{color:"var(--muted)",fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase"}}>Box {i+1}</span>
            <strong style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:600,lineHeight:1.1}}>{c}</strong>
            <span style={{color:"var(--muted)",fontSize:12}}>{INTERVALS[i]}</span>
          </div>
        ))}
      </section>
      {note?<p style={{margin:0,padding:"12px 14px",border:"var(--border-width) solid var(--border-ink)",borderRadius:"16px 24px 12px 32px",
        background:"var(--paper-white)",fontSize:14,lineHeight:1.55}}><strong>How it works:</strong> Box 1 cards are reviewed immediately. Boxes 2{"\u2013"}4 return after 1, 3 and 7 days. One wrong answer sends a card back to Box 1.</p>:null}
    </div>
  );
}
