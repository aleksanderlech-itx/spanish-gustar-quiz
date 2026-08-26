let cachedVoice: SpeechSynthesisVoice | null = null;

const supportsSpeech = () => typeof window !== "undefined" && "speechSynthesis" in window;

const pickSpanishVoice = (): SpeechSynthesisVoice | null => {
  if (!supportsSpeech()) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang.toLowerCase().startsWith("es")) ?? null;
};

if (supportsSpeech()) {
  cachedVoice = pickSpanishVoice();
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    cachedVoice = pickSpanishVoice();
  });
}

const utteranceFor = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.9;
  const voice = cachedVoice ?? pickSpanishVoice();
  if (voice) utterance.voice = voice;
  return utterance;
};

export const cancelSpeech = () => {
  if (supportsSpeech()) window.speechSynthesis.cancel();
};

/** Speaks one phrase, cancelling anything already in flight. */
export const speak = (text: string, { onStart, onEnd }: { onStart?: () => void; onEnd?: () => void } = {}) => {
  if (!supportsSpeech()) return;
  window.speechSynthesis.cancel();
  const utterance = utteranceFor(text);
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
};

/** Speaks a list of items in order (e.g. a verb paradigm), reporting which item is currently playing. */
export const speakQueue = (
  items: Array<{ id: string; text: string }>,
  { onItemStart, onItemEnd, onDone }: { onItemStart?: (id: string) => void; onItemEnd?: (id: string) => void; onDone?: () => void },
) => {
  if (!supportsSpeech() || items.length === 0) {
    onDone?.();
    return;
  }
  window.speechSynthesis.cancel();
  let position = 0;

  const playNext = () => {
    if (position >= items.length) {
      onDone?.();
      return;
    }
    const item = items[position];
    position += 1;
    const utterance = utteranceFor(item.text);
    utterance.onstart = () => onItemStart?.(item.id);
    utterance.onend = () => { onItemEnd?.(item.id); playNext(); };
    utterance.onerror = () => { onItemEnd?.(item.id); playNext(); };
    window.speechSynthesis.speak(utterance);
  };

  playNext();
};
