import React from "react";

const organic=["var(--radius-organic-1)","var(--radius-organic-2)","var(--radius-organic-3)","var(--radius-organic-4)"];
const tones={surface:"var(--surface-card)",panel:"var(--surface-quiet)",primary:"var(--primary-soft)",
  sun:"var(--state-streak-wash)",sage:"var(--state-correct-wash)",clay:"var(--state-again-wash)",danger:"var(--state-wrong-wash)"};

export function Card({shape=1,tone="surface",elevated=false,style,children,...rest}){
  const radius=shape==="square"?"var(--radius-lg)":organic[((Number(shape)||1)-1)%4];
  return (
    <div style={{border:"var(--border-width) solid var(--border-ink)",borderRadius:radius,
      background:tones[tone],color:"var(--text-body)",padding:"var(--card-padding)",
      boxShadow:elevated?"var(--offset-md)":"none",...style}} {...rest}>{children}</div>
  );
}
