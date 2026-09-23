import React from "react";

const QuizIcon=()=>(<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{width:"60%",height:"60%"}}><path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const DeckIcon=({front})=>(<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{width:"60%",height:"60%"}}>
  <rect x="3.5" y="4.5" width="12" height="16" rx="2.2" transform="rotate(-14 9.5 12.5)" stroke="currentColor" strokeWidth="2"/>
  <rect x="8.5" y="3.5" width="12" height="16" rx="2.2" transform="rotate(14 14.5 11.5)" stroke="currentColor" strokeWidth="2" fill={front}/></svg>);

const pill={display:"inline-block",padding:"4px 10px",borderRadius:"var(--radius-pill)",fontSize:"11px",fontWeight:"var(--weight-bold)",lineHeight:1.3};

function TodayPill({done,correct,total}){
  if(done) return <span style={{...pill,background:"var(--success-soft)",color:"var(--success)"}}>{"\u2713"} Today</span>;
  if(!Number(total)) return null;
  return <span style={{...pill,background:"transparent",border:"var(--border-width) dashed var(--line)",color:"var(--muted)"}}>{correct}/{total} today</span>;
}

export function BoardTile({variant="due",kind="quiz",title,todayCorrect=0,todayTotal=0,todayDone=false,due=0,mastered=0,completed=0,total=0,percent=0,dailyPercent=0,onClick,style,...rest}){
  const isDone=todayDone===true||todayDone==="true";
  const iconBase={display:"inline-grid",placeItems:"center",width:24,height:24,border:"var(--border-width) solid var(--border-ink)",borderRadius:5,background:"var(--surface)",color:"var(--ink)"};
  const common={position:"relative",display:"flex",flexDirection:"column",padding:16,border:"var(--border-width) solid var(--border-ink)",color:"var(--ink)",textAlign:"left",font:"inherit",cursor:onClick?"pointer":undefined};
  const Icon=({bg,quiet,s})=><span style={{...iconBase,...(quiet?{width:22,height:22,borderColor:"var(--line)"}:null),...(bg?{background:bg}:null),...s}}>{kind==="deck"?<DeckIcon front={bg||"var(--surface)"}/>:<QuizIcon/>}</span>;
  const h2=(size,lh)=><h2 style={{margin:"8px 0 4px",fontFamily:"var(--font-display)",fontSize:size,fontWeight:600,lineHeight:lh}}>{title}</h2>;
  const today=<TodayPill done={isDone} correct={todayCorrect} total={todayTotal}/>;

  if(variant==="pinned"){
    const p=Number(dailyPercent)||0;
    return (
      <div role={onClick?"button":undefined} onClick={onClick} className={onClick?"qs-press":undefined}
        style={{...common,borderRadius:"16px 26px 12px 32px",background:"var(--surface)",boxShadow:"var(--hard-shadow)",padding:18,...style}} {...rest}>
        <span style={{display:"flex",alignItems:"center",gap:6,alignSelf:"flex-start"}}>
          <span style={{...pill,background:"var(--sun)",color:"var(--ink)"}}>In progress</span>{today}
        </span>
        <div style={{display:"grid",placeItems:"center",width:56,height:56,marginTop:12,borderRadius:"50%",background:`conic-gradient(var(--primary) ${p}%, var(--line) ${p}%)`}}>
          <div style={{display:"grid",placeItems:"center",width:38,height:38,borderRadius:"50%",background:"var(--surface)",fontSize:12,fontWeight:700}}>{p}%</div>
        </div>
        {h2("21px",1.1)}
        <p style={{margin:0,color:"var(--muted)",fontSize:13}}>Today: {todayCorrect} of {Number(todayTotal)||"\u2013"} correct · {completed} of {total} total done</p>
        <Icon bg="var(--primary-soft)" s={{position:"absolute",top:18,right:18,width:28,height:28}}/>
      </div>
    );
  }
  if(variant==="quiet"){
    const p=Number(percent)||0;
    return (
      <div role={onClick?"button":undefined} onClick={onClick}
        style={{...common,borderRadius:14,borderColor:"var(--line)",background:"var(--panel-soft)",...style}} {...rest}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
          <Icon quiet/>
          <span style={{display:"flex",alignItems:"center",gap:6}}>{today}<span style={{color:"var(--muted)",fontSize:11,fontWeight:600}}>nothing due</span></span>
        </div>
        {h2("16px",1.15)}
        <div style={{height:6,marginTop:10,border:"var(--border-width) solid var(--line)",borderRadius:4,background:"var(--surface)",overflow:"hidden"}}>
          <span style={{display:"block",height:"100%",width:p+"%",background:p>=90?"var(--sage)":"var(--primary)"}}/>
        </div>
      </div>
    );
  }
  const m=Number(total)?Math.round(Number(mastered)/Number(total)*100):0;
  return (
    <div role={onClick?"button":undefined} onClick={onClick} className={onClick?"qs-press":undefined}
      style={{...common,minHeight:150,borderRadius:"26px 14px 30px 14px",background:"var(--surface)",boxShadow:"var(--hard-shadow)",...style}} {...rest}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
        <Icon/>
        <span style={{display:"flex",alignItems:"center",gap:6}}>{today}<span style={{...pill,background:"var(--clay-soft)",color:"var(--clay)"}}>{due} due</span></span>
      </div>
      {h2("18px",1.1)}
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:"auto"}}>
        <div style={{height:8,border:"var(--border-width) solid var(--border-ink)",borderRadius:4,background:"var(--surface)",overflow:"hidden"}}>
          <span style={{display:"block",height:"100%",width:m+"%",background:"var(--primary)"}}/>
        </div>
        <span style={{color:"var(--muted)",fontSize:13}}>{mastered} of {total} mastered</span>
      </div>
    </div>
  );
}
