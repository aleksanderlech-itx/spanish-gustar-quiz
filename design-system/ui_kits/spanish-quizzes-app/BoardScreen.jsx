import React from "react";
import {IconSquare} from "../../components/shell/IconSquare.jsx";
import {Logo} from "../../components/shell/Logo.jsx";
import {BoardTile} from "../../components/shell/BoardTile.jsx";
import {StreakStrip} from "../../components/progress/StreakStrip.jsx";

const eyebrow={margin:0,color:"var(--muted)",fontSize:12,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase"};

/* Repo: app/quiz-selector.tsx, mobile layout */
export function BoardScreen({pinned,tiles=[],theme="light",onToggleTheme,onMenu,onOpen}){
  return (
    <main style={{flex:1,overflowY:"auto",scrollbarWidth:"none",padding:"22px 11px 42px"}}>
      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <IconSquare icon="menu" label="Open menu" onClick={onMenu}/>
        <h1 style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flex:1,margin:0,fontFamily:"var(--font-display)",fontSize:17,fontWeight:600}}>
          <Logo size={24}/><span>Spanish Quizzes</span>
        </h1>
        <IconSquare icon={theme==="dark"?"sun":"moon"} label={theme==="dark"?"Switch to light mode":"Switch to dark mode"} onClick={onToggleTheme}/>
      </header>
      <StreakStrip days={12} todayDone={2} todayTotal={5} style={{marginBottom:22}}/>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:12,marginBottom:10}}>
        <p style={eyebrow}>Today's board</p>
        <span style={{color:"var(--muted)",fontSize:12}}>sized by what's due</span>
      </div>
      {pinned?<BoardTile variant="pinned" {...pinned} onClick={()=>onOpen&&onOpen(pinned.id)} style={{marginBottom:22}}/>:null}
      <div style={{display:"flex",alignItems:"baseline",marginTop:4,marginBottom:10}}><p style={eyebrow}>Other activities</p></div>
      <section style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {tiles.map(t=><BoardTile key={t.id} {...t} onClick={()=>onOpen&&onOpen(t.id)}/>)}
      </section>
      <p style={{margin:"18px 0 0",color:"var(--muted)",fontSize:13,lineHeight:1.5}}>Progress, filters, scoring, audio and review history remain attached to each quiz.</p>
    </main>
  );
}
