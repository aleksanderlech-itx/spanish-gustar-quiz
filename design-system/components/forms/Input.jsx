import React from "react";

/* Repo: .round-type-input */
export function Input({label,hint,state,invalid=false,style,id,...rest}){
  const st=state||(invalid?"wrong":null);
  const skin=st==="correct"?{borderColor:"var(--sage)",background:"var(--sage-soft)"}:st==="wrong"?{borderColor:"var(--danger)",background:"var(--danger-soft)"}:null;
  const field=(
    <input id={id} className="qs-field" aria-invalid={st==="wrong"||undefined}
      style={{minHeight:52,padding:"0 14px",width:"100%",border:"var(--border-width) solid var(--border-ink)",borderRadius:10,
        background:"var(--paper)",color:"var(--ink)",fontFamily:"var(--font-body)",fontSize:19,fontWeight:600,...skin,...style}} {...rest}/>
  );
  if(!label) return field;
  return (
    <label htmlFor={id} style={{display:"flex",flexDirection:"column",gap:6,color:"var(--muted)",fontSize:12,fontWeight:700}}>
      <span>{label}</span>{field}
      {hint?<span style={{fontSize:13,fontWeight:400,color:st==="wrong"?"var(--danger)":"var(--muted)"}}>{hint}</span>:null}
    </label>
  );
}
