import type { ItemExplanation } from "./item-explanation.ts";

// Per-item explanations for the conditionals quiz (docs/explanation-quality.md): each names the cue
// that decides the form (the si clause, the imagined or past context, or the request) and, when the
// blank is in the si clause, the rule that si never takes the conditional or the future.
export const CONDITIONALS_EXPLANATIONS: Record<number, ItemExplanation> = {
  11001: { cue: "iremos", explanation: "Iremos is future, so the condition is real and likely: present llueve. After si, never the future or the conditional." },
  11002: { cue: "Si llueve", explanation: "Si llueve is present, so the condition is real and likely. The result is future: nos quedaremos." },
  11003: { cue: "te llamaré", explanation: "Te llamaré is future, so the condition is real: present tengo. After si, never the future or the conditional." },
  11004: { cue: "Si estudias", explanation: "Si estudias is present, so the condition is real and the result is future: aprobarás. The conditional only follows an imagined condition." },
  11005: { cue: "Te prestaré", explanation: "Te prestaré is future, so the condition is real: present necesitas, even when the si clause comes second. After si, never the future or the conditional." },
  11006: { cue: "Si tienes frío", explanation: "Si tienes frío is a real situation, so the result can be an order: the tú imperative cierra. Cierres is only used after no." },
  11007: { cue: "podremos", explanation: "Podremos is future, so the condition is real: present salimos. After si, never the future or the conditional." },
  11008: { cue: "vienen", explanation: "Vienen is present after si, so the condition is real: future se quedarán. The conditional belongs with an imagined condition." },
  11009: { cue: "Llegaremos", explanation: "Llegaremos is future, so the condition is real: present hay. After si, never the future or the conditional." },
  11010: { cue: "calientas", explanation: "Calientas states something that is always true, so the result is a plain present: se derrite. The subjunctive never forms the result of a real condition." },
  11011: { cue: "hay pan", explanation: "Hay pan is a present fact, so the condition is real: present tienes. After si, never the future or the conditional." },
  11012: { cue: "Si ves", explanation: "Si ves a Marta is a real possibility, so the result can be an order: the tú imperative dile. Le digas only works after no." },
  11013: { cue: "conocerás", explanation: "Conocerás is future, so the condition is real: present vienes. After si, never the future or the conditional." },
  11014: { cue: "te das prisa", explanation: "Te das prisa is present after si, so the condition is real. The result is future: perderás." },
  11015: { cue: "se enfadará", explanation: "Se enfadará is future, so the condition is real: present llamas. After si, never the future or the conditional." },
  11016: { cue: "terminan", explanation: "Terminan is present after si, so the condition is real and likely. The result is future: irán." },
  11017: { cue: "le recomiendo", explanation: "Le recomiendo is a present fact, so the condition is real: present se aloja. After si, never the future or the conditional." },
  11018: { cue: "llegas", explanation: "Llegas is present after si, a real possibility, so the result can be an order: the tú imperative reserva. Reserves is only used after no." },
  11019: { cue: "Te mandaré", explanation: "Te mandaré is future, so the condition is real: present surge. After si, never the future or the conditional." },
  11020: { cue: "ahorramos", explanation: "Ahorramos is present after si, so the plan is real. The result is future: compraremos." },
  11021: { cue: "entrará", explanation: "Entrará is future, so the condition is real: present abres. After si, never the future or the conditional." },
  11022: { cue: "mezclas", explanation: "Mezclas states something that is always true, so the result is a plain present: sale. The subjunctive never forms the result of a real condition." },
  11023: { cue: "se quejarán", explanation: "Se quejarán is future, so the condition is real: present ponemos. After si, never the future or the conditional." },
  11024: { cue: "reservan", explanation: "Reservan is present after si, so the offer is real. The result is future: tendrán." },
  11025: { cue: "estará", explanation: "Estará is future, so the condition is real: present termino. After si, never the future or the conditional." },
};
