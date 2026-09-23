import React from "react";

export function PhoneFrame({width=330,height,style,children,...rest}){
  return (
    <div style={{width,height,border:"var(--border-width) solid var(--border-ink)",
      borderRadius:"var(--radius-phone)",background:"var(--bg-canvas)",color:"var(--text-body)",overflow:"hidden",
      display:"flex",flexDirection:"column",boxShadow:"var(--offset-lg)",...style}} {...rest}>
      {children}
    </div>
  );
}
