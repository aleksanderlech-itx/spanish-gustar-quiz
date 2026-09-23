/* @ds-bundle: {"format":4,"namespace":"QuizStudioDesignSystem_fb0db2","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"StatTile","sourcePath":"components/core/StatTile.jsx"},{"name":"AnswerOption","sourcePath":"components/forms/AnswerOption.jsx"},{"name":"InlineBlank","sourcePath":"components/forms/InlineBlank.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"LeitnerBoxes","sourcePath":"components/progress/LeitnerBoxes.jsx"},{"name":"ProgressBar","sourcePath":"components/progress/ProgressBar.jsx"},{"name":"ScoreRing","sourcePath":"components/progress/ScoreRing.jsx"},{"name":"StreakStrip","sourcePath":"components/progress/StreakStrip.jsx"},{"name":"AppHeader","sourcePath":"components/shell/AppHeader.jsx"},{"name":"BoardTile","sourcePath":"components/shell/BoardTile.jsx"},{"name":"FlashCard","sourcePath":"components/shell/FlashCard.jsx"},{"name":"GLYPHS","sourcePath":"components/shell/Glyph.jsx"},{"name":"Glyph","sourcePath":"components/shell/Glyph.jsx"},{"name":"IconSquare","sourcePath":"components/shell/IconSquare.jsx"},{"name":"Logo","sourcePath":"components/shell/Logo.jsx"},{"name":"PhoneFrame","sourcePath":"components/shell/PhoneFrame.jsx"},{"name":"QuizHeader","sourcePath":"components/shell/QuizHeader.jsx"},{"name":"BoardScreen","sourcePath":"ui_kits/spanish-quizzes-app/BoardScreen.jsx"},{"name":"Drawer","sourcePath":"ui_kits/spanish-quizzes-app/Drawer.jsx"},{"name":"FlashcardsScreen","sourcePath":"ui_kits/spanish-quizzes-app/FlashcardsScreen.jsx"},{"name":"ResultsScreen","sourcePath":"ui_kits/spanish-quizzes-app/ResultsScreen.jsx"},{"name":"RoundScreen","sourcePath":"ui_kits/spanish-quizzes-app/RoundScreen.jsx"},{"name":"TopicScreen","sourcePath":"ui_kits/spanish-quizzes-app/TopicScreen.jsx"}],"sourceHashes":{"components/core/Button.jsx":"ddebcd9b4dd5","components/core/Card.jsx":"abc224eaa929","components/core/Chip.jsx":"7baf80cc027a","components/core/StatTile.jsx":"a3ec7c8ca1d0","components/forms/AnswerOption.jsx":"f5562f184621","components/forms/InlineBlank.jsx":"51cb8f1113b7","components/forms/Input.jsx":"67b6edc032dd","components/forms/SegmentedControl.jsx":"1ca8203cca68","components/forms/Select.jsx":"30dee9afd3cf","components/progress/LeitnerBoxes.jsx":"50b1fb06445c","components/progress/ProgressBar.jsx":"5d02b0e4b528","components/progress/ScoreRing.jsx":"808d2a0521e1","components/progress/StreakStrip.jsx":"d9183fa2f8d1","components/shell/AppHeader.jsx":"2ada9b9e31eb","components/shell/BoardTile.jsx":"bc5f8fa69371","components/shell/FlashCard.jsx":"edb5f7fd1ffa","components/shell/Glyph.jsx":"3e9a1028b1a5","components/shell/IconSquare.jsx":"c0e7345ea066","components/shell/Logo.jsx":"745a78f404dc","components/shell/PhoneFrame.jsx":"918414643953","components/shell/QuizHeader.jsx":"651d1378d83d","ui_kits/spanish-quizzes-app/BoardScreen.jsx":"235330ec4782","ui_kits/spanish-quizzes-app/Drawer.jsx":"072737f59112","ui_kits/spanish-quizzes-app/FlashcardsScreen.jsx":"642e987695f9","ui_kits/spanish-quizzes-app/ResultsScreen.jsx":"8ce3b0ba7bd7","ui_kits/spanish-quizzes-app/RoundScreen.jsx":"27a60ab36152","ui_kits/spanish-quizzes-app/TopicScreen.jsx":"11a2cef032fd"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.QuizStudioDesignSystem_fb0db2 = window.QuizStudioDesignSystem_fb0db2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  border: "var(--border-width) solid var(--border-ink)",
  borderRadius: "var(--radius-lg)",
  fontFamily: "var(--font-display)",
  fontWeight: "var(--weight-semibold)",
  cursor: "pointer",
  textAlign: "center",
  boxShadow: "var(--offset-md)"
};
const sizes = {
  md: {
    minHeight: "var(--control-height)",
    padding: "0 22px",
    fontSize: "var(--text-title)"
  },
  lg: {
    minHeight: "var(--control-height-lg)",
    padding: "0 24px",
    fontSize: "17px"
  },
  sm: {
    minHeight: "var(--touch-min)",
    padding: "0 16px",
    fontSize: "16px"
  }
};
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  type = "button",
  style,
  children,
  ...rest
}) {
  const skin = variant === "primary" ? {
    background: "var(--action-primary)",
    color: "var(--text-on-primary)"
  } : variant === "secondary" ? {
    background: "var(--surface-card)",
    color: "var(--text-body)"
  } : {
    background: "none",
    color: "var(--state-again)",
    border: 0,
    boxShadow: "none",
    padding: "0 4px",
    textAlign: "left"
  };
  const off = disabled ? {
    background: "var(--surface-quiet)",
    color: "var(--text-muted)",
    border: "var(--border-width) solid var(--border-quiet)",
    boxShadow: "none",
    cursor: "not-allowed"
  } : null;
  const cls = ["qs-press", variant === "secondary" ? "qs-tint-hover" : "", variant === "ghost" ? "qs-underline" : ""].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    className: disabled ? undefined : cls,
    style: {
      ...base,
      ...sizes[size],
      ...skin,
      ...off,
      width: fullWidth ? "100%" : undefined,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const organic = ["var(--radius-organic-1)", "var(--radius-organic-2)", "var(--radius-organic-3)", "var(--radius-organic-4)"];
const tones = {
  surface: "var(--surface-card)",
  panel: "var(--surface-quiet)",
  primary: "var(--primary-soft)",
  sun: "var(--state-streak-wash)",
  sage: "var(--state-correct-wash)",
  clay: "var(--state-again-wash)",
  danger: "var(--state-wrong-wash)"
};
function Card({
  shape = 1,
  tone = "surface",
  elevated = false,
  style,
  children,
  ...rest
}) {
  const radius = shape === "square" ? "var(--radius-lg)" : organic[((Number(shape) || 1) - 1) % 4];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: radius,
      background: tones[tone],
      color: "var(--text-body)",
      padding: "var(--card-padding)",
      boxShadow: elevated ? "var(--offset-md)" : "none",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  neutral: "var(--surface-card)",
  primary: "var(--primary-soft)",
  sun: "var(--state-streak-wash)",
  sage: "var(--state-correct-wash)",
  clay: "var(--state-again-wash)",
  danger: "var(--state-wrong-wash)"
};
function Chip({
  tone = "neutral",
  size = "md",
  style,
  children,
  ...rest
}) {
  const h = size === "sm" ? "30px" : "32px";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      minHeight: h,
      padding: size === "sm" ? "0 12px" : "0 14px",
      border: "var(--border-width-hair) solid var(--border-ink)",
      borderRadius: "var(--radius-pill)",
      background: tones[tone],
      color: "var(--text-body)",
      fontFamily: "var(--font-body)",
      fontSize: size === "sm" ? "var(--text-caption)" : "var(--text-body-sm)",
      fontWeight: "var(--weight-semibold)",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/StatTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatTile({
  value,
  label,
  shape = 1,
  tone = "surface",
  elevated = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    shape: shape,
    tone: tone,
    elevated: elevated,
    style: {
      padding: "18px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "30px",
      fontWeight: "var(--weight-semibold)",
      lineHeight: 1.1
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-caption)",
      color: "var(--text-muted)",
      lineHeight: 1.4,
      marginTop: "4px"
    }
  }, label));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/forms/AnswerOption.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Repo: .round-option */
const skins = {
  idle: {
    background: "var(--surface)",
    border: "var(--border-ink)",
    shadow: "var(--hard-shadow)"
  },
  correct: {
    background: "var(--sage-soft)",
    border: "var(--sage)",
    shadow: "2px 2px 0 var(--shadow-col)"
  },
  wrong: {
    background: "var(--danger-soft)",
    border: "var(--danger)",
    shadow: "2px 2px 0 var(--shadow-col)"
  },
  other: {
    background: "var(--panel-soft)",
    border: "var(--line)",
    shadow: "none"
  }
};
function AnswerOption({
  state = "idle",
  disabled = false,
  style,
  children,
  ...rest
}) {
  const s = skins[state] || skins.idle;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    className: state === "idle" && !disabled ? "qs-press" : undefined,
    style: {
      width: "100%",
      minHeight: 56,
      padding: "0 16px",
      textAlign: "left",
      cursor: disabled ? "default" : "pointer",
      border: `var(--border-width) solid ${s.border}`,
      borderRadius: 10,
      background: s.background,
      color: "var(--ink)",
      boxShadow: s.shadow,
      fontFamily: "var(--font-body)",
      fontSize: 17,
      fontWeight: 600,
      ...style
    }
  }, rest), state === "correct" ? "\u2713 " : state === "wrong" ? "\u2715 " : "", children);
}
Object.assign(__ds_scope, { AnswerOption });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/AnswerOption.jsx", error: String((e && e.message) || e) }); }

// components/forms/InlineBlank.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function InlineBlank({
  value,
  filled = false,
  width = "86px",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-block",
      minWidth: width,
      textAlign: "center",
      borderBottom: "3px solid var(--state-streak)",
      color: filled ? "var(--text-body)" : "var(--text-muted)",
      fontWeight: filled ? "var(--weight-bold)" : "var(--weight-regular)",
      ...style
    }
  }, rest), value ?? "?");
}
Object.assign(__ds_scope, { InlineBlank });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/InlineBlank.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Repo: .round-type-input */
function Input({
  label,
  hint,
  state,
  invalid = false,
  style,
  id,
  ...rest
}) {
  const st = state || (invalid ? "wrong" : null);
  const skin = st === "correct" ? {
    borderColor: "var(--sage)",
    background: "var(--sage-soft)"
  } : st === "wrong" ? {
    borderColor: "var(--danger)",
    background: "var(--danger-soft)"
  } : null;
  const field = /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    className: "qs-field",
    "aria-invalid": st === "wrong" || undefined,
    style: {
      minHeight: 52,
      padding: "0 14px",
      width: "100%",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 10,
      background: "var(--paper)",
      color: "var(--ink)",
      fontFamily: "var(--font-body)",
      fontSize: 19,
      fontWeight: 600,
      ...skin,
      ...style
    }
  }, rest));
  if (!label) return field;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      color: "var(--muted)",
      fontSize: 12,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, label), field, hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 400,
      color: st === "wrong" ? "var(--danger)" : "var(--muted)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Repo: .mode-segmented */
function SegmentedControl({
  options = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "group",
    style: {
      display: "flex",
      gap: 4,
      padding: 4,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 12,
      background: "var(--surface)",
      ...style
    }
  }, rest), options.map(o => {
    const v = typeof o === "string" ? o : o.value,
      l = typeof o === "string" ? o : o.label,
      on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      "aria-pressed": on,
      onClick: () => onChange && onChange(v),
      style: {
        flex: 1,
        minHeight: 46,
        borderRadius: 8,
        cursor: "pointer",
        border: on ? "var(--border-width) solid var(--border-ink)" : "var(--border-width) solid transparent",
        background: on ? "var(--segment-active-bg)" : "transparent",
        color: on ? "var(--segment-active-ink)" : "var(--segment-ink)",
        fontFamily: "var(--font-display)",
        fontSize: 16,
        fontWeight: 600
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Repo: .topic-filter-field */
function Select({
  label,
  options = [],
  style,
  id,
  children,
  ...rest
}) {
  const field = /*#__PURE__*/React.createElement("select", _extends({
    id: id,
    className: "qs-field",
    style: {
      minHeight: 44,
      padding: "0 10px",
      width: "100%",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 10,
      background: "var(--surface)",
      color: "var(--ink)",
      fontFamily: "var(--font-body)",
      fontSize: 14,
      fontWeight: 600,
      ...style
    }
  }, rest), children ?? options.map(o => {
    const v = typeof o === "string" ? o : o.value,
      l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  }));
  if (!label) return field;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      color: "var(--muted)",
      fontSize: 12,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, label), field);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/progress/LeitnerBoxes.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const INTERVALS = ["Every session", "1 day", "3 days", "7 days"];
function LeitnerBoxes({
  counts = [0, 0, 0, 0],
  note = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("section", {
    "aria-label": "Leitner box progress",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "16px 24px 12px 32px",
      background: "var(--paper-white)",
      overflow: "hidden"
    }
  }, counts.slice(0, 4).map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: "12px 10px",
      borderLeft: i ? "var(--border-width-hair) solid var(--line)" : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".08em",
      textTransform: "uppercase"
    }
  }, "Box ", i + 1), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.1
    }
  }, c), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 12
    }
  }, INTERVALS[i])))), note ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: "12px 14px",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "16px 24px 12px 32px",
      background: "var(--paper-white)",
      fontSize: 14,
      lineHeight: 1.55
    }
  }, /*#__PURE__*/React.createElement("strong", null, "How it works:"), " Box 1 cards are reviewed immediately. Boxes 2", "\u2013", "4 return after 1, 3 and 7 days. One wrong answer sends a card back to Box 1.") : null);
}
Object.assign(__ds_scope, { LeitnerBoxes });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/LeitnerBoxes.jsx", error: String((e && e.message) || e) }); }

// components/progress/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProgressBar({
  value = 0,
  max = 100,
  label,
  valueLabel,
  fill = "var(--action-primary)",
  height = "12px",
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / (max || 1) * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      ...style
    }
  }, rest), label || valueLabel ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "var(--text-body-sm)",
      fontWeight: "var(--weight-semibold)"
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", null, valueLabel)) : null, /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max,
    style: {
      height,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "var(--radius-sm)",
      background: "var(--surface-card)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + "%",
      height: "100%",
      background: fill
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/progress/ScoreRing.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Repo: .board-ring / .topic-summary-ring — conic primary over --line, surface disc, no border. */
function ScoreRing({
  percent = 0,
  size = 56,
  style,
  ...rest
}) {
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  const big = size >= 80;
  const inner = big ? Math.round(size * 60 / 84) : Math.round(size * 38 / 56);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "img",
    "aria-label": `${p}%`,
    style: {
      display: "grid",
      placeItems: "center",
      width: size,
      height: size,
      flex: "none",
      borderRadius: "50%",
      background: `conic-gradient(var(--primary) ${p}%, var(--line) ${p}%)`,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      placeItems: "center",
      width: inner,
      height: inner,
      borderRadius: "50%",
      background: "var(--surface)",
      color: "var(--ink)",
      fontSize: big ? 19 : 12,
      fontWeight: 700
    }
  }, p, "%"));
}
Object.assign(__ds_scope, { ScoreRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/ScoreRing.jsx", error: String((e && e.message) || e) }); }

// components/progress/StreakStrip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_WEEK = [{
  letter: "Lu",
  status: "done"
}, {
  letter: "Ma",
  status: "done"
}, {
  letter: "Mi",
  status: "done"
}, {
  letter: "Ju",
  status: "done"
}, {
  letter: "Vi",
  status: "today",
  doneCount: 2,
  total: 5
}, {
  letter: "S\u00e1",
  status: "future"
}, {
  letter: "Do",
  status: "future"
}];
function StreakStrip({
  days = 12,
  todayDone = 2,
  todayTotal = 5,
  week = DEFAULT_WEEK,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("section", _extends({
    "aria-label": `${days} day streak`,
    style: {
      padding: "16px 18px",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "16px 24px 12px 32px",
      background: "var(--streak-panel-bg)",
      borderColor: "var(--streak-panel-border)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--streak-count-ink)",
      fontFamily: "var(--font-display)",
      fontSize: 40,
      fontWeight: 600,
      lineHeight: .9
    }
  }, days), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink)",
      fontSize: 15,
      fontWeight: 700
    }
  }, "d\u00edas seguidos"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 13
    }
  }, "Goal: a round in all ", todayTotal, " activities \xB7 ", todayDone, "/", todayTotal, " today"))), /*#__PURE__*/React.createElement("div", {
    role: "list",
    style: {
      display: "flex",
      gap: 5,
      marginTop: 14
    }
  }, week.map((d, i) => {
    const fill = d.status === "today" && d.total ? Math.round(d.doneCount / d.total * 100) : 0;
    const s = d.status === "done" ? {
      border: "var(--border-width) solid var(--streak-day-border)",
      background: "var(--sun)"
    } : d.status === "today" ? {
      border: "var(--border-width) dashed var(--streak-today-border)",
      background: `linear-gradient(90deg, var(--sun) ${fill}%, transparent ${fill}%)`
    } : {
      border: "var(--border-width) var(--streak-future-style) var(--line)",
      background: "transparent"
    };
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      role: "listitem",
      style: {
        flex: 1,
        height: 22,
        borderRadius: 4,
        ...s
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      display: "flex",
      gap: 5,
      marginTop: 4
    }
  }, week.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      color: "var(--muted)",
      fontSize: 10,
      textAlign: "center"
    }
  }, d.letter))));
}
Object.assign(__ds_scope, { StreakStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/StreakStrip.jsx", error: String((e && e.message) || e) }); }

// components/shell/AppHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AppHeader({
  title,
  mark,
  badge,
  onBack,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      padding: "14px 18px",
      borderBottom: "var(--border-width) solid var(--border-ink)",
      background: "var(--surface-card)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }
  }, onBack ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onBack,
    "aria-label": "Back",
    style: {
      border: 0,
      background: "none",
      color: "var(--text-body)",
      fontSize: "20px",
      lineHeight: 1,
      cursor: "pointer",
      padding: 0,
      minWidth: "var(--touch-min)",
      minHeight: "var(--touch-min)",
      textAlign: "left"
    }
  }, "\u2190") : null, mark ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flex: "none"
    }
  }, mark) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "17px",
      fontWeight: "var(--weight-semibold)"
    }
  }, title)), badge != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: "34px",
      height: "34px",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "var(--radius-pill)",
      background: "var(--state-streak-wash)",
      display: "grid",
      placeItems: "center",
      fontSize: "var(--text-caption)",
      fontWeight: "var(--weight-bold)"
    }
  }, badge) : null);
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/shell/BoardTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const QuizIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": "true",
  style: {
    width: "60%",
    height: "60%"
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M4 12.5l5 5L20 7",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const DeckIcon = ({
  front
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": "true",
  style: {
    width: "60%",
    height: "60%"
  }
}, /*#__PURE__*/React.createElement("rect", {
  x: "3.5",
  y: "4.5",
  width: "12",
  height: "16",
  rx: "2.2",
  transform: "rotate(-14 9.5 12.5)",
  stroke: "currentColor",
  strokeWidth: "2"
}), /*#__PURE__*/React.createElement("rect", {
  x: "8.5",
  y: "3.5",
  width: "12",
  height: "16",
  rx: "2.2",
  transform: "rotate(14 14.5 11.5)",
  stroke: "currentColor",
  strokeWidth: "2",
  fill: front
}));
const pill = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "var(--radius-pill)",
  fontSize: "11px",
  fontWeight: "var(--weight-bold)",
  lineHeight: 1.3
};
function TodayPill({
  done,
  correct,
  total
}) {
  if (done) return /*#__PURE__*/React.createElement("span", {
    style: {
      ...pill,
      background: "var(--success-soft)",
      color: "var(--success)"
    }
  }, "\u2713", " Today");
  if (!Number(total)) return null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      ...pill,
      background: "transparent",
      border: "var(--border-width) dashed var(--line)",
      color: "var(--muted)"
    }
  }, correct, "/", total, " today");
}
function BoardTile({
  variant = "due",
  kind = "quiz",
  title,
  todayCorrect = 0,
  todayTotal = 0,
  todayDone = false,
  due = 0,
  mastered = 0,
  completed = 0,
  total = 0,
  percent = 0,
  dailyPercent = 0,
  onClick,
  style,
  ...rest
}) {
  const isDone = todayDone === true || todayDone === "true";
  const iconBase = {
    display: "inline-grid",
    placeItems: "center",
    width: 24,
    height: 24,
    border: "var(--border-width) solid var(--border-ink)",
    borderRadius: 5,
    background: "var(--surface)",
    color: "var(--ink)"
  };
  const common = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    padding: 16,
    border: "var(--border-width) solid var(--border-ink)",
    color: "var(--ink)",
    textAlign: "left",
    font: "inherit",
    cursor: onClick ? "pointer" : undefined
  };
  const Icon = ({
    bg,
    quiet,
    s
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      ...iconBase,
      ...(quiet ? {
        width: 22,
        height: 22,
        borderColor: "var(--line)"
      } : null),
      ...(bg ? {
        background: bg
      } : null),
      ...s
    }
  }, kind === "deck" ? /*#__PURE__*/React.createElement(DeckIcon, {
    front: bg || "var(--surface)"
  }) : /*#__PURE__*/React.createElement(QuizIcon, null));
  const h2 = (size, lh) => /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "8px 0 4px",
      fontFamily: "var(--font-display)",
      fontSize: size,
      fontWeight: 600,
      lineHeight: lh
    }
  }, title);
  const today = /*#__PURE__*/React.createElement(TodayPill, {
    done: isDone,
    correct: todayCorrect,
    total: todayTotal
  });
  if (variant === "pinned") {
    const p = Number(dailyPercent) || 0;
    return /*#__PURE__*/React.createElement("div", _extends({
      role: onClick ? "button" : undefined,
      onClick: onClick,
      className: onClick ? "qs-press" : undefined,
      style: {
        ...common,
        borderRadius: "16px 26px 12px 32px",
        background: "var(--surface)",
        boxShadow: "var(--hard-shadow)",
        padding: 18,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        alignSelf: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...pill,
        background: "var(--sun)",
        color: "var(--ink)"
      }
    }, "In progress"), today), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        placeItems: "center",
        width: 56,
        height: 56,
        marginTop: 12,
        borderRadius: "50%",
        background: `conic-gradient(var(--primary) ${p}%, var(--line) ${p}%)`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        placeItems: "center",
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "var(--surface)",
        fontSize: 12,
        fontWeight: 700
      }
    }, p, "%")), h2("21px", 1.1), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        color: "var(--muted)",
        fontSize: 13
      }
    }, "Today: ", todayCorrect, " of ", Number(todayTotal) || "\u2013", " correct \xB7 ", completed, " of ", total, " total done"), /*#__PURE__*/React.createElement(Icon, {
      bg: "var(--primary-soft)",
      s: {
        position: "absolute",
        top: 18,
        right: 18,
        width: 28,
        height: 28
      }
    }));
  }
  if (variant === "quiet") {
    const p = Number(percent) || 0;
    return /*#__PURE__*/React.createElement("div", _extends({
      role: onClick ? "button" : undefined,
      onClick: onClick,
      style: {
        ...common,
        borderRadius: 14,
        borderColor: "var(--line)",
        background: "var(--panel-soft)",
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      quiet: true
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, today, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--muted)",
        fontSize: 11,
        fontWeight: 600
      }
    }, "nothing due"))), h2("16px", 1.15), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        marginTop: 10,
        border: "var(--border-width) solid var(--line)",
        borderRadius: 4,
        background: "var(--surface)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        height: "100%",
        width: p + "%",
        background: p >= 90 ? "var(--sage)" : "var(--primary)"
      }
    })));
  }
  const m = Number(total) ? Math.round(Number(mastered) / Number(total) * 100) : 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: onClick ? "button" : undefined,
    onClick: onClick,
    className: onClick ? "qs-press" : undefined,
    style: {
      ...common,
      minHeight: 150,
      borderRadius: "26px 14px 30px 14px",
      background: "var(--surface)",
      boxShadow: "var(--hard-shadow)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, null), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, today, /*#__PURE__*/React.createElement("span", {
    style: {
      ...pill,
      background: "var(--clay-soft)",
      color: "var(--clay)"
    }
  }, due, " due"))), h2("18px", 1.1), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 4,
      background: "var(--surface)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height: "100%",
      width: m + "%",
      background: "var(--primary)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 13
    }
  }, mastered, " of ", total, " mastered")));
}
Object.assign(__ds_scope, { BoardTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/BoardTile.jsx", error: String((e && e.message) || e) }); }

// components/shell/FlashCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const eyebrow = {
  margin: 0,
  color: "var(--clay)",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: ".12em",
  textTransform: "uppercase"
};
function FlashCard({
  term,
  meaning,
  example,
  exampleEnglish,
  meta,
  revealed = false,
  onSpeak,
  onReveal,
  style,
  ...rest
}) {
  const speak = e => {
    e.stopPropagation();
    onSpeak && onSpeak();
  };
  const termRow = /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("strong", {
    lang: "es",
    style: {
      color: "var(--primary)",
      fontFamily: "var(--font-display)",
      fontSize: "clamp(34px, 9vw, 42px)",
      lineHeight: 1.05,
      fontWeight: 600
    }
  }, term), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": `Listen to ${term}`,
    onClick: speak,
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: 44,
      height: 44,
      flex: "none",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "50%",
      background: "var(--sun-soft)",
      fontSize: 18,
      cursor: "pointer",
      padding: 0
    }
  }, "\uD83D\uDD0A"));
  const pill = meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: "flex-start",
      marginTop: "auto",
      padding: "4px 10px",
      border: "var(--border-width-hair) solid var(--border-ink)",
      borderRadius: "var(--radius-pill)",
      background: "var(--panel-soft)",
      color: "var(--muted)",
      fontSize: 12,
      fontWeight: 600
    }
  }, meta) : null;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "button",
    tabIndex: 0,
    "aria-expanded": revealed,
    onClick: onReveal,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      padding: "24px 20px",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "18px 30px 14px 34px",
      background: "var(--paper-white)",
      boxShadow: "var(--hard-shadow)",
      cursor: "pointer",
      color: "var(--ink)",
      ...style
    }
  }, rest), revealed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Spanish ", "\u2192", " English"), termRow, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: "var(--ink)"
    }
  }), /*#__PURE__*/React.createElement("p", {
    lang: "en",
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 21,
      fontWeight: 600
    }
  }, meaning), example ? /*#__PURE__*/React.createElement("p", {
    lang: "es",
    style: {
      margin: 0,
      color: "var(--muted)",
      fontSize: 18,
      lineHeight: 1.55
    }
  }, example) : null, exampleEnglish ? /*#__PURE__*/React.createElement("p", {
    lang: "en",
    style: {
      margin: "-10px 0 0",
      color: "var(--muted)",
      fontSize: 18,
      fontStyle: "italic",
      lineHeight: 1.5,
      opacity: .85
    }
  }, exampleEnglish) : null, pill) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Tap to reveal"), termRow, pill));
}
Object.assign(__ds_scope, { FlashCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/FlashCard.jsx", error: String((e && e.message) || e) }); }

// components/shell/Glyph.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The system's whole icon vocabulary: unicode marks set in the body face.
   No icon library, no drawn SVG. */
const GLYPHS = {
  correct: "\u2713",
  wrong: "\u2715",
  again: "\u21BA",
  back: "\u2190",
  forward: "\u2192",
  up: "\u2191",
  down: "\u2193",
  flip: "\u21C4",
  more: "\u2026",
  close: "\u2715",
  star: "\u2605"
};
function Glyph({
  name = "correct",
  size = "18px",
  color = "currentColor",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      fontSize: size,
      lineHeight: 1,
      color,
      textDecoration: "none",
      ...style
    }
  }, rest), GLYPHS[name] || name);
}
Object.assign(__ds_scope, { GLYPHS, Glyph });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/Glyph.jsx", error: String((e && e.message) || e) }); }

// components/shell/IconSquare.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SunIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  "aria-hidden": "true",
  style: {
    width: "55%",
    height: "55%"
  }
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
}));
const MoonIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  style: {
    width: "55%",
    height: "55%"
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
}));
const Hamburger = () => /*#__PURE__*/React.createElement("span", {
  "aria-hidden": "true",
  style: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "3px",
    width: "18px"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    height: "2px",
    background: "currentColor"
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    height: "2px",
    background: "currentColor"
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    height: "2px",
    background: "currentColor"
  }
}));

/* The 44px bordered square used for header actions (repo: .mode-switch, .topic-back, .round-back). */
function IconSquare({
  icon = "back",
  size = 44,
  radius = 12,
  label,
  style,
  children,
  ...rest
}) {
  const glyph = icon === "menu" ? /*#__PURE__*/React.createElement(Hamburger, null) : icon === "sun" ? /*#__PURE__*/React.createElement(SunIcon, null) : icon === "moon" ? /*#__PURE__*/React.createElement(MoonIcon, null) : icon === "close" ? "\u2715" : /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: "20px",
      fontWeight: "var(--weight-bold)"
    }
  }, "\u2190");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    className: "qs-press-sm",
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: size,
      minHeight: size,
      height: size,
      flex: "none",
      padding: 0,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: radius,
      background: "var(--surface-card)",
      color: "var(--text-body)",
      cursor: "pointer",
      ...style
    }
  }, rest), children ?? glyph);
}
Object.assign(__ds_scope, { IconSquare });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/IconSquare.jsx", error: String((e && e.message) || e) }); }

// components/shell/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The board-tile mark from app/logo.tsx: a pinned bar over two tiles. Drawn from tokens so it recolours with the theme. */
function Logo({
  size = 24,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 34 34",
    "aria-hidden": "true",
    style: {
      flex: "none",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "30",
    height: "12",
    fill: "var(--primary)",
    stroke: "var(--ink)",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "18",
    width: "13",
    height: "14",
    fill: "var(--clay)",
    stroke: "var(--ink)",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "19",
    y: "18",
    width: "13",
    height: "14",
    fill: "var(--sun)",
    stroke: "var(--ink)",
    strokeWidth: "2.5"
  }));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/Logo.jsx", error: String((e && e.message) || e) }); }

// components/shell/PhoneFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PhoneFrame({
  width = 330,
  height,
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "var(--radius-phone)",
      background: "var(--bg-canvas)",
      color: "var(--text-body)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "var(--offset-lg)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { PhoneFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// components/shell/QuizHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function QuizHeader({
  current = 1,
  total = 10,
  steps,
  onBack,
  style,
  ...rest
}) {
  const n = Number(steps ?? total);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "14px 18px 0",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onBack,
    "aria-label": "Back to topic",
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: "40px",
      height: "40px",
      flex: "none",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "12px",
      background: "var(--surface-card)",
      color: "var(--text-body)",
      fontSize: "20px",
      fontWeight: "var(--weight-bold)",
      cursor: "pointer",
      padding: 0
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuemin": 1,
    "aria-valuemax": n,
    "aria-valuenow": current,
    style: {
      display: "flex",
      flex: 1,
      gap: "4px"
    }
  }, Array.from({
    length: n
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: "8px",
      border: "1.5px solid var(--border-ink)",
      borderRadius: "2px",
      background: i < current - 1 ? "var(--action-primary)" : i === current - 1 ? "var(--state-streak)" : "transparent"
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      color: "var(--text-muted)",
      fontSize: "var(--text-caption)",
      fontWeight: "var(--weight-bold)",
      whiteSpace: "nowrap"
    }
  }, current, "/", total));
}
Object.assign(__ds_scope, { QuizHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shell/QuizHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spanish-quizzes-app/BoardScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const eyebrow = {
  margin: 0,
  color: "var(--muted)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".14em",
  textTransform: "uppercase"
};

/* Repo: app/quiz-selector.tsx, mobile layout */
function BoardScreen({
  pinned,
  tiles = [],
  theme = "light",
  onToggleTheme,
  onMenu,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflowY: "auto",
      scrollbarWidth: "none",
      padding: "22px 11px 42px"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconSquare, {
    icon: "menu",
    label: "Open menu",
    onClick: onMenu
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      flex: 1,
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    size: 24
  }), /*#__PURE__*/React.createElement("span", null, "Spanish Quizzes")), /*#__PURE__*/React.createElement(__ds_scope.IconSquare, {
    icon: theme === "dark" ? "sun" : "moon",
    label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    onClick: onToggleTheme
  })), /*#__PURE__*/React.createElement(__ds_scope.StreakStrip, {
    days: 12,
    todayDone: 2,
    todayTotal: 5,
    style: {
      marginBottom: 22
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Today's board"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 12
    }
  }, "sized by what's due")), pinned ? /*#__PURE__*/React.createElement(__ds_scope.BoardTile, _extends({
    variant: "pinned"
  }, pinned, {
    onClick: () => onOpen && onOpen(pinned.id),
    style: {
      marginBottom: 22
    }
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      marginTop: 4,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Other activities")), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, tiles.map(t => /*#__PURE__*/React.createElement(__ds_scope.BoardTile, _extends({
    key: t.id
  }, t, {
    onClick: () => onOpen && onOpen(t.id)
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 0",
      color: "var(--muted)",
      fontSize: 13,
      lineHeight: 1.5
    }
  }, "Progress, filters, scoring, audio and review history remain attached to each quiz."));
}
Object.assign(__ds_scope, { BoardScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spanish-quizzes-app/BoardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spanish-quizzes-app/Drawer.jsx
try { (() => {
const row = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  minHeight: 52,
  padding: "0 14px",
  border: "var(--border-width) solid var(--border-ink)",
  borderRadius: 10,
  background: "var(--paper)",
  color: "var(--ink)",
  fontFamily: "var(--font-body)",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "left"
};
const panel = {
  marginTop: -4,
  padding: "10px 14px",
  borderRadius: 10,
  background: "var(--panel-soft)",
  color: "var(--muted)",
  fontSize: 13,
  display: "flex",
  flexDirection: "column",
  gap: 4
};
const sub = {
  margin: "10px 0 4px",
  color: "var(--ink)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: ".08em",
  textTransform: "uppercase"
};
const li = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 8,
  padding: "4px 0",
  borderBottom: "var(--border-width-hair) solid var(--line)",
  fontSize: 12
};
const action = {
  minHeight: 44,
  border: "var(--border-width) solid var(--border-ink)",
  borderRadius: 8,
  background: "var(--surface)",
  color: "var(--ink)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer"
};

/* Repo: app/drawer.tsx */
function Drawer({
  onClose,
  notebook = []
}) {
  const [open, setOpen] = React.useState(null);
  const t = k => setOpen(o => o === k ? null : k);
  const arrow = k => /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, open === k ? "\uFE3F" : "\u2192");
  return /*#__PURE__*/React.createElement("div", {
    role: "presentation",
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 40,
      display: "flex",
      background: "rgba(44, 43, 41, .5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Menu",
    onClick: e => e.stopPropagation(),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      width: 290,
      maxWidth: "85%",
      height: "100%",
      padding: "20px 18px",
      borderRight: "3px solid var(--border-ink)",
      background: "var(--surface)",
      overflowY: "auto",
      scrollbarWidth: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 19,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    size: 24
  }), /*#__PURE__*/React.createElement("span", null, "Spanish Quizzes")), /*#__PURE__*/React.createElement(__ds_scope.IconSquare, {
    icon: "close",
    size: 40,
    radius: 10,
    label: "Close menu",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      padding: "12px 14px",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 14,
      background: "var(--sun-soft)",
      fontSize: 13,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, "12-day streak"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 12,
      fontWeight: 400
    }
  }, "81% accuracy this week")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: row,
    onClick: () => t("history")
  }, /*#__PURE__*/React.createElement("span", null, "Progress & history"), arrow("history")), open === "history" ? /*#__PURE__*/React.createElement("div", {
    style: panel
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "34 rounds played \xB7 78% average accuracy"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "74 of 500 flashcards studied"), /*#__PURE__*/React.createElement("p", {
    style: sub
  }, "Weak areas"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("li", {
    style: li
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink)",
      fontWeight: 600
    }
  }, "Tense"), /*#__PURE__*/React.createElement("span", null, "31% missed (11/35)")), /*#__PURE__*/React.createElement("li", {
    style: {
      ...li,
      borderBottom: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink)",
      fontWeight: 600
    }
  }, "Verb"), /*#__PURE__*/React.createElement("span", null, "18% missed (7/40)"))), /*#__PURE__*/React.createElement("p", {
    style: sub
  }, "Recent rounds"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("li", {
    style: li
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink)",
      fontWeight: 600
    }
  }, "Preterite vs Imperfect"), /*#__PURE__*/React.createElement("span", null, "80%")), /*#__PURE__*/React.createElement("li", {
    style: {
      ...li,
      borderBottom: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink)",
      fontWeight: 600
    }
  }, "Gustar Patterns (review)"), /*#__PURE__*/React.createElement("span", null, "100%")))) : null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: row,
    onClick: () => t("recap")
  }, /*#__PURE__*/React.createElement("span", null, "Weekly recap"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "3px 10px",
      borderRadius: "var(--radius-pill)",
      background: "var(--sun)",
      color: "var(--ink)",
      fontSize: 11,
      fontWeight: 700
    }
  }, "New")), open === "recap" ? /*#__PURE__*/React.createElement("div", {
    style: panel
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "9 rounds this week \xB7 81% accuracy")) : null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: row,
    onClick: () => t("notebook")
  }, /*#__PURE__*/React.createElement("span", null, "Mistake notebook"), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 24,
      padding: "2px 8px",
      borderRadius: "var(--radius-pill)",
      background: "var(--clay-soft)",
      color: "var(--clay)",
      fontSize: 12,
      fontWeight: 700,
      textAlign: "center"
    }
  }, notebook.length)), open === "notebook" ? /*#__PURE__*/React.createElement("div", {
    style: panel
  }, notebook.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, notebook.map(r => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: r,
    tone: "clay",
    size: "sm"
  }, r))) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "No missed rules yet.")) : null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: row,
    onClick: () => t("backup")
  }, /*#__PURE__*/React.createElement("span", null, "Backup & restore"), arrow("backup")), open === "backup" ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...panel,
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: action
  }, "Download backup"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: action
  }, "Import backup")) : null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: row,
    onClick: () => t("settings")
  }, /*#__PURE__*/React.createElement("span", null, "Settings"), arrow("settings")), open === "settings" ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...panel,
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      ...action,
      borderColor: "var(--danger)",
      background: "var(--danger-soft)",
      color: "var(--danger)"
    }
  }, "Reset all progress"), /*#__PURE__*/React.createElement("p", {
    style: sub
  }, "Finished activities"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "No finished activities yet.")) : null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: row
  }, /*#__PURE__*/React.createElement("span", null, "How to use"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: row
  }, /*#__PURE__*/React.createElement("span", null, "Notes"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192")))));
}
Object.assign(__ds_scope, { Drawer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spanish-quizzes-app/Drawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spanish-quizzes-app/FlashcardsScreen.jsx
try { (() => {
const dotBg = {
  current: "var(--clay-soft)",
  next: "var(--sun-soft)",
  mastered: "var(--sage-soft)",
  unreached: "var(--surface)"
};
const boxState = (b, cur) => b === cur ? "current" : b === cur + 1 ? "next" : b === 4 ? "mastered" : "unreached";
const dueCopy = b => ({
  1: "due now",
  2: "due in 1 day",
  3: "due in 3 days",
  4: "due in 7 days"
})[b];

/* Repo: app/flashcards.tsx */
function FlashcardsScreen({
  cards = [],
  index = 0,
  revealed = false,
  difficulty = "all",
  counts,
  onDifficulty,
  onReveal,
  onGrade,
  onBack
}) {
  const card = cards[index];
  const box = card ? card.box : 1;
  const bigBtn = {
    flex: 1,
    minHeight: 54,
    border: "var(--border-width) solid var(--border-ink)",
    borderRadius: 10,
    boxShadow: "var(--hard-shadow)",
    cursor: "pointer"
  };
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      scrollbarWidth: "none",
      padding: "22px 10px 42px"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconSquare, {
    icon: "back",
    size: 40,
    label: "Back to board",
    onClick: onBack
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: "var(--muted)",
      fontSize: 13,
      fontWeight: 700
    }
  }, "Card ", index + 1, " of ", cards.length), /*#__PURE__*/React.createElement("div", {
    "aria-label": "Leitner box progress",
    style: {
      display: "flex",
      gap: 4
    }
  }, [1, 2, 3, 4].map(b => /*#__PURE__*/React.createElement("span", {
    key: b,
    style: {
      width: 15,
      height: 15,
      border: "var(--border-width) solid var(--border-ink)",
      background: dotBg[boxState(b, box)]
    }
  })))), /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Filter by difficulty",
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 14
    }
  }, ["all", "easy", "medium", "hard"].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    type: "button",
    "aria-pressed": difficulty === d,
    onClick: () => onDifficulty && onDifficulty(d),
    style: {
      flex: 1,
      minHeight: 36,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 10,
      cursor: "pointer",
      background: difficulty === d ? "var(--clay-soft)" : "var(--surface)",
      color: "var(--ink)",
      fontFamily: "var(--font-body)",
      fontSize: 13,
      fontWeight: 700
    }
  }, d[0].toUpperCase() + d.slice(1)))), /*#__PURE__*/React.createElement("section", {
    "aria-live": "polite",
    style: {
      display: "flex",
      flexDirection: "column",
      minHeight: 420
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FlashCard, {
    term: card.term,
    meaning: card.meaning,
    example: card.example,
    exampleEnglish: card.exampleEnglish,
    meta: `Box ${box} · ${dueCopy(box)}`,
    revealed: revealed,
    onReveal: onReveal
  }), /*#__PURE__*/React.createElement("footer", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 16
    }
  }, !revealed ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qs-press",
    onClick: onReveal,
    style: {
      ...bigBtn,
      background: "var(--primary)",
      color: "var(--primary-ink)",
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600
    }
  }, "Reveal") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Not OK",
    className: "qs-press",
    onClick: () => onGrade(false),
    style: {
      ...bigBtn,
      background: "var(--danger-soft)",
      color: "var(--danger)",
      fontSize: 26,
      fontWeight: 900,
      WebkitTextStroke: "1px currentColor"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2716")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "OK",
    className: "qs-press",
    onClick: () => onGrade(true),
    style: {
      ...bigBtn,
      background: "var(--success-soft)",
      color: "var(--ink)",
      fontSize: 26,
      fontWeight: 900,
      WebkitTextStroke: "1px currentColor"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2714"))))), /*#__PURE__*/React.createElement(__ds_scope.LeitnerBoxes, {
    counts: counts,
    style: {
      marginTop: 22
    }
  }));
}
Object.assign(__ds_scope, { FlashcardsScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spanish-quizzes-app/FlashcardsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spanish-quizzes-app/ResultsScreen.jsx
try { (() => {
const eyebrow = {
  margin: 0,
  color: "var(--muted)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".14em",
  textTransform: "uppercase"
};
const clay = {
  margin: 0,
  color: "var(--clay)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".12em",
  textTransform: "uppercase"
};

/* Repo: app/results.tsx + app/support-prompt.tsx */
function ResultsScreen({
  score = 0,
  total = 0,
  rules = [],
  streak = 12,
  hasMissed,
  onPractise,
  onBoard
}) {
  const percent = total ? Math.round(score / total * 100) : 0;
  const headline = total === 0 ? "Round skipped." : score >= total - 1 ? "Casi perfecto." : score >= total / 2 ? "Solid round." : "Worth another pass.";
  const btn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "var(--border-width) solid var(--border-ink)",
    borderRadius: 10,
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%"
  };
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      scrollbarWidth: "none",
      padding: "22px 10px 42px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: clay
  }, "Round complete"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 18px",
      fontFamily: "var(--font-display)",
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1.05
    }
  }, headline), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 20,
      marginBottom: 18,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "16px 26px 12px 32px",
      background: "var(--surface)",
      boxShadow: "var(--hard-shadow)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 52,
      fontWeight: 600,
      lineHeight: .9
    }
  }, score), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontSize: 17
    }
  }, "of ", total, " correct")), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      height: 12,
      marginTop: 14,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 4,
      background: "var(--surface)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height: "100%",
      width: percent + "%",
      background: "var(--sage)"
    }
  })), streak > 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      color: "var(--muted)",
      fontSize: 14
    }
  }, "Streak extended to ", streak, " days.") : null), rules.length ? /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 16,
      marginBottom: 18,
      borderRadius: "26px 14px 30px 14px",
      background: "var(--panel)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Added to your mistake notebook"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 10
    }
  }, rules.map(r => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: r,
    tone: "clay",
    size: "sm"
  }, r))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      color: "var(--muted)",
      fontSize: 13
    }
  }, "These come back as cards tomorrow, and in your next round here.")) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: "auto",
      paddingTop: 18
    }
  }, hasMissed ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qs-press",
    onClick: onPractise,
    style: {
      ...btn,
      minHeight: 56,
      background: "var(--paper-white)",
      color: "var(--ink)",
      fontSize: 18,
      boxShadow: "var(--hard-shadow)"
    }
  }, "Practise the misses") : null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qs-press",
    onClick: onBoard,
    style: {
      ...btn,
      minHeight: 50,
      background: "var(--surface)",
      color: "var(--ink)",
      fontSize: 16,
      boxShadow: "var(--hard-shadow)"
    }
  }, "Back to board")), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 14,
      marginTop: 18,
      border: "var(--border-width) dashed var(--line)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 16,
      fontWeight: 600
    }
  }, "If you liked it, consider supporting this project.")));
}
Object.assign(__ds_scope, { ResultsScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spanish-quizzes-app/ResultsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spanish-quizzes-app/RoundScreen.jsx
try { (() => {
const clay = {
  margin: 0,
  color: "var(--clay)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".12em",
  textTransform: "uppercase"
};
const ACCENTS = ["\u00e1", "\u00e9", "\u00ed", "\u00f3", "\u00fa", "\u00f1"];
const norm = s => (s || "").trim().toLowerCase();

/* Repo: app/round.tsx — Choose and Type modes */
function RoundScreen({
  eyebrow,
  question,
  index,
  total,
  mode = "choose",
  picked,
  submitted,
  typed = "",
  onTyped,
  onCommit,
  onNext,
  onSkip,
  onBack
}) {
  const isLast = index === total - 1;
  const correct = picked != null && norm(picked) === norm(question.answer);
  const state = c => !submitted ? "idle" : c === question.answer ? "correct" : c === picked ? "wrong" : "other";
  const primaryLabel = mode === "type" && !submitted ? "Check" : !submitted ? "Pick an answer" : isLast ? "See results" : "Next question";
  const primaryDisabled = mode === "type" ? !submitted && !typed.trim() : !submitted;
  const primary = mode === "type" && !submitted ? () => typed.trim() && onCommit(typed) : onNext;
  const blank = submitted ? question.answer : mode === "type" ? typed || question.infinitive : question.infinitive;
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
      paddingTop: 22
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.QuizHeader, {
    current: index + 1,
    total: total,
    onBack: onBack
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      flex: "none",
      margin: "14px 18px 0",
      padding: 18,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "16px 26px 12px 32px",
      background: "var(--surface)",
      boxShadow: "var(--hard-shadow)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: clay
  }, eyebrow), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "4px 10px",
      borderRadius: "var(--radius-pill)",
      background: "var(--primary-soft)",
      color: "var(--ink)",
      fontSize: 12,
      fontWeight: 700
    }
  }, question.level)), /*#__PURE__*/React.createElement("p", {
    lang: "es",
    style: {
      margin: 0,
      fontSize: 23,
      fontWeight: 700,
      lineHeight: 1.4
    }
  }, question.before, " ", /*#__PURE__*/React.createElement(__ds_scope.InlineBlank, {
    value: blank,
    filled: !!submitted,
    width: "86px"
  }), " ", question.after), /*#__PURE__*/React.createElement("p", {
    lang: "en",
    style: {
      margin: "8px 0 0",
      color: "var(--muted)",
      fontSize: 16,
      lineHeight: 1.45
    }
  }, question.en)), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-end",
      gap: 10,
      padding: "14px 18px",
      overflowY: "auto",
      scrollbarWidth: "none"
    }
  }, !submitted ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: 48,
      padding: "0 4px",
      border: "var(--border-width) dashed var(--line)",
      borderRadius: 10,
      background: "none",
      color: "var(--muted)",
      fontFamily: "inherit",
      fontSize: 13,
      textAlign: "left",
      cursor: "pointer"
    }
  }, "Stuck? Open the conjugation chart") : null, mode === "choose" ? question.choices.map(c => /*#__PURE__*/React.createElement(__ds_scope.AnswerOption, {
    key: c,
    state: state(c),
    disabled: !!submitted,
    onClick: () => onCommit(c)
  }, c)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    lang: "es",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    placeholder: "Type the missing form",
    "aria-label": `Type your answer for question ${index + 1}`,
    value: submitted ? picked : typed,
    disabled: !!submitted,
    state: submitted ? correct ? "correct" : "wrong" : undefined,
    onChange: e => onTyped && onTyped(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") {
        e.preventDefault();
        typed.trim() && onCommit(typed);
      }
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Accented letters",
    style: {
      display: "flex",
      gap: 6,
      overflowX: "auto",
      padding: "8px 2px",
      borderTop: "var(--border-width) solid var(--line)",
      background: "var(--panel)"
    }
  }, ACCENTS.map(ch => /*#__PURE__*/React.createElement("button", {
    key: ch,
    type: "button",
    disabled: !!submitted,
    onClick: () => onTyped && onTyped(typed + ch),
    style: {
      minWidth: 40,
      minHeight: 38,
      flex: "none",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 8,
      background: "var(--sun-soft)",
      color: "var(--ink)",
      fontSize: 17,
      cursor: "pointer"
    }
  }, ch)))), submitted ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 12,
      background: correct ? "var(--sage-soft)" : "var(--clay-soft)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginBottom: 6,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: correct ? "var(--sage)" : "var(--clay)"
    }
  }, correct ? "Correct" : `Not quite \u2014 ${question.answer}`), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      lineHeight: 1.55
    }
  }, question.explanation)) : null), /*#__PURE__*/React.createElement("footer", {
    style: {
      display: "flex",
      flex: "none",
      gap: 10,
      padding: "14px 18px",
      borderTop: "var(--border-width) solid var(--border-ink)",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSkip,
    style: {
      flex: "none",
      minHeight: 56,
      padding: "0 18px",
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 10,
      background: "var(--surface)",
      color: "var(--ink)",
      fontFamily: "var(--font-display)",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Skip"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: primaryDisabled,
    onClick: primary,
    className: primaryDisabled ? undefined : "qs-press",
    style: primaryDisabled ? {
      flex: 1,
      minHeight: 56,
      border: "var(--border-width) solid var(--line)",
      borderRadius: 10,
      background: "var(--panel)",
      color: "var(--muted)",
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600
    } : {
      flex: 1,
      minHeight: 56,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 10,
      background: "var(--primary)",
      color: "var(--primary-ink)",
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600,
      boxShadow: "var(--hard-shadow)",
      cursor: "pointer"
    }
  }, primaryLabel)));
}
Object.assign(__ds_scope, { RoundScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spanish-quizzes-app/RoundScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/spanish-quizzes-app/TopicScreen.jsx
try { (() => {
const eyebrow = {
  margin: 0,
  color: "var(--muted)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".14em",
  textTransform: "uppercase"
};
const clay = {
  margin: 0,
  color: "var(--clay)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".12em",
  textTransform: "uppercase"
};

/* Repo: app/topic-detail.tsx */
function TopicScreen({
  title,
  percent = 20,
  completed = 12,
  total = 60,
  accuracy = 83,
  due = 4,
  roundLength,
  mode,
  onRoundLength,
  onMode,
  onBack,
  onStart
}) {
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      scrollbarWidth: "none",
      padding: "22px 10px 0"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconSquare, {
    icon: "back",
    label: "Back to board",
    onClick: onBack
  }), /*#__PURE__*/React.createElement("p", {
    style: clay
  }, "Grammar quiz")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 16px",
      fontFamily: "var(--font-display)",
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1.05
    }
  }, title), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: 18,
      marginBottom: 22,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: "16px 26px 12px 32px",
      background: "var(--surface)",
      boxShadow: "var(--hard-shadow)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ScoreRing, {
    percent: percent,
    size: 84
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      fontWeight: 700
    }
  }, completed, " of ", total, " questions"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--muted)",
      fontSize: 13,
      lineHeight: 1.5
    }
  }, "Accuracy ", accuracy, "% \xB7 ", due, " due today"))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...eyebrow,
      marginBottom: 8
    }
  }, "Round length"), /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Round length",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 8
    }
  }, [5, 10, 20].map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    type: "button",
    "aria-pressed": roundLength === n,
    onClick: () => onRoundLength && onRoundLength(n),
    style: {
      minHeight: 48,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 10,
      cursor: "pointer",
      background: roundLength === n ? "var(--primary-soft)" : "var(--surface)",
      color: "var(--ink)",
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600
    }
  }, n)))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...eyebrow,
      marginBottom: 8
    }
  }, "Answer mode"), /*#__PURE__*/React.createElement(__ds_scope.SegmentedControl, {
    options: [{
      value: "choose",
      label: "Choose"
    }, {
      value: "type",
      label: "Type"
    }],
    value: mode,
    onChange: onMode
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      color: "var(--muted)",
      fontSize: 12
    }
  }, mode === "choose" ? "Pick from three options. Fastest way through a round." : "You write the verb yourself \u2014 harder, and it sticks better.")), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...eyebrow,
      marginBottom: 8
    }
  }, "Filters"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Select, {
    id: "lvl",
    label: "Difficulty",
    options: [{
      value: "all",
      label: "All levels"
    }, {
      value: "basic",
      label: "Basic"
    }, {
      value: "intermediate",
      label: "Intermediate"
    }, {
      value: "advanced",
      label: "Advanced"
    }]
  }), /*#__PURE__*/React.createElement(__ds_scope.Select, {
    id: "verb",
    label: "Verb",
    options: [{
      value: "all",
      label: "All verbs"
    }, "ir", "preparar", "salir", "llegar", "vivir"]
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      color: "var(--muted)",
      fontSize: 12
    }
  }, total, " sentences selected")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      minHeight: 52,
      padding: "0 14px",
      marginBottom: 14,
      borderRadius: 14,
      background: "var(--panel-soft)",
      color: "var(--ink)",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: 24,
      height: 24,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 5,
      background: "var(--surface)",
      fontSize: 13
    }
  }, "\u25A6"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 15,
      fontWeight: 600
    }
  }, "Verb conjugation chart"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--muted)"
    }
  }, "\u2192")), /*#__PURE__*/React.createElement("footer", {
    style: {
      position: "sticky",
      bottom: 0,
      marginTop: "auto",
      padding: "14px 0 16px",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onStart,
    className: "qs-press",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minHeight: 56,
      border: "var(--border-width) solid var(--border-ink)",
      borderRadius: 10,
      background: "var(--primary)",
      color: "var(--primary-ink)",
      fontFamily: "var(--font-display)",
      fontSize: 19,
      fontWeight: 600,
      boxShadow: "var(--hard-shadow)",
      cursor: "pointer"
    }
  }, "Start round of ", roundLength)));
}
Object.assign(__ds_scope, { TopicScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/spanish-quizzes-app/TopicScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.AnswerOption = __ds_scope.AnswerOption;

__ds_ns.InlineBlank = __ds_scope.InlineBlank;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.LeitnerBoxes = __ds_scope.LeitnerBoxes;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.ScoreRing = __ds_scope.ScoreRing;

__ds_ns.StreakStrip = __ds_scope.StreakStrip;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.BoardTile = __ds_scope.BoardTile;

__ds_ns.FlashCard = __ds_scope.FlashCard;

__ds_ns.GLYPHS = __ds_scope.GLYPHS;

__ds_ns.Glyph = __ds_scope.Glyph;

__ds_ns.IconSquare = __ds_scope.IconSquare;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.PhoneFrame = __ds_scope.PhoneFrame;

__ds_ns.QuizHeader = __ds_scope.QuizHeader;

__ds_ns.BoardScreen = __ds_scope.BoardScreen;

__ds_ns.Drawer = __ds_scope.Drawer;

__ds_ns.FlashcardsScreen = __ds_scope.FlashcardsScreen;

__ds_ns.ResultsScreen = __ds_scope.ResultsScreen;

__ds_ns.RoundScreen = __ds_scope.RoundScreen;

__ds_ns.TopicScreen = __ds_scope.TopicScreen;

})();
