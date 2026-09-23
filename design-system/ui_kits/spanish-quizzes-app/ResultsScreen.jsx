import React from "react";
import {Chip} from "../../components/core/Chip.jsx";

const eyebrow={margin:0,color:"var(--muted)",fontSize:12,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase"};
const clay={margin:0,color:"var(--clay)",fontSize:12,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase"};

/* Repo: app/results.tsx + app/support-prompt.tsx */
export function ResultsScreen({score=0,total=0,rules=[],streak=12,hasMissed,onPractise,onBoard}){
  const percent=total?Math.round(score/total*100):0;
  const headline=total===0?"Round skipped.":score>=total-1?"Casi perfecto.":score>=total/2?"Solid round.":"Worth another pass.";
  const btn={display:"flex",alignItems:"center",justifyContent:"center",border:"var(--border-width) solid var(--border-ink)",borderRadius:10,fontFamily:"var(--font-display)",fontWeight:600,cursor:"pointer",width:"100%"};
  return (
    <main style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto",scrollbarWidth:"none",padding:"22px 10px 42px"}}>
      <p style={clay}>Round complete</p>
      <h1 style={{margin:"0 0 18px",fontFamily:"var(--font-display)",fontSize:30,fontWeight:600,lineHeight:1.05}}>{headline}</h1>
      <section style={{padding:20,marginBottom:18,border:"var(--border-width) solid var(--border-ink)",borderRadius:"16px 26px 12px 32px",background:"var(--surface)",boxShadow:"var(--hard-shadow)"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <strong style={{fontFamily:"var(--font-display)",fontSize:52,fontWeight:600,lineHeight:.9}}>{score}</strong>
          <span style={{color:"var(--muted)",fontSize:17}}>of {total} correct</span>
        </div>
        <div aria-hidden="true" style={{height:12,marginTop:14,border:"var(--border-width) solid var(--border-ink)",borderRadius:4,background:"var(--surface)",overflow:"hidden"}}>
          <span style={{display:"block",height:"100%",width:percent+"%",background:"var(--sage)"}}/>
        </div>
        {streak>0?<p style={{margin:"10px 0 0",color:"var(--muted)",fontSize:14}}>Streak extended to {streak} days.</p>:null}
      </section>
      {rules.length?(
        <section style={{padding:16,marginBottom:18,borderRadius:"26px 14px 30px 14px",background:"var(--panel)"}}>
          <p style={eyebrow}>Added to your mistake notebook</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>{rules.map(r=><Chip key={r} tone="clay" size="sm">{r}</Chip>)}</div>
          <p style={{margin:"10px 0 0",color:"var(--muted)",fontSize:13}}>These come back as cards tomorrow, and in your next round here.</p>
        </section>
      ):null}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:"auto",paddingTop:18}}>
        {hasMissed?<button type="button" className="qs-press" onClick={onPractise} style={{...btn,minHeight:56,background:"var(--paper-white)",color:"var(--ink)",fontSize:18,boxShadow:"var(--hard-shadow)"}}>Practise the misses</button>:null}
        <button type="button" className="qs-press" onClick={onBoard} style={{...btn,minHeight:50,background:"var(--surface)",color:"var(--ink)",fontSize:16,boxShadow:"var(--hard-shadow)"}}>Back to board</button>
      </div>
      <section style={{padding:14,marginTop:18,border:"var(--border-width) dashed var(--line)",borderRadius:12}}>
        <p style={{margin:0,fontFamily:"var(--font-display)",fontSize:16,fontWeight:600}}>If you liked it, consider supporting this project.</p>
      </section>
    </main>
  );
}
