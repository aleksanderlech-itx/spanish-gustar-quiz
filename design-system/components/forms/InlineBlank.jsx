import React from "react";

export function InlineBlank({value,filled=false,width="86px",style,...rest}){
  return (
    <span style={{display:"inline-block",minWidth:width,textAlign:"center",
      borderBottom:"3px solid var(--state-streak)",
      color:filled?"var(--text-body)":"var(--text-muted)",
      fontWeight:filled?"var(--weight-bold)":"var(--weight-regular)",...style}} {...rest}>
      {value??"?"}
    </span>
  );
}
