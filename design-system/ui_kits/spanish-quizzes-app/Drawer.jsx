import React from "react";
import {Logo} from "../../components/shell/Logo.jsx";
import {IconSquare} from "../../components/shell/IconSquare.jsx";
import {Chip} from "../../components/core/Chip.jsx";

const row={display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",minHeight:52,padding:"0 14px",
  border:"var(--border-width) solid var(--border-ink)",borderRadius:10,background:"var(--paper)",color:"var(--ink)",
  fontFamily:"var(--font-body)",fontSize:15,fontWeight:600,cursor:"pointer",textAlign:"left"};
const panel={marginTop:-4,padding:"10px 14px",borderRadius:10,background:"var(--panel-soft)",color:"var(--muted)",fontSize:13,display:"flex",flexDirection:"column",gap:4};
const sub={margin:"10px 0 4px",color:"var(--ink)",fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase"};
const li={display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:8,padding:"4px 0",borderBottom:"var(--border-width-hair) solid var(--line)",fontSize:12};
const action={minHeight:44,border:"var(--border-width) solid var(--border-ink)",borderRadius:8,background:"var(--surface)",color:"var(--ink)",fontFamily:"var(--font-body)",fontSize:14,fontWeight:600,cursor:"pointer"};

/* Repo: app/drawer.tsx */
export function Drawer({onClose,notebook=[]}){
  const [open,setOpen]=React.useState(null);
  const t=k=>setOpen(o=>o===k?null:k);
  const arrow=k=><span aria-hidden="true">{open===k?"\uFE3F":"\u2192"}</span>;
  return (
    <div role="presentation" onClick={onClose} style={{position:"absolute",inset:0,zIndex:40,display:"flex",background:"rgba(44, 43, 41, .5)"}}>
      <div role="dialog" aria-modal="true" aria-label="Menu" onClick={e=>e.stopPropagation()}
        style={{display:"flex",flexDirection:"column",gap:10,width:290,maxWidth:"85%",height:"100%",padding:"20px 18px",
          borderRight:"3px solid var(--border-ink)",background:"var(--surface)",overflowY:"auto",scrollbarWidth:"none"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <p style={{display:"flex",alignItems:"center",gap:8,margin:0,fontFamily:"var(--font-display)",fontSize:19,fontWeight:600}}><Logo size={24}/><span>Spanish Quizzes</span></p>
          <IconSquare icon="close" size={40} radius={10} label="Close menu" onClick={onClose}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4,padding:"12px 14px",border:"var(--border-width) solid var(--border-ink)",borderRadius:14,background:"var(--sun-soft)",fontSize:13,fontWeight:700}}>
          <span>12-day streak</span><span style={{color:"var(--muted)",fontSize:12,fontWeight:400}}>81% accuracy this week</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button type="button" style={row} onClick={()=>t("history")}><span>Progress &amp; history</span>{arrow("history")}</button>
          {open==="history"?<div style={panel}>
            <p style={{margin:0}}>34 rounds played · 78% average accuracy</p>
            <p style={{margin:0}}>74 of 500 flashcards studied</p>
            <p style={sub}>Weak areas</p>
            <ul style={{listStyle:"none",margin:0,padding:0}}>
              <li style={li}><span style={{color:"var(--ink)",fontWeight:600}}>Tense</span><span>31% missed (11/35)</span></li>
              <li style={{...li,borderBottom:0}}><span style={{color:"var(--ink)",fontWeight:600}}>Verb</span><span>18% missed (7/40)</span></li>
            </ul>
            <p style={sub}>Recent rounds</p>
            <ul style={{listStyle:"none",margin:0,padding:0}}>
              <li style={li}><span style={{color:"var(--ink)",fontWeight:600}}>Preterite vs Imperfect</span><span>80%</span></li>
              <li style={{...li,borderBottom:0}}><span style={{color:"var(--ink)",fontWeight:600}}>Gustar Patterns (review)</span><span>100%</span></li>
            </ul>
          </div>:null}
          <button type="button" style={row} onClick={()=>t("recap")}><span>Weekly recap</span>
            <span style={{padding:"3px 10px",borderRadius:"var(--radius-pill)",background:"var(--sun)",color:"var(--ink)",fontSize:11,fontWeight:700}}>New</span></button>
          {open==="recap"?<div style={panel}><p style={{margin:0}}>9 rounds this week · 81% accuracy</p></div>:null}
          <button type="button" style={row} onClick={()=>t("notebook")}><span>Mistake notebook</span>
            <span style={{minWidth:24,padding:"2px 8px",borderRadius:"var(--radius-pill)",background:"var(--clay-soft)",color:"var(--clay)",fontSize:12,fontWeight:700,textAlign:"center"}}>{notebook.length}</span></button>
          {open==="notebook"?<div style={panel}>{notebook.length?<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{notebook.map(r=><Chip key={r} tone="clay" size="sm">{r}</Chip>)}</div>:<p style={{margin:0}}>No missed rules yet.</p>}</div>:null}
          <button type="button" style={row} onClick={()=>t("backup")}><span>Backup &amp; restore</span>{arrow("backup")}</button>
          {open==="backup"?<div style={{...panel,gap:8}}><button type="button" style={action}>Download backup</button><button type="button" style={action}>Import backup</button></div>:null}
          <button type="button" style={row} onClick={()=>t("settings")}><span>Settings</span>{arrow("settings")}</button>
          {open==="settings"?<div style={{...panel,gap:8}}>
            <button type="button" style={{...action,borderColor:"var(--danger)",background:"var(--danger-soft)",color:"var(--danger)"}}>Reset all progress</button>
            <p style={sub}>Finished activities</p><p style={{margin:0}}>No finished activities yet.</p>
          </div>:null}
          <button type="button" style={row}><span>How to use</span><span aria-hidden="true">{"\u2192"}</span></button>
          <button type="button" style={row}><span>Notes</span><span aria-hidden="true">{"\u2192"}</span></button>
        </div>
      </div>
    </div>
  );
}
