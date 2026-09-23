import React from "react";

/* Repo: .mode-segmented */
export function SegmentedControl({options=[],value,onChange,style,...rest}){
  return (
    <div role="group" style={{display:"flex",gap:4,padding:4,border:"var(--border-width) solid var(--border-ink)",
      borderRadius:12,background:"var(--surface)",...style}} {...rest}>
      {options.map(o=>{
        const v=typeof o==="string"?o:o.value,l=typeof o==="string"?o:o.label,on=v===value;
        return (
          <button key={v} type="button" aria-pressed={on} onClick={()=>onChange&&onChange(v)}
            style={{flex:1,minHeight:46,borderRadius:8,cursor:"pointer",
              border:on?"var(--border-width) solid var(--border-ink)":"var(--border-width) solid transparent",
              background:on?"var(--segment-active-bg)":"transparent",color:on?"var(--segment-active-ink)":"var(--segment-ink)",
              fontFamily:"var(--font-display)",fontSize:16,fontWeight:600}}>{l}</button>
        );
      })}
    </div>
  );
}
