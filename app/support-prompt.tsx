import KofiButton from "./kofi-button";

export default function SupportPrompt() {
  return (
    <section className="results-support">
      <p className="results-support-question">If you liked it, consider supporting this project.</p>
      <KofiButton className="results-kofi-link" />
    </section>
  );
}
