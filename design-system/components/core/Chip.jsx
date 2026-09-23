import React from "react";

const tones={neutral:"var(--surface-card)",primary:"var(--primary-soft)",sun:"var(--state-streak-wash)",
  sage:"var(--state-correct-wash)",clay:"var(--state-again-wash)",danger:"var(--state-wrong-wash)"};

export function Chip({tone="neutral",size="md",style,children,...rest}){
  const h=size==="sm"?"30px":"32px";
  return (
    <span style={{display:"inline-flex",alignItems:"center",minHeight:h,padding:size==="sm"?"0 12px":"0 14px",
      border:"var(--border-width-hair) solid var(--border-ink)",borderRadius:"var(--radius-pill)",
      background:tones[tone],color:"var(--text-body)",fontFamily:"var(--font-body)",
      fontSize:size==="sm"?"var(--text-caption)":"var(--text-body-sm)",fontWeight:"var(--weight-semibold)",
      whiteSpace:"nowrap",...style}} {...rest}>{children}</span>
  );
}
