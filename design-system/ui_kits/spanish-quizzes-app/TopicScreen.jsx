import React from "react";
import {IconSquare} from "../../components/shell/IconSquare.jsx";
import {ScoreRing} from "../../components/progress/ScoreRing.jsx";
import {SegmentedControl} from "../../components/forms/SegmentedControl.jsx";
import {Select} from "../../components/forms/Select.jsx";

const eyebrow={margin:0,color:"var(--muted)",fontSize:12,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase"};
const clay={margin:0,color:"var(--clay)",fontSize:12,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase"};

/* Repo: app/topic-detail.tsx */
export function TopicScreen({title,percent=20,completed=12,total=60,accuracy=83,due=4,roundLength,mode,onRoundLength,onMode,onBack,onStart}){
  return (
    <main style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto",scrollbarWidth:"none",padding:"22px 10px 0"}}>
      <header style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <IconSquare icon="back" label="Back to board" onClick={onBack}/>
        <p style={clay}>Grammar quiz</p>
      </header>
      <h1 style={{margin:"0 0 16px",fontFamily:"var(--font-display)",fontSize:30,fontWeight:600,lineHeight:1.05}}>{title}</h1>
      <section style={{display:"flex",alignItems:"center",gap:16,padding:18,marginBottom:22,border:"var(--border-width) solid var(--border-ink)",borderRadius:"16px 26px 12px 32px",background:"var(--surface)",boxShadow:"var(--hard-shadow)"}}>
        <ScoreRing percent={percent} size={84}/>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <p style={{margin:0,fontSize:15,fontWeight:700}}>{completed} of {total} questions</p>
          <p style={{margin:0,color:"var(--muted)",fontSize:13,lineHeight:1.5}}>Accuracy {accuracy}% · {due} due today</p>
        </div>
      </section>
      <section style={{marginBottom:20}}>
        <p style={{...eyebrow,marginBottom:8}}>Round length</p>
        <div role="group" aria-label="Round length" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:8}}>
          {[5,10,20].map(n=>(
            <button key={n} type="button" aria-pressed={roundLength===n} onClick={()=>onRoundLength&&onRoundLength(n)}
              style={{minHeight:48,border:"var(--border-width) solid var(--border-ink)",borderRadius:10,cursor:"pointer",
                background:roundLength===n?"var(--primary-soft)":"var(--surface)",color:"var(--ink)",fontFamily:"var(--font-display)",fontSize:17,fontWeight:600}}>{n}</button>
          ))}
        </div>
      </section>
      <section style={{marginBottom:20}}>
        <p style={{...eyebrow,marginBottom:8}}>Answer mode</p>
        <SegmentedControl options={[{value:"choose",label:"Choose"},{value:"type",label:"Type"}]} value={mode} onChange={onMode}/>
        <p style={{margin:"8px 0 0",color:"var(--muted)",fontSize:12}}>{mode==="choose"?"Pick from three options. Fastest way through a round.":"You write the verb yourself \u2014 harder, and it sticks better."}</p>
      </section>
      <section style={{marginBottom:20}}>
        <p style={{...eyebrow,marginBottom:8}}>Filters</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Select id="lvl" label="Difficulty" options={[{value:"all",label:"All levels"},{value:"basic",label:"Basic"},{value:"intermediate",label:"Intermediate"},{value:"advanced",label:"Advanced"}]}/>
          <Select id="verb" label="Verb" options={[{value:"all",label:"All verbs"},"ir","preparar","salir","llegar","vivir"]}/>
        </div>
        <p style={{margin:"8px 0 0",color:"var(--muted)",fontSize:12}}>{total} sentences selected</p>
      </section>
      <a href="#" onClick={e=>e.preventDefault()} style={{display:"flex",alignItems:"center",gap:12,minHeight:52,padding:"0 14px",marginBottom:14,borderRadius:14,background:"var(--panel-soft)",color:"var(--ink)",textDecoration:"none"}}>
        <span aria-hidden="true" style={{display:"inline-grid",placeItems:"center",width:24,height:24,border:"var(--border-width) solid var(--border-ink)",borderRadius:5,background:"var(--surface)",fontSize:13}}>{"\u25A6"}</span>
        <span style={{flex:1,fontSize:15,fontWeight:600}}>Verb conjugation chart</span>
        <span aria-hidden="true" style={{color:"var(--muted)"}}>{"\u2192"}</span>
      </a>
      <footer style={{position:"sticky",bottom:0,marginTop:"auto",padding:"14px 0 16px",background:"var(--paper)"}}>
        <button type="button" onClick={onStart} className="qs-press"
          style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",minHeight:56,border:"var(--border-width) solid var(--border-ink)",borderRadius:10,
            background:"var(--primary)",color:"var(--primary-ink)",fontFamily:"var(--font-display)",fontSize:19,fontWeight:600,boxShadow:"var(--hard-shadow)",cursor:"pointer"}}>Start round of {roundLength}</button>
      </footer>
    </main>
  );
}
