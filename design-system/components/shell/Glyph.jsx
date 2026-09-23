import React from "react";

/* The system's whole icon vocabulary: unicode marks set in the body face.
   No icon library, no drawn SVG. */
export const GLYPHS={
  correct:"\u2713", wrong:"\u2715", again:"\u21BA", back:"\u2190", forward:"\u2192",
  up:"\u2191", down:"\u2193", flip:"\u21C4", more:"\u2026", close:"\u2715", star:"\u2605"
};

export function Glyph({name="correct",size="18px",color="currentColor",style,...rest}){
  return (
    <span aria-hidden="true" style={{fontSize:size,lineHeight:1,color,textDecoration:"none",...style}} {...rest}>
      {GLYPHS[name]||name}
    </span>
  );
}
