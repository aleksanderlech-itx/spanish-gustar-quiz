import React from "react";
import {QuizHeader} from "../../components/shell/QuizHeader.jsx";
import {AnswerOption} from "../../components/forms/AnswerOption.jsx";
import {InlineBlank} from "../../components/forms/InlineBlank.jsx";
import {Input} from "../../components/forms/Input.jsx";

const clay={margin:0,color:"var(--clay)",fontSize:12,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase"};
const ACCENTS=["\u00e1","\u00e9","\u00ed","\u00f3","\u00fa","\u00f1"];
const norm=s=>(s||"").trim().toLowerCase();

/* Repo: app/round.tsx — Choose and Type modes */
export function RoundScreen({eyebrow,question,index,total,mode="choose",picked,submitted,typed="",onTyped,onCommit,onNext,onSkip,onBack}){
  const isLast=index===total-1;
  const correct=picked!=null&&norm(picked)===norm(question.answer);
  const state=c=>!submitted?"idle":c===question.answer?"correct":c===picked?"wrong":"other";
  const primaryLabel=mode==="type"&&!submitted?"Check":!submitted?"Pick an answer":isLast?"See results":"Next question";
  const primaryDisabled=mode==="type"?(!submitted&&!typed.trim()):!submitted;
  const primary=mode==="type"&&!submitted?()=>typed.trim()&&onCommit(typed):onNext;
  const blank=submitted?question.answer:mode==="type"?(typed||question.infinitive):question.infinitive;
  return (
    <main style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,paddingTop:22}}>
      <QuizHeader current={index+1} total={total} onBack={onBack}/>
      <section style={{flex:"none",margin:"14px 18px 0",padding:18,border:"var(--border-width) solid var(--border-ink)",borderRadius:"16px 26px 12px 32px",background:"var(--surface)",boxShadow:"var(--hard-shadow)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <p style={clay}>{eyebrow}</p>
          <span style={{padding:"4px 10px",borderRadius:"var(--radius-pill)",background:"var(--primary-soft)",color:"var(--ink)",fontSize:12,fontWeight:700}}>{question.level}</span>
        </div>
        <p lang="es" style={{margin:0,fontSize:23,fontWeight:700,lineHeight:1.4}}>
          {question.before} <InlineBlank value={blank} filled={!!submitted} width="86px"/> {question.after}
        </p>
        <p lang="en" style={{margin:"8px 0 0",color:"var(--muted)",fontSize:16,lineHeight:1.45}}>{question.en}</p>
      </section>
      <section style={{display:"flex",flex:1,flexDirection:"column",justifyContent:"flex-end",gap:10,padding:"14px 18px",overflowY:"auto",scrollbarWidth:"none"}}>
        {!submitted?<button type="button" style={{display:"flex",alignItems:"center",width:"100%",minHeight:48,padding:"0 4px",border:"var(--border-width) dashed var(--line)",borderRadius:10,background:"none",color:"var(--muted)",fontFamily:"inherit",fontSize:13,textAlign:"left",cursor:"pointer"}}>Stuck? Open the conjugation chart</button>:null}
        {mode==="choose"?question.choices.map(c=>(
          <AnswerOption key={c} state={state(c)} disabled={!!submitted} onClick={()=>onCommit(c)}>{c}</AnswerOption>
        )):(<>
          <Input lang="es" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="Type the missing form"
            aria-label={`Type your answer for question ${index+1}`} value={submitted?picked:typed} disabled={!!submitted}
            state={submitted?(correct?"correct":"wrong"):undefined}
            onChange={e=>onTyped&&onTyped(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();typed.trim()&&onCommit(typed);}}}/>
          <div role="group" aria-label="Accented letters" style={{display:"flex",gap:6,overflowX:"auto",padding:"8px 2px",borderTop:"var(--border-width) solid var(--line)",background:"var(--panel)"}}>
            {ACCENTS.map(ch=><button key={ch} type="button" disabled={!!submitted} onClick={()=>onTyped&&onTyped(typed+ch)}
              style={{minWidth:40,minHeight:38,flex:"none",border:"var(--border-width) solid var(--border-ink)",borderRadius:8,background:"var(--sun-soft)",color:"var(--ink)",fontSize:17,cursor:"pointer"}}>{ch}</button>)}
          </div>
        </>)}
        {submitted?(
          <div style={{padding:14,border:"var(--border-width) solid var(--border-ink)",borderRadius:12,background:correct?"var(--sage-soft)":"var(--clay-soft)"}}>
            <span style={{display:"block",marginBottom:6,fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:correct?"var(--sage)":"var(--clay)"}}>{correct?"Correct":`Not quite \u2014 ${question.answer}`}</span>
            <p style={{margin:0,fontSize:15,lineHeight:1.55}}>{question.explanation}</p>
          </div>
        ):null}
      </section>
      <footer style={{display:"flex",flex:"none",gap:10,padding:"14px 18px",borderTop:"var(--border-width) solid var(--border-ink)",background:"var(--surface)"}}>
        <button type="button" onClick={onSkip} style={{flex:"none",minHeight:56,padding:"0 18px",border:"var(--border-width) solid var(--border-ink)",borderRadius:10,background:"var(--surface)",color:"var(--ink)",fontFamily:"var(--font-display)",fontSize:16,fontWeight:600,cursor:"pointer"}}>Skip</button>
        <button type="button" disabled={primaryDisabled} onClick={primary} className={primaryDisabled?undefined:"qs-press"}
          style={primaryDisabled?{flex:1,minHeight:56,border:"var(--border-width) solid var(--line)",borderRadius:10,background:"var(--panel)",color:"var(--muted)",fontFamily:"var(--font-display)",fontSize:17,fontWeight:600}
            :{flex:1,minHeight:56,border:"var(--border-width) solid var(--border-ink)",borderRadius:10,background:"var(--primary)",color:"var(--primary-ink)",fontFamily:"var(--font-display)",fontSize:17,fontWeight:600,boxShadow:"var(--hard-shadow)",cursor:"pointer"}}>{primaryLabel}</button>
      </footer>
    </main>
  );
}
