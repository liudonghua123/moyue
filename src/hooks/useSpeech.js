import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 诗词朗读（Web Speech API）。
 * 慢速中文逐句朗读：依次朗读每句诗，最后读「诗题 · 朝代 · 作者」落款。
 *
 * @param {{ title: string, dynasty: string, author: string, lines: string[] }} poem
 * @returns {{ playing: boolean, speakingIndex: number, toggle: () => void, stop: () => void }}
 */
export function useSpeech(poem) {
  const [playing, setPlaying] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(-1);
  const playingRef = useRef(false);
  const voiceRef = useRef(null);

  // 挑选中文语音（优先男声，其次任意 zh-CN / zh）
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const pick = () => {
      const voices = synth.getVoices();
      voiceRef.current =
        voices.find((v) => /zh[-_]CN/i.test(v.lang) && /Yun|Kang|Liang|Male/i.test(v.name)) ??
        voices.find((v) => /zh[-_]CN/i.test(v.lang)) ??
        voices.find((v) => /^zh/i.test(v.lang)) ??
        null;
    };
    pick();
    synth.addEventListener?.("voiceschanged", pick);
    return () => synth.removeEventListener?.("voiceschanged", pick);
  }, []);

  const stop = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    setSpeakingIndex(-1);
    window.speechSynthesis?.cancel();
  }, []);

  const toggle = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (playingRef.current) {
      stop();
      return;
    }
    playingRef.current = true;
    setPlaying(true);

    const seq = [...poem.lines, `${poem.title}，${poem.dynasty}，${poem.author}。`];
    let i = 0;
    const next = () => {
      if (!playingRef.current) return;
      if (i >= seq.length) {
        stop();
        return;
      }
      setSpeakingIndex(i < poem.lines.length ? i : -1);
      const utterance = new SpeechSynthesisUtterance(seq[i]);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.lang = "zh-CN";
      utterance.rate = 0.82; // 诗要慢读
      utterance.pitch = 0.95;
      utterance.onend = () => {
        i += 1;
        next();
      };
      utterance.onerror = stop;
      synth.speak(utterance);
    };
    next();
  }, [poem, stop]);

  // 卸载 / 切诗时停止
  useEffect(() => stop, [stop, poem.id]);

  // Esc 停止
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && playingRef.current && stop();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stop]);

  return { playing, speakingIndex, toggle, stop };
}
