import React from "react";
import {Card} from "./Card.jsx";

export function StatTile({value,label,shape=1,tone="surface",elevated=false,style,...rest}){
  return (
    <Card shape={shape} tone={tone} elevated={elevated} style={{padding:"18px",...style}} {...rest}>
      <div style={{fontFamily:"var(--font-display)",fontSize:"30px",fontWeight:"var(--weight-semibold)",lineHeight:1.1}}>{value}</div>
      <div style={{fontSize:"var(--text-caption)",color:"var(--text-muted)",lineHeight:1.4,marginTop:"4px"}}>{label}</div>
    </Card>
  );
}
