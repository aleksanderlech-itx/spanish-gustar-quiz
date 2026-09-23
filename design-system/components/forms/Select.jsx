import React from "react";

/* Repo: .topic-filter-field */
export function Select({label,options=[],style,id,children,...rest}){
  const field=(
    <select id={id} className="qs-field" style={{minHeight:44,padding:"0 10px",width:"100%",border:"var(--border-width) solid var(--border-ink)",
      borderRadius:10,background:"var(--surface)",color:"var(--ink)",fontFamily:"var(--font-body)",fontSize:14,fontWeight:600,...style}} {...rest}>
      {children??options.map(o=>{const v=typeof o==="string"?o:o.value,l=typeof o==="string"?o:o.label;return <option key={v} value={v}>{l}</option>;})}
    </select>
  );
  if(!label) return field;
  return <label htmlFor={id} style={{display:"flex",flexDirection:"column",gap:6,color:"var(--muted)",fontSize:12,fontWeight:700}}><span>{label}</span>{field}</label>;
}
