import { PRETERITE_IMPERFECT_CONJUGATIONS } from "./preterite-imperfect-data.ts";
import { OBJECT_PRONOUN_CHART, type ObjectPronounType } from "./object-pronouns-data.ts";
import { SABER_CONOCER_CONJUGATIONS } from "./saber-conocer-data.ts";
import { REFLEXIVE_CHART } from "./reflexive-verbs-data.ts";
import { PRESENT_PERFECT_CHART } from "./present-perfect-data.ts";
import { PRESENT_CONTINUOUS_CHART } from "./present-continuous-data.ts";
import { POR_PARA_CHART } from "./por-para-data.ts";

/**
 * The reference chart of each quiz, as data its config entry points to (issue #151). Full six-pronoun
 * paradigms only exist where they are real: gustar-pattern verbs are impersonal and ser/estar compares two
 * verbs, so those get an honest, simpler block instead of a fabricated pronoun table.
 */

export type ChartRow = { pronoun: string; form: string };
export type ChartBlock = { tenseLabel: string; accent: "primary" | "sun"; rows: ChartRow[] };
export type Forms = Record<string, [string, string]>;
export type ChartBlocks = (group: string, forms: Forms) => ChartBlock[];

const alternate = (index: number) => (index % 2 === 0 ? "primary" as const : "sun" as const);

/** Usage groups that share one set of tables (reflexive, perfect, continuous, por vs para). */
const sharedTables = (tables: Array<{ title: string; rows: Array<{ label: string; form: string }> }>): ChartBlocks => () =>
  tables.map((table, index) => ({
    tenseLabel: table.title,
    accent: alternate(index),
    rows: table.rows.map((row) => ({ pronoun: row.label, form: row.form })),
  }));

const SABER_CONOCER_VERB_LABELS = { saber: "Saber", conocer: "Conocer" } as const;

export const CHART_BLOCKS = {
  gustar: ((group, forms) => {
    const [singular, plural] = forms[group] ?? ["", ""];
    return [{ tenseLabel: "Present", accent: "primary", rows: [{ pronoun: "one thing / to do something", form: singular }, { pronoun: "several things", form: plural }] }];
  }) as ChartBlocks,
  serEstar: ((group, forms) => {
    const [ser, estar] = forms[group] ?? ["ser", "estar"];
    return [{ tenseLabel: "Present", accent: "primary", rows: [{ pronoun: "ser", form: ser }, { pronoun: "estar", form: estar }] }];
  }) as ChartBlocks,
  preteriteImperfect: ((group) => {
    const conjugations = PRETERITE_IMPERFECT_CONJUGATIONS[group] ?? [];
    return [
      { tenseLabel: "Preterite", accent: "primary", rows: conjugations.map((c) => ({ pronoun: c.subject, form: c.preterite })) },
      { tenseLabel: "Imperfect", accent: "sun", rows: conjugations.map((c) => ({ pronoun: c.subject, form: c.imperfect })) },
    ];
  }) as ChartBlocks,
  objectPronouns: ((group) => {
    const rows = OBJECT_PRONOUN_CHART[group as ObjectPronounType] ?? [];
    return [{ tenseLabel: "Pronouns", accent: "primary", rows: rows.map((row) => ({ pronoun: row.label, form: row.form })) }];
  }) as ChartBlocks,
  saberConocer: ((group) => {
    // Past-meaning questions need the preterite/imperfect pair; every other usage is present.
    // The topic-level chart (no single usage) shows all three tenses.
    const tenses = group === "past meaning" ? (["preterite", "imperfect"] as const)
      : group ? (["present"] as const)
      : (["present", "preterite", "imperfect"] as const);
    return tenses.flatMap((tense) => (["saber", "conocer"] as const).map((verb) => ({
      tenseLabel: `${SABER_CONOCER_VERB_LABELS[verb]} · ${tense}`,
      accent: verb === "saber" ? "primary" as const : "sun" as const,
      rows: SABER_CONOCER_CONJUGATIONS.map((row) => ({ pronoun: row.subject, form: row[verb][tense] })),
    })));
  }) as ChartBlocks,
  reflexive: sharedTables(REFLEXIVE_CHART),
  presentPerfect: sharedTables(PRESENT_PERFECT_CHART),
  presentContinuous: sharedTables(PRESENT_CONTINUOUS_CHART),
  // Por and para don't conjugate: one example sentence per usage instead of a table.
  porPara: sharedTables(POR_PARA_CHART),
};
