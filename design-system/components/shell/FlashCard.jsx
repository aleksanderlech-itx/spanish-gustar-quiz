import React from "react";

const eyebrow={margin:0,color:"var(--clay)",fontSize:"12px",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase"};

export function FlashCard({term,meaning,example,exampleEnglish,meta,revealed=false,onSpeak,onReveal,style,...rest}){
  const speak=e=>{e.stopPropagation();onSpeak&&onSpeak();};
  const termRow=(
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <strong lang="es" style={{color:"var(--primary)",fontFamily:"var(--font-display)",fontSize:"clamp(34px, 9vw, 42px)",lineHeight:1.05,fontWeight:600}}>{term}</strong>
      <button type="button" aria-label={`Listen to ${term}`} onClick={speak}
        style={{display:"inline-grid",placeItems:"center",width:44,height:44,flex:"none",border:"var(--border-width) solid var(--border-ink)",borderRadius:"50%",background:"var(--sun-soft)",fontSize:18,cursor:"pointer",padding:0}}>{"\uD83D\uDD0A"}</button>
    </div>
  );
  const pill=meta?<span style={{alignSelf:"flex-start",marginTop:"auto",padding:"4px 10px",border:"var(--border-width-hair) solid var(--border-ink)",borderRadius:"var(--radius-pill)",background:"var(--panel-soft)",color:"var(--muted)",fontSize:12,fontWeight:600}}>{meta}</span>:null;
  return (
    <div role="button" tabIndex={0} aria-expanded={revealed} onClick={onReveal}
      style={{flex:1,display:"flex",flexDirection:"column",gap:20,padding:"24px 20px",border:"var(--border-width) solid var(--border-ink)",borderRadius:"18px 30px 14px 34px",background:"var(--paper-white)",boxShadow:"var(--hard-shadow)",cursor:"pointer",color:"var(--ink)",...style}} {...rest}>
      {revealed?(<>
        <p style={eyebrow}>Spanish {"\u2192"} English</p>{termRow}
        <div style={{height:2,background:"var(--ink)"}}/>
        <p lang="en" style={{margin:0,fontFamily:"var(--font-display)",fontSize:21,fontWeight:600}}>{meaning}</p>
        {example?<p lang="es" style={{margin:0,color:"var(--muted)",fontSize:18,lineHeight:1.55}}>{example}</p>:null}
        {exampleEnglish?<p lang="en" style={{margin:"-10px 0 0",color:"var(--muted)",fontSize:18,fontStyle:"italic",lineHeight:1.5,opacity:.85}}>{exampleEnglish}</p>:null}
        {pill}
      </>):(<>
        <p style={eyebrow}>Tap to reveal</p>{termRow}{pill}
      </>)}
    </div>
  );
}
