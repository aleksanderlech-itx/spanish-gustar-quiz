import React from "react";
import {IconSquare} from "../../components/shell/IconSquare.jsx";
import {FlashCard} from "../../components/shell/FlashCard.jsx";
import {LeitnerBoxes} from "../../components/progress/LeitnerBoxes.jsx";

const dotBg={current:"var(--clay-soft)",next:"var(--sun-soft)",mastered:"var(--sage-soft)",unreached:"var(--surface)"};
const boxState=(b,cur)=>b===cur?"current":b===cur+1?"next":b===4?"mastered":"unreached";
const dueCopy=b=>({1:"due now",2:"due in 1 day",3:"due in 3 days",4:"due in 7 days"})[b];

/* Repo: app/flashcards.tsx */
export function FlashcardsScreen({cards=[],index=0,revealed=false,difficulty="all",counts,onDifficulty,onReveal,onGrade,onBack}){
  const card=cards[index];
  const box=card?card.box:1;
  const bigBtn={flex:1,minHeight:54,border:"var(--border-width) solid var(--border-ink)",borderRadius:10,boxShadow:"var(--hard-shadow)",cursor:"pointer"};
  return (
    <main style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto",scrollbarWidth:"none",padding:"22px 10px 42px"}}>
      <header style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <IconSquare icon="back" size={40} label="Back to board" onClick={onBack}/>
        <span style={{flex:1,color:"var(--muted)",fontSize:13,fontWeight:700}}>Card {index+1} of {cards.length}</span>
        <div aria-label="Leitner box progress" style={{display:"flex",gap:4}}>
          {[1,2,3,4].map(b=><span key={b} style={{width:15,height:15,border:"var(--border-width) solid var(--border-ink)",background:dotBg[boxState(b,box)]}}/>)}
        </div>
      </header>
      <div role="group" aria-label="Filter by difficulty" style={{display:"flex",gap:6,marginBottom:14}}>
        {["all","easy","medium","hard"].map(d=>(
          <button key={d} type="button" aria-pressed={difficulty===d} onClick={()=>onDifficulty&&onDifficulty(d)}
            style={{flex:1,minHeight:36,border:"var(--border-width) solid var(--border-ink)",borderRadius:10,cursor:"pointer",
              background:difficulty===d?"var(--clay-soft)":"var(--surface)",color:"var(--ink)",fontFamily:"var(--font-body)",fontSize:13,fontWeight:700}}>{d[0].toUpperCase()+d.slice(1)}</button>
        ))}
      </div>
      <section aria-live="polite" style={{display:"flex",flexDirection:"column",minHeight:420}}>
        <FlashCard term={card.term} meaning={card.meaning} example={card.example} exampleEnglish={card.exampleEnglish}
          meta={`Box ${box} · ${dueCopy(box)}`} revealed={revealed} onReveal={onReveal}/>
        <footer style={{display:"flex",gap:10,marginTop:16}}>
          {!revealed?(
            <button type="button" className="qs-press" onClick={onReveal} style={{...bigBtn,background:"var(--primary)",color:"var(--primary-ink)",fontFamily:"var(--font-display)",fontSize:17,fontWeight:600}}>Reveal</button>
          ):(<>
            <button type="button" aria-label="Not OK" className="qs-press" onClick={()=>onGrade(false)} style={{...bigBtn,background:"var(--danger-soft)",color:"var(--danger)",fontSize:26,fontWeight:900,WebkitTextStroke:"1px currentColor"}}><span aria-hidden="true">{"\u2716"}</span></button>
            <button type="button" aria-label="OK" className="qs-press" onClick={()=>onGrade(true)} style={{...bigBtn,background:"var(--success-soft)",color:"var(--ink)",fontSize:26,fontWeight:900,WebkitTextStroke:"1px currentColor"}}><span aria-hidden="true">{"\u2714"}</span></button>
          </>)}
        </footer>
      </section>
      <LeitnerBoxes counts={counts} style={{marginTop:22}}/>
    </main>
  );
}
