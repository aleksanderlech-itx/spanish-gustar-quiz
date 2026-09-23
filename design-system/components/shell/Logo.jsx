import React from "react";

/* The board-tile mark from app/logo.tsx: a pinned bar over two tiles. Drawn from tokens so it recolours with the theme. */
export function Logo({size=24,style,...rest}){
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" style={{flex:"none",...style}} {...rest}>
      <rect x="2" y="2" width="30" height="12" fill="var(--primary)" stroke="var(--ink)" strokeWidth="2.5"/>
      <rect x="2" y="18" width="13" height="14" fill="var(--clay)" stroke="var(--ink)" strokeWidth="2.5"/>
      <rect x="19" y="18" width="13" height="14" fill="var(--sun)" stroke="var(--ink)" strokeWidth="2.5"/>
    </svg>
  );
}
