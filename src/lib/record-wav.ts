// Mic → 16 kHz mono 16-bit PCM WAV. Web Audio path (works on iOS Safari).

export type Recorder = {
  stop: () => Promise<Blob>;
  cancel: () => void;
  getLevel: () => number; // 0..1 rough input level
};

export async function startRecording(): Promise<Recorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const AC: typeof AudioContext =
    window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const source = ctx.createMediaStreamSource(stream);
  const node = ctx.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let level = 0;

  node.onaudioprocess = (e) => {
    const ch = e.inputBuffer.getChannelData(0);
    // copy — the underlying buffer is reused
    chunks.push(new Float32Array(ch));
    let sum = 0;
    for (let i = 0; i < ch.length; i++) sum += ch[i] * ch[i];
    level = Math.min(1, Math.sqrt(sum / ch.length) * 3);
  };
  source.connect(node);
  node.connect(ctx.destination);

  let stopped = false;
  const cleanup = async () => {
    stopped = true;
    stream.getTracks().forEach((t) => t.stop());
    try { node.disconnect(); } catch { /* noop */ }
    try { source.disconnect(); } catch { /* noop */ }
    try { await ctx.close(); } catch { /* noop */ }
  };

  return {
    getLevel: () => level,
    cancel: () => { if (!stopped) void cleanup(); },
    stop: async () => {
      if (stopped) return new Blob();
      const inputRate = ctx.sampleRate;
      await cleanup();
      const pcm = mergeChunks(chunks);
      const down = downsample(pcm, inputRate, 16000);
      return encodeWav(down, 16000);
    },
  };
}

function mergeChunks(chunks: Float32Array[]): Float32Array {
  let len = 0;
  for (const c of chunks) len += c.length;
  const out = new Float32Array(len);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return out;
}

function downsample(buf: Float32Array, from: number, to: number): Float32Array {
  if (to >= from) return buf;
  const ratio = from / to;
  const newLen = Math.round(buf.length / ratio);
  const out = new Float32Array(newLen);
  let i = 0, j = 0;
  while (i < newLen) {
    const next = Math.round((i + 1) * ratio);
    let sum = 0, count = 0;
    for (; j < next && j < buf.length; j++) { sum += buf[j]; count++; }
    out[i++] = count > 0 ? sum / count : 0;
  }
  return out;
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);     // PCM
  view.setUint16(22, 1, true);     // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let off = 44;
  for (let i = 0; i < samples.length; i++, off += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}
