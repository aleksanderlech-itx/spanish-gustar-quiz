import React from "react";

const DEFAULT_WEEK=[{letter:"Lu",status:"done"},{letter:"Ma",status:"done"},{letter:"Mi",status:"done"},{letter:"Ju",status:"done"},
  {letter:"Vi",status:"today",doneCount:2,total:5},{letter:"S\u00e1",status:"future"},{letter:"Do",status:"future"}];

export function StreakStrip({days=12,todayDone=2,todayTotal=5,week=DEFAULT_WEEK,style,...rest}){
  return (
    <section aria-label={`${days} day streak`} style={{padding:"16px 18px",border:"var(--border-width) solid var(--border-ink)",
      borderRadius:"16px 24px 12px 32px",background:"var(--streak-panel-bg)",borderColor:"var(--streak-panel-border)",...style}} {...rest}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <strong style={{color:"var(--streak-count-ink)",fontFamily:"var(--font-display)",fontSize:40,fontWeight:600,lineHeight:.9}}>{days}</strong>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          <span style={{color:"var(--ink)",fontSize:15,fontWeight:700}}>{"d\u00edas seguidos"}</span>
          <span style={{color:"var(--muted)",fontSize:13}}>Goal: a round in all {todayTotal} activities · {todayDone}/{todayTotal} today</span>
        </div>
      </div>
      <div role="list" style={{display:"flex",gap:5,marginTop:14}}>
        {week.map((d,i)=>{
          const fill=d.status==="today"&&d.total?Math.round(d.doneCount/d.total*100):0;
          const s=d.status==="done"?{border:"var(--border-width) solid var(--streak-day-border)",background:"var(--sun)"}:
            d.status==="today"?{border:"var(--border-width) dashed var(--streak-today-border)",background:`linear-gradient(90deg, var(--sun) ${fill}%, transparent ${fill}%)`}:
            {border:"var(--border-width) var(--streak-future-style) var(--line)",background:"transparent"};
          return <span key={i} role="listitem" style={{flex:1,height:22,borderRadius:4,...s}}/>;
        })}
      </div>
      <div aria-hidden="true" style={{display:"flex",gap:5,marginTop:4}}>
        {week.map((d,i)=><span key={i} style={{flex:1,color:"var(--muted)",fontSize:10,textAlign:"center"}}>{d.letter}</span>)}
      </div>
    </section>
  );
}
