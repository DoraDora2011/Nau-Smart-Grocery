"use client";

export type UiSound = "tap" | "cart" | "scan";

type BrowserAudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

type Tone = {
  duration: number;
  endFrequency?: number;
  frequency: number;
  gain: number;
  offset: number;
  type: OscillatorType;
};

const MIN_PLAY_GAP: Record<UiSound, number> = {
  tap: 70,
  cart: 180,
  scan: 160
};

const SOUND_TONES: Record<UiSound, Tone[]> = {
  tap: [
    {
      duration: 0.055,
      endFrequency: 610,
      frequency: 520,
      gain: 0.024,
      offset: 0,
      type: "triangle"
    },
    {
      duration: 0.04,
      frequency: 1040,
      gain: 0.01,
      offset: 0.004,
      type: "sine"
    }
  ],
  cart: [
    {
      duration: 0.1,
      endFrequency: 587,
      frequency: 523,
      gain: 0.028,
      offset: 0,
      type: "triangle"
    },
    {
      duration: 0.22,
      endFrequency: 740,
      frequency: 659,
      gain: 0.034,
      offset: 0.055,
      type: "sine"
    }
  ],
  scan: [
    {
      duration: 0.1,
      endFrequency: 720,
      frequency: 392,
      gain: 0.026,
      offset: 0,
      type: "sine"
    },
    {
      duration: 0.09,
      endFrequency: 960,
      frequency: 720,
      gain: 0.022,
      offset: 0.055,
      type: "triangle"
    }
  ]
};

let audioContext: AudioContext | null = null;
const lastPlayedAt = new Map<UiSound, number>();

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (audioContext) {
    return audioContext;
  }

  const BrowserAudioContext =
    window.AudioContext ?? (window as BrowserAudioWindow).webkitAudioContext;

  if (!BrowserAudioContext) {
    return null;
  }

  audioContext = new BrowserAudioContext();

  return audioContext;
}

function scheduleTone(context: AudioContext, tone: Tone) {
  const startAt = context.currentTime + tone.offset;
  const stopAt = startAt + tone.duration;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = tone.type;
  oscillator.frequency.setValueAtTime(tone.frequency, startAt);

  if (tone.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(tone.endFrequency, stopAt);
  }

  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(tone.gain, startAt + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, stopAt);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startAt);
  oscillator.stop(stopAt + 0.01);

  oscillator.addEventListener("ended", () => {
    oscillator.disconnect();
    gainNode.disconnect();
  });
}

function scheduleSound(context: AudioContext, sound: UiSound) {
  SOUND_TONES[sound].forEach((tone) => scheduleTone(context, tone));
}

export function playUiSound(sound: UiSound) {
  const now = Date.now();
  const lastPlayed = lastPlayedAt.get(sound) ?? 0;

  if (now - lastPlayed < MIN_PLAY_GAP[sound]) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  lastPlayedAt.set(sound, now);

  if (context.state === "suspended") {
    void context.resume().then(() => scheduleSound(context, sound));
    return;
  }

  scheduleSound(context, sound);
}
