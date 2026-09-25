# Approved dark palette

Status: approved by the user on 25 September 2026 and applied to the runtime theme. This file remains the static review record.

Open [dark-preview.html](dark-preview.html). This self-contained static board embeds Fraunces 400/600 and Karla 400/600/700 fonts. All six panels are explicitly illustrative: Library, Quiz with success/error feedback, revealed Flashcard, Results, Practice options, and open drawer. Controls are inactive; no app state, persistence, routing, network calls or production imports are present.

## Proposed semantic tokens

| Role | Hex |
|---|---|
| paper | `#1F1D1A` |
| surface | `#2B2824` |
| raised | `#35312C` |
| ink | `#F8EDE1` |
| muted | `#C9BDB0` |
| primary | `#8BD3C7` |
| onPrimary | `#142B27` |
| border | `#665E54` |
| controlBorder | `#A49788` |
| selected | `#243E38` |
| successText | `#B8E3AE` |
| successSurface | `#253629` |
| errorText | `#FFC1B5` |
| errorSurface | `#482B29` |
| gold | `#F5BC60` |
| clay | `#E59B7F` |
| segmentTrack | `#39332D` |

Keep the approved typography, spacing, control targets and editorial corner geometry. Display text uses Fraunces; controls/body use Karla. Primary button text uses onPrimary, not white. Gold badges use paper text. Selected rows use ink text, primary outline and selected fill. Meaningful control edges use controlBorder; border is decorative only.

The brand mark retains exact #00625D / #C4553F / #F2A81D fills and #2C2B29 stroke on a #FFFAF3 light backing. The mark itself is 24px; the backing adds 4px on each side. The logo is decorative beside the wordmark.

Production styling uses a warm charcoal canvas, slightly raised warm surfaces, cream reading text, and soft teal actions. Paired success/error colors carry explicit outcome text. Focus uses the primary teal at 3px with 3px offset.

## Calculated contrast

Computed using WCAG relative luminance for opaque sRGB hex pairs: channel / 12.92 at channel <= 0.04045; otherwise ((channel + 0.055) / 1.055)^2.4; luminance weights 0.2126 / 0.7152 / 0.0722; contrast (lighter + 0.05) / (darker + 0.05).

| Foreground | Background | Ratio |
|---|---|---:|
| ink | paper | 14.57:1 |
| ink | surface | 12.71:1 |
| muted | paper | 9.12:1 |
| muted | surface | 7.96:1 |
| onPrimary | primary | 8.71:1 |
| primary | paper | 9.80:1 |
| primary | surface | 8.55:1 |
| primary | selected | 6.72:1 |
| successText | successSurface | 8.93:1 |
| errorText | errorSurface | 8.19:1 |
| ink | selected | 9.99:1 |
| controlBorder | paper | 5.89:1 |
| controlBorder | surface | 5.14:1 |
| controlBorder | segmentTrack | 4.37:1 |
| paper | gold | 9.80:1 |
| clay | surface | 6.51:1 |
| primary | segmentTrack | 7.26:1 |

All listed text pairs exceed 4.5:1. Control boundaries exceed 3:1 on paper, surface and segmentTrack. Primary focus/progress indicators exceed 3:1 against paper, surface, selected and segmentTrack. The quiet decorative border is not used as the sole meaningful control edge. Logo artwork is a fixed brand asset, not a control/status indicator.

## Behavior and layout boundary

- Six activities reflect latest main; four flashcard boxes; visible Again / Got it assessment labels after reveal.
- Quiz feedback is immediate. Sample success and error panels show alternative outcomes, not two concurrent production outcomes.
- Current local progress, backup formats, filters, grading, routes and action timing remain owned by the application. Counts, streak, score and answer content here are illustrative.
- Practice controls illustrate visual treatment only, not new settings or a new route.
- Review-board columns are presentation scaffolding. Production exercise content max 640px; library max 1120px with a grid from 768px when cards fit.
- Drawer panel is a static visual sample, not an implemented modal. Production retains its real close control, focus trapping/restoration, background handling, scrolling and keyboard dismissal.
- The preview remains static; the approved production palette lives in `app/quiz-layout-fix.css` and its mirror in `design-system/tokens/colors.css`.

## Verification and limits

Static checks: six labeled panels; six actual activity labels; four box labels; embedded fonts; exact brand colors; no external assets or scripts; static-preview notice; viewport meta and narrow layout rules. Contrast is calculated, not an accessibility certification. Browser rendering, zoom, keyboard, focus and production state checks remain part of integration validation.

Fonts embedded from Google Fonts: Fraunces and Karla. Original source CSS: https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Karla:wght@400;600;700&display=swap .
