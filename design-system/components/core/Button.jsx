import React from "react";

const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"10px",
  border:"var(--border-width) solid var(--border-ink)",borderRadius:"var(--radius-lg)",
  fontFamily:"var(--font-display)",fontWeight:"var(--weight-semibold)",cursor:"pointer",
  textAlign:"center",boxShadow:"var(--offset-md)"};

const sizes={md:{minHeight:"var(--control-height)",padding:"0 22px",fontSize:"var(--text-title)"},
  lg:{minHeight:"var(--control-height-lg)",padding:"0 24px",fontSize:"17px"},
  sm:{minHeight:"var(--touch-min)",padding:"0 16px",fontSize:"16px"}};

export function Button({variant="primary",size="md",disabled=false,fullWidth=false,type="button",style,children,...rest}){
  const skin=
    variant==="primary"?{background:"var(--action-primary)",color:"var(--text-on-primary)"}:
    variant==="secondary"?{background:"var(--surface-card)",color:"var(--text-body)"}:
    {background:"none",color:"var(--state-again)",border:0,boxShadow:"none",padding:"0 4px",textAlign:"left"};

  const off=disabled?{background:"var(--surface-quiet)",color:"var(--text-muted)",
    border:"var(--border-width) solid var(--border-quiet)",boxShadow:"none",cursor:"not-allowed"}:null;

  const cls=["qs-press",variant==="secondary"?"qs-tint-hover":"",variant==="ghost"?"qs-underline":""].filter(Boolean).join(" ");

  return (
    <button type={type} disabled={disabled}
      className={disabled?undefined:cls}
      style={{...base,...sizes[size],...skin,...off,width:fullWidth?"100%":undefined,...style}} {...rest}>
      {children}
    </button>
  );
}
