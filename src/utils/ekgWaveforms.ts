// =============================================================================
// EKG Waveform Generation Utilities
// Mathematical generation of clinically realistic ECG waveforms for training.
// All timing in milliseconds, amplitudes in millivolts.
// Standard: 25mm/s paper speed, 10mm/mV calibration.
// =============================================================================

export type EkgPattern =
  | 'normal_sinus'
  | 'sinus_bradycardia'
  | 'sinus_tachycardia'
  | 'afib'
  | 'aflutter'
  | 'svt'
  | 'vt'
  | 'vfib'
  | 'av_block_1'
  | 'av_block_2_type1'
  | 'av_block_2_type2'
  | 'av_block_3'
  | 'lbbb'
  | 'rbbb'
  | 'stemi_anterior'
  | 'stemi_inferior'
  | 'hyperkalemia'
  | 'hypokalemia'
  | 'long_qt'
  | 'pea'
  | 'asystole'
  | 'wpw'
  | 'pericarditis'
  | 'pe'
  | 'digitalis'
  | 'torsade';

export interface WavePoint {
  x: number; // time in ms
  y: number; // amplitude in mV
}

// ---------------------------------------------------------------------------
// Seeded PRNG -- mulberry32 for reproducible randomness
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Lead-specific QRS morphology templates
// ---------------------------------------------------------------------------

interface QrsTemplate {
  qAmp: number;
  rAmp: number;
  sAmp: number;
  // Additional R' for rsR' pattern (RBBB V1)
  rPrimeAmp?: number;
  // QRS duration modifier (ms added)
  qrsDurationMs: number;
  // Whether this lead typically has a notched R (LBBB lateral leads)
  notchedR?: boolean;
}

interface PwaveTemplate {
  amp: number;
  biphasicNeg?: number; // negative component amplitude (V1)
}

interface TwaveTemplate {
  amp: number;
}

function getQrsTemplate(lead: string): QrsTemplate {
  switch (lead) {
    case 'V1':
      return { qAmp: 0, rAmp: 0.15, sAmp: -1.0, qrsDurationMs: 80 };
    case 'V2':
      return { qAmp: 0, rAmp: 0.35, sAmp: -0.8, qrsDurationMs: 80 };
    case 'V3':
      return { qAmp: 0, rAmp: 0.6, sAmp: -0.5, qrsDurationMs: 80 };
    case 'V4':
      return { qAmp: 0, rAmp: 1.0, sAmp: -0.25, qrsDurationMs: 80 };
    case 'V5':
      return { qAmp: -0.08, rAmp: 0.95, sAmp: -0.1, qrsDurationMs: 80 };
    case 'V6':
      return { qAmp: -0.06, rAmp: 0.75, sAmp: 0, qrsDurationMs: 80 };
    case 'I':
      return { qAmp: -0.05, rAmp: 0.6, sAmp: -0.08, qrsDurationMs: 80 };
    case 'II':
      return { qAmp: -0.05, rAmp: 1.0, sAmp: -0.15, qrsDurationMs: 80 };
    case 'III':
      return { qAmp: -0.04, rAmp: 0.4, sAmp: -0.1, qrsDurationMs: 80 };
    case 'aVR':
      return { qAmp: -0.5, rAmp: 0.15, sAmp: 0, qrsDurationMs: 80 };
    case 'aVL':
      return { qAmp: -0.04, rAmp: 0.35, sAmp: -0.05, qrsDurationMs: 80 };
    case 'aVF':
      return { qAmp: -0.03, rAmp: 0.7, sAmp: -0.1, qrsDurationMs: 80 };
    default:
      return { qAmp: -0.05, rAmp: 1.0, sAmp: -0.15, qrsDurationMs: 80 };
  }
}

function getPwaveTemplate(lead: string): PwaveTemplate {
  switch (lead) {
    case 'II':
      return { amp: 0.15 };
    case 'I':
      return { amp: 0.1 };
    case 'III':
      return { amp: 0.06 };
    case 'aVR':
      return { amp: -0.12 };
    case 'aVL':
      return { amp: 0.04 };
    case 'aVF':
      return { amp: 0.1 };
    case 'V1':
      return { amp: 0.08, biphasicNeg: -0.05 };
    case 'V2':
      return { amp: 0.08 };
    case 'V3':
      return { amp: 0.08 };
    case 'V4':
      return { amp: 0.09 };
    case 'V5':
      return { amp: 0.1 };
    case 'V6':
      return { amp: 0.1 };
    default:
      return { amp: 0.15 };
  }
}

function getTwaveTemplate(lead: string): TwaveTemplate {
  switch (lead) {
    case 'II':
      return { amp: 0.3 };
    case 'I':
      return { amp: 0.2 };
    case 'III':
      return { amp: 0.15 };
    case 'aVR':
      return { amp: -0.25 };
    case 'aVL':
      return { amp: 0.1 };
    case 'aVF':
      return { amp: 0.2 };
    case 'V1':
      return { amp: -0.1 };
    case 'V2':
      return { amp: -0.05 };
    case 'V3':
      return { amp: 0.2 };
    case 'V4':
      return { amp: 0.35 };
    case 'V5':
      return { amp: 0.3 };
    case 'V6':
      return { amp: 0.2 };
    default:
      return { amp: 0.3 };
  }
}

// ---------------------------------------------------------------------------
// Piecewise linear interpolation + gaussian blur
// ---------------------------------------------------------------------------

interface Anchor {
  t: number;
  v: number;
}

/** Linearly interpolate between anchor points at 1ms resolution */
function interpAnchors(anchors: Anchor[], startT: number, endT: number): number[] {
  const len = endT - startT;
  const result = new Array<number>(len).fill(0);
  if (anchors.length < 2) return result;

  for (let i = 0; i < len; i++) {
    const t = startT + i;
    // Find surrounding anchors
    if (t <= anchors[0].t) {
      result[i] = anchors[0].v;
      continue;
    }
    if (t >= anchors[anchors.length - 1].t) {
      result[i] = anchors[anchors.length - 1].v;
      continue;
    }
    for (let j = 0; j < anchors.length - 1; j++) {
      if (t >= anchors[j].t && t < anchors[j + 1].t) {
        const frac = (t - anchors[j].t) / (anchors[j + 1].t - anchors[j].t);
        result[i] = anchors[j].v + frac * (anchors[j + 1].v - anchors[j].v);
        break;
      }
    }
  }
  return result;
}

/** Apply a gaussian blur with given sigma (in ms samples) */
function gaussianBlur(data: number[], sigma: number): number[] {
  if (sigma <= 0) return data;
  const radius = Math.ceil(sigma * 3);
  const kernel: number[] = [];
  let sum = 0;
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    kernel.push(v);
    sum += v;
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= sum;

  const result = new Array<number>(data.length);
  for (let i = 0; i < data.length; i++) {
    let acc = 0;
    for (let k = 0; k < kernel.length; k++) {
      const idx = i + k - radius;
      const val = idx < 0 ? data[0] : idx >= data.length ? data[data.length - 1] : data[idx];
      acc += val * kernel[k];
    }
    result[i] = acc;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Primitive wave shapes
// ---------------------------------------------------------------------------

function gaussian(t: number, center: number, sigma: number, amplitude: number): number {
  const exp = -((t - center) ** 2) / (2 * sigma ** 2);
  return amplitude * Math.exp(exp);
}

function asymGaussian(
  t: number,
  center: number,
  sigmaLeft: number,
  sigmaRight: number,
  amplitude: number,
): number {
  const sigma = t < center ? sigmaLeft : sigmaRight;
  return gaussian(t, center, sigma, amplitude);
}


// ---------------------------------------------------------------------------
// Core waveform builder
// ---------------------------------------------------------------------------

/** Build a QRS complex via piecewise linear anchors + gaussian blur */
function buildQrs(
  qrsStartT: number,
  template: QrsTemplate,
  widthScale: number,
): { data: number[]; startT: number; endT: number } {
  const dur = template.qrsDurationMs * widthScale;
  const qDur = dur * 0.12;
  const rUpDur = dur * 0.15;
  const rDownDur = dur * 0.15;
  const sDur = dur * 0.13;

  const anchors: Anchor[] = [];
  let t = qrsStartT;

  // Baseline before Q
  anchors.push({ t, v: 0 });

  // Q trough
  if (Math.abs(template.qAmp) > 0.005) {
    t += qDur * 0.5;
    anchors.push({ t, v: template.qAmp });
    t += qDur * 0.5;
    anchors.push({ t, v: 0 });
  }

  // R peak
  t += rUpDur;
  anchors.push({ t, v: template.rAmp });
  t += rDownDur;
  anchors.push({ t, v: 0 });

  // S trough
  if (Math.abs(template.sAmp) > 0.005) {
    t += sDur * 0.5;
    anchors.push({ t, v: template.sAmp });
    t += sDur * 0.5;
    anchors.push({ t, v: 0 });
  }

  // R' for rsR' pattern
  if (template.rPrimeAmp && Math.abs(template.rPrimeAmp) > 0.005) {
    t += dur * 0.08;
    anchors.push({ t, v: template.rPrimeAmp });
    t += dur * 0.12;
    anchors.push({ t, v: 0 });
  }

  const startT = Math.floor(qrsStartT);
  const endT = Math.ceil(t) + 2;
  const raw = interpAnchors(anchors, startT, endT);
  const smoothed = gaussianBlur(raw, 2); // 2ms gaussian blur

  return { data: smoothed, startT, endT };
}

/** Build a P wave for a given lead */
function buildPwave(
  pStartT: number,
  pDuration: number,
  lead: string,
  amplitudeScale: number,
): { data: number[]; startT: number; endT: number } {
  const template = getPwaveTemplate(lead);
  const amp = template.amp * amplitudeScale;
  const startT = Math.floor(pStartT);
  const endT = Math.ceil(pStartT + pDuration);
  const len = endT - startT;
  const data = new Array<number>(len).fill(0);

  if (template.biphasicNeg !== undefined) {
    // Biphasic P wave (V1): positive then negative
    const posEnd = pDuration * 0.55;
    const negStart = pDuration * 0.45;
    for (let i = 0; i < len; i++) {
      const lt = i;
      if (lt < posEnd) {
        data[i] = amp * Math.sin((lt / posEnd) * Math.PI);
      }
      if (lt > negStart) {
        data[i] += template.biphasicNeg! * amplitudeScale *
          Math.sin(((lt - negStart) / (pDuration - negStart)) * Math.PI);
      }
    }
  } else {
    for (let i = 0; i < len; i++) {
      data[i] = amp * Math.sin((i / pDuration) * Math.PI);
    }
  }

  return { data: gaussianBlur(data, 3), startT, endT };
}

/** Build a T wave for a given lead */
function buildTwave(
  tStartT: number,
  tDuration: number,
  lead: string,
  amplitudeScale: number,
  options?: { peaked?: boolean; peakedWidth?: number; notched?: boolean },
): { data: number[]; startT: number; endT: number } {
  const template = getTwaveTemplate(lead);
  const amp = template.amp * amplitudeScale;
  const startT = Math.floor(tStartT);
  const endT = Math.ceil(tStartT + tDuration);
  const len = endT - startT;
  const data = new Array<number>(len).fill(0);

  if (options?.peaked) {
    // Peaked tent-shaped T wave (hyperkalemia)
    const peakT = tDuration * 0.45;
    const sigma = (options.peakedWidth ?? 80) / 2.35; // FWHM to sigma
    for (let i = 0; i < len; i++) {
      data[i] = Math.abs(amp) * Math.exp(-((i - peakT) ** 2) / (2 * sigma * sigma));
    }
    // Ensure sign
    const sign = amp >= 0 ? 1 : -1;
    for (let i = 0; i < len; i++) data[i] *= sign;
  } else if (options?.notched) {
    // Notched T wave (long QT)
    for (let i = 0; i < len; i++) {
      const phase = i / tDuration;
      const base = Math.sin(phase * Math.PI);
      const notch = 0.15 * Math.sin(phase * Math.PI * 3);
      data[i] = amp * (base - notch);
    }
  } else {
    // Normal asymmetric T wave: slower rise, faster fall
    for (let i = 0; i < len; i++) {
      const phase = i / tDuration;
      // Asymmetric: peak at ~40% of duration
      const asym = Math.sin(phase * Math.PI) * Math.pow(1 - phase, 0.15);
      data[i] = amp * asym;
    }
  }

  return { data: gaussianBlur(data, 4), startT, endT };
}

/** Build a U wave */
function buildUwave(
  uStartT: number,
  uDuration: number,
  amplitude: number,
): { data: number[]; startT: number; endT: number } {
  const startT = Math.floor(uStartT);
  const endT = Math.ceil(uStartT + uDuration);
  const len = endT - startT;
  const data = new Array<number>(len).fill(0);
  for (let i = 0; i < len; i++) {
    data[i] = amplitude * Math.sin((i / uDuration) * Math.PI);
  }
  return { data: gaussianBlur(data, 3), startT, endT };
}

// ---------------------------------------------------------------------------
// Baseline wander and noise
// ---------------------------------------------------------------------------

function baselineWander(t: number): number {
  return 0.03 * Math.sin((2 * Math.PI * t) / 4000) +
    0.015 * Math.sin((2 * Math.PI * t) / 6500);
}

function muscleNoise(rng: () => number): number {
  return (rng() - 0.5) * 2 * 0.012;
}

// ---------------------------------------------------------------------------
// Composite single-beat builder
// ---------------------------------------------------------------------------

interface BeatConfig {
  cycleLength: number;
  pqInterval: number; // time from P start to QRS start
  pDuration: number;
  pPresent: boolean;
  qrsTemplate: QrsTemplate;
  qrsWidthScale: number;
  stOffset: number;
  stConcaveUp?: boolean; // pericarditis morphology
  stScooped?: boolean; // digitalis morphology
  tDuration: number;
  tAmplitudeScale: number;
  tPeaked?: boolean;
  tPeakedWidth?: number;
  tNotched?: boolean;
  uAmplitude: number;
  uDuration: number;
  deltaWave?: boolean;
  deltaDuration?: number;
  deltaAmplitude?: number;
}

function buildSingleBeat(
  config: BeatConfig,
  lead: string,
  rng: () => number,
  ampJitter: number,
): number[] {
  const len = Math.ceil(config.cycleLength);
  const wave = new Array<number>(len).fill(0);

  // Amplitude jitter
  const jScale = 1 + (rng() - 0.5) * 2 * ampJitter;

  // P wave
  if (config.pPresent) {
    const pw = buildPwave(0, config.pDuration, lead, jScale);
    for (let i = 0; i < pw.data.length && pw.startT + i < len; i++) {
      if (pw.startT + i >= 0) wave[pw.startT + i] += pw.data[i];
    }
  }

  // Delta wave (WPW)
  if (config.deltaWave) {
    const dStart = config.pqInterval - (config.deltaDuration ?? 40);
    const dDur = config.deltaDuration ?? 40;
    const dAmp = (config.deltaAmplitude ?? 0.3) * jScale;
    for (let t = 0; t < dDur; t++) {
      const idx = Math.floor(dStart + t);
      if (idx >= 0 && idx < len) {
        wave[idx] += dAmp * (t / dDur);
      }
    }
  }

  // QRS
  const qrsStart = config.pqInterval;
  const tmpl = { ...config.qrsTemplate };
  tmpl.rAmp *= jScale;
  tmpl.qAmp *= jScale;
  tmpl.sAmp *= jScale;
  if (tmpl.rPrimeAmp) tmpl.rPrimeAmp *= jScale;
  const qrs = buildQrs(qrsStart, tmpl, config.qrsWidthScale);
  for (let i = 0; i < qrs.data.length; i++) {
    const idx = qrs.startT + i;
    if (idx >= 0 && idx < len) wave[idx] += qrs.data[i];
  }

  // ST segment
  const qrsEndT = qrs.endT;
  const tStartT = qrsEndT + 20;

  if (Math.abs(config.stOffset) > 0.001) {
    for (let t = qrsEndT; t < tStartT + Math.floor(config.tDuration * 0.3) && t < len; t++) {
      let factor = 1;
      if (t < qrsEndT + 15) {
        factor = (t - qrsEndT) / 15;
      } else if (t > tStartT) {
        factor = Math.max(0, 1 - (t - tStartT) / (config.tDuration * 0.3));
      }
      let stVal = config.stOffset * factor;
      if (config.stConcaveUp && factor > 0.2) {
        // Concave-up morphology for pericarditis
        const frac = (t - qrsEndT) / (tStartT + config.tDuration * 0.3 - qrsEndT);
        stVal *= 1 - 0.3 * Math.sin(frac * Math.PI);
      }
      if (config.stScooped && factor > 0.2) {
        // Scooped morphology for digitalis
        const frac = (t - qrsEndT) / (tStartT + config.tDuration * 0.3 - qrsEndT);
        stVal = -Math.abs(config.stOffset) * Math.sin(frac * Math.PI) * (1 - frac * 0.3);
      }
      if (t < len) wave[t] += stVal;
    }
  }

  // T wave
  const tw = buildTwave(
    tStartT,
    config.tDuration,
    lead,
    config.tAmplitudeScale * jScale,
    {
      peaked: config.tPeaked,
      peakedWidth: config.tPeakedWidth,
      notched: config.tNotched,
    },
  );
  for (let i = 0; i < tw.data.length; i++) {
    const idx = tw.startT + i;
    if (idx >= 0 && idx < len) wave[idx] += tw.data[i];
  }

  // U wave
  if (Math.abs(config.uAmplitude) > 0.001) {
    const uStartT = tStartT + config.tDuration + 10;
    const uw = buildUwave(uStartT, config.uDuration, config.uAmplitude * jScale);
    for (let i = 0; i < uw.data.length; i++) {
      const idx = uw.startT + i;
      if (idx >= 0 && idx < len) wave[idx] += uw.data[i];
    }
  }

  return wave;
}

/** Assemble multiple beats into a WavePoint array with baseline wander and noise */
function assembleBeats(
  beats: number[][],
  rng: () => number,
): WavePoint[] {
  const points: WavePoint[] = [];
  let offset = 0;
  for (const beat of beats) {
    for (let i = 0; i < beat.length; i++) {
      const t = offset + i;
      const y = beat[i] + baselineWander(t) + muscleNoise(rng);
      points.push({ x: t, y });
    }
    offset += beat.length;
  }
  return points;
}

// ---------------------------------------------------------------------------
// Pattern generators
// ---------------------------------------------------------------------------

function normalSinus(lead: string): WavePoint[] {
  const rng = mulberry32(42);
  const beats: number[][] = [];
  const baseCycle = 800; // 75 bpm
  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06; // +/-3%
    const cycle = baseCycle * rrJitter;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: cycle,
          pqInterval: 160,
          pDuration: 80,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: 0,
          tDuration: 160,
          tAmplitudeScale: 1.0,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function sinusBradycardia(lead: string): WavePoint[] {
  const rng = mulberry32(101);
  const beats: number[][] = [];
  const baseCycle = 1200; // 50 bpm
  for (let i = 0; i < 4; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 170,
          pDuration: 90,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: 0,
          tDuration: 180,
          tAmplitudeScale: 1.0,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function sinusTachycardia(lead: string): WavePoint[] {
  const rng = mulberry32(202);
  const beats: number[][] = [];
  const baseCycle = 500; // 120 bpm
  for (let i = 0; i < 6; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 130,
          pDuration: 60,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: 0,
          tDuration: 120,
          tAmplitudeScale: 0.85,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function afib(lead: string): WavePoint[] {
  const rng = mulberry32(303);
  const beats: number[][] = [];
  const numBeats = 8; // more beats for irregular rhythm

  for (let i = 0; i < numBeats; i++) {
    // Irregular RR: 350-900ms
    const rr = 350 + rng() * 550;
    const tmpl = getQrsTemplate(lead);
    // Slight amplitude variation
    const ampVar = 0.85 + rng() * 0.3;
    tmpl.rAmp *= ampVar;
    tmpl.sAmp *= ampVar;

    beats.push(
      buildSingleBeat(
        {
          cycleLength: rr,
          pqInterval: 120,
          pDuration: 60,
          pPresent: false, // no P waves
          qrsTemplate: tmpl,
          qrsWidthScale: 1.0,
          stOffset: 0,
          tDuration: Math.min(140, rr * 0.35),
          tAmplitudeScale: 0.7 + rng() * 0.4,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.02,
      ),
    );
  }

  // Assemble and add f-waves (fibrillatory baseline)
  const points: WavePoint[] = [];
  let offset = 0;
  const fRng = mulberry32(404);
  for (const beat of beats) {
    for (let i = 0; i < beat.length; i++) {
      const t = offset + i;
      // f-waves: irregular small oscillations
      const fWave =
        0.04 * Math.sin(t * 0.08 + fRng() * 0.5) +
        0.03 * Math.sin(t * 0.12 + 1.5) +
        0.02 * Math.sin(t * 0.2 + fRng() * 2) +
        (fRng() - 0.5) * 0.02;

      // Suppress f-waves during QRS
      const inQRS = i >= 100 && i < 180;
      const y = beat[i] + baselineWander(t) + muscleNoise(fRng) + (inQRS ? 0 : fWave);
      points.push({ x: t, y });
    }
    offset += beat.length;
  }
  return points;
}

function aflutter(lead: string): WavePoint[] {
  const rng = mulberry32(505);
  const flutterCycle = 200; // 300/min atrial rate
  const conductionRatio = 4; // 4:1 block
  const ventCycle = flutterCycle * conductionRatio; // 800ms = 75 bpm ventricular
  const numBeats = 5;
  const totalLen = ventCycle * numBeats;
  const points: WavePoint[] = [];

  const tmpl = getQrsTemplate(lead);

  for (let t = 0; t < totalLen; t++) {
    let y = 0;

    // Sawtooth F-waves: sharp downstroke, gradual upstroke
    const flutterPhase = (t % flutterCycle) / flutterCycle;
    let fWave: number;
    if (flutterPhase < 0.3) {
      // Sharp downstroke
      fWave = -0.25 * (flutterPhase / 0.3);
    } else {
      // Gradual upstroke
      fWave = -0.25 + 0.25 * ((flutterPhase - 0.3) / 0.7);
    }
    // Lead-dependent F-wave polarity
    if (lead === 'aVR') fWave = -fWave;
    if (lead === 'V1') fWave *= 0.7;
    y += fWave;

    // QRS at each ventricular cycle
    const beatPhase = t % ventCycle;
    const qrsStart = 100; // offset from beat start
    const relT = beatPhase - qrsStart;
    if (relT >= 0 && relT < 200) {
      // Q
      if (Math.abs(tmpl.qAmp) > 0.005) {
        y += gaussian(relT, 8, 4, tmpl.qAmp);
      }
      // R
      y += gaussian(relT, 20, 8, tmpl.rAmp);
      // S
      if (Math.abs(tmpl.sAmp) > 0.005) {
        y += gaussian(relT, 40, 6, tmpl.sAmp);
      }
      // T
      const tAmp = getTwaveTemplate(lead).amp;
      y += asymGaussian(relT, 130, 35, 45, tAmp * 0.7);
    }

    y += baselineWander(t) + muscleNoise(rng);
    points.push({ x: t, y });
  }
  return points;
}

function svt(lead: string): WavePoint[] {
  const rng = mulberry32(606);
  const beats: number[][] = [];
  const baseCycle = 350; // ~170 bpm
  for (let i = 0; i < 6; i++) {
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle,
          pqInterval: 90,
          pDuration: 50,
          pPresent: false, // P waves buried
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: 0,
          tDuration: 100,
          tAmplitudeScale: 0.6,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.02,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function vt(lead: string): WavePoint[] {
  // Ventricular tachycardia: wide QRS >140ms, monomorphic, bizarre shape, 150bpm
  const rng = mulberry32(707);
  const beats: number[][] = [];
  const baseCycle = 400; // 150 bpm

  // VT has bizarre wide QRS -- override template
  const vtTemplate: QrsTemplate = {
    qAmp: -0.15,
    rAmp: 1.2,
    sAmp: -0.5,
    qrsDurationMs: 160, // wide >140ms
  };
  // Lead-dependent VT morphology
  if (lead === 'V1' || lead === 'V2') {
    vtTemplate.rAmp = 1.0;
    vtTemplate.sAmp = -0.3;
  } else if (lead === 'aVR') {
    vtTemplate.qAmp = -0.8;
    vtTemplate.rAmp = 0.3;
  }

  for (let i = 0; i < 6; i++) {
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle,
          pqInterval: 30, // no real PQ
          pDuration: 40,
          pPresent: false,
          qrsTemplate: vtTemplate,
          qrsWidthScale: 1.8,
          stOffset: 0,
          tDuration: 120,
          tAmplitudeScale: -0.5, // discordant T
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.02,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function vfib(lead: string): WavePoint[] {
  // Chaotic, no QRS, overlapping sinusoids with amplitude modulation
  const rng = mulberry32(808);
  const totalLength = 3000;
  const points: WavePoint[] = [];

  // Lead-dependent amplitude
  const leadScale =
    lead === 'aVR' ? 0.7 :
    lead === 'aVL' ? 0.6 :
    ['V1', 'V2'].includes(lead) ? 0.8 : 1.0;

  for (let t = 0; t < totalLength; t++) {
    // Amplitude modulation envelope
    const envelope = 0.6 + 0.4 * Math.sin(t * 0.002 + rng() * 0.01);
    // Overlapping sinusoids with varying frequencies
    const y =
      0.4 * Math.sin(t * 0.03 + Math.sin(t * 0.007) * 3) +
      0.25 * Math.sin(t * 0.05 + 1.2) +
      0.15 * Math.sin(t * 0.08 + Math.sin(t * 0.01) * 2) +
      0.1 * Math.sin(t * 0.13 + 2.5);
    const noisy = y * envelope + (rng() - 0.5) * 0.1;
    points.push({ x: t, y: noisy * leadScale });
  }
  return points;
}

function avBlock1(lead: string): WavePoint[] {
  // First degree AV block: PQ=240ms, otherwise normal
  const rng = mulberry32(909);
  const beats: number[][] = [];
  const baseCycle = 850;
  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 240, // prolonged PQ
          pDuration: 80,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: 0,
          tDuration: 160,
          tAmplitudeScale: 1.0,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function avBlock2Type1(lead: string): WavePoint[] {
  // Wenckebach: PQ progressively longer then dropped QRS
  const rng = mulberry32(1010);
  const beats: number[][] = [];
  const baseCycle = 800;
  const pqIntervals = [170, 210, 260, 320]; // progressive prolongation

  // Two Wenckebach cycles
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 0; i < pqIntervals.length; i++) {
      beats.push(
        buildSingleBeat(
          {
            cycleLength: baseCycle,
            pqInterval: pqIntervals[i],
            pDuration: 80,
            pPresent: true,
            qrsTemplate: getQrsTemplate(lead),
            qrsWidthScale: 1.0,
            stOffset: 0,
            tDuration: 160,
            tAmplitudeScale: 1.0,
            uAmplitude: 0,
            uDuration: 0,
          },
          lead,
          rng,
          0.03,
        ),
      );
    }

    // Dropped beat: P wave only, no QRS
    const droppedLen = Math.ceil(baseCycle);
    const dropped = new Array<number>(droppedLen).fill(0);
    const pw = buildPwave(0, 80, lead, 1.0);
    for (let i = 0; i < pw.data.length && pw.startT + i < droppedLen; i++) {
      if (pw.startT + i >= 0) dropped[pw.startT + i] += pw.data[i];
    }
    beats.push(dropped);
  }
  return assembleBeats(beats, rng);
}

function avBlock2Type2(lead: string): WavePoint[] {
  // Mobitz Type II: constant PQ, intermittent dropped QRS
  const rng = mulberry32(1111);
  const beats: number[][] = [];
  const baseCycle = 800;
  const pattern = [true, true, false, true, true, false]; // conducted / dropped

  for (const conducted of pattern) {
    if (conducted) {
      beats.push(
        buildSingleBeat(
          {
            cycleLength: baseCycle,
            pqInterval: 180,
            pDuration: 80,
            pPresent: true,
            qrsTemplate: getQrsTemplate(lead),
            qrsWidthScale: 1.0,
            stOffset: 0,
            tDuration: 160,
            tAmplitudeScale: 1.0,
            uAmplitude: 0,
            uDuration: 0,
          },
          lead,
          rng,
          0.03,
        ),
      );
    } else {
      // Dropped: P wave only
      const droppedLen = Math.ceil(baseCycle);
      const dropped = new Array<number>(droppedLen).fill(0);
      const pw = buildPwave(0, 80, lead, 1.0);
      for (let i = 0; i < pw.data.length && pw.startT + i < droppedLen; i++) {
        if (pw.startT + i >= 0) dropped[pw.startT + i] += pw.data[i];
      }
      beats.push(dropped);
    }
  }
  return assembleBeats(beats, rng);
}

function avBlock3(lead: string): WavePoint[] {
  // Complete heart block: independent P (80/min) and QRS (40/min, wide escape)
  const rng = mulberry32(1212);
  const totalLength = 4800;
  const pInterval = 750; // 80 bpm atrial
  const qrsInterval = 1500; // 40 bpm ventricular escape
  const points: WavePoint[] = [];

  const tmpl = getQrsTemplate(lead);
  const pTmpl = getPwaveTemplate(lead);
  const tTmpl = getTwaveTemplate(lead);

  // Pre-compute P wave times and QRS times
  const pTimes: number[] = [];
  for (let pBeat = 0; pBeat * pInterval < totalLength; pBeat++) {
    pTimes.push(pBeat * pInterval);
  }
  const qrsTimes: number[] = [];
  for (let vBeat = 0; vBeat * qrsInterval + 100 < totalLength; vBeat++) {
    qrsTimes.push(vBeat * qrsInterval + 100);
  }

  for (let t = 0; t < totalLength; t++) {
    let y = 0;

    // P waves (independent)
    for (const pStart of pTimes) {
      const relT = t - pStart;
      if (relT >= 0 && relT < 80) {
        y += pTmpl.amp * Math.sin((relT / 80) * Math.PI);
      }
    }

    // QRS-T (wide escape rhythm, independent)
    for (const qStart of qrsTimes) {
      const relT = t - qStart;
      if (relT >= 0 && relT < 400) {
        // Wide QRS escape
        y += gaussian(relT, 10, 6, tmpl.qAmp * 0.8);
        y += gaussian(relT, 30, 14, tmpl.rAmp * 0.7); // wider R
        y += gaussian(relT, 60, 10, tmpl.sAmp * 0.6);
        // T wave
        y += asymGaussian(relT, 200, 50, 65, tTmpl.amp * 0.8);
      }
    }

    y += baselineWander(t) + muscleNoise(rng);
    points.push({ x: t, y });
  }
  return points;
}

function lbbb(lead: string): WavePoint[] {
  // LBBB: QRS>140ms, V1=deep QS, V5-V6=notched M-shaped R, no septal q
  const rng = mulberry32(1313);
  const beats: number[][] = [];
  const baseCycle = 800;

  const isLeftLead = ['I', 'aVL', 'V5', 'V6'].includes(lead);
  const isRightLead = ['V1', 'V2', 'V3'].includes(lead);

  // Override QRS template for LBBB
  let lbbbTemplate: QrsTemplate;
  if (isRightLead) {
    // Deep QS pattern in V1-V3
    lbbbTemplate = {
      qAmp: -0.3,
      rAmp: 0.05, // minimal r
      sAmp: -0.9,
      qrsDurationMs: 160,
    };
    if (lead === 'V1') {
      lbbbTemplate.qAmp = -0.4;
      lbbbTemplate.rAmp = 0;
      lbbbTemplate.sAmp = -1.1; // deep QS
    }
  } else if (isLeftLead) {
    // Notched M-shaped R, no septal q
    lbbbTemplate = {
      qAmp: 0, // no septal q!
      rAmp: 1.1,
      sAmp: -0.05,
      qrsDurationMs: 160,
      notchedR: true,
    };
  } else if (lead === 'aVR') {
    lbbbTemplate = {
      qAmp: -0.6,
      rAmp: 0.1,
      sAmp: 0,
      qrsDurationMs: 160,
    };
  } else {
    lbbbTemplate = {
      qAmp: -0.05,
      rAmp: 0.7,
      sAmp: -0.15,
      qrsDurationMs: 160,
    };
  }

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    const beat = buildSingleBeat(
      {
        cycleLength: baseCycle * rrJitter,
        pqInterval: 160,
        pDuration: 80,
        pPresent: true,
        qrsTemplate: lbbbTemplate,
        qrsWidthScale: 1.8, // wide QRS
        stOffset: isLeftLead ? -0.1 : isRightLead ? 0.1 : 0,
        tDuration: 160,
        // Discordant T wave
        tAmplitudeScale: isLeftLead ? -1.2 : isRightLead ? 1.4 : 1.0,
        uAmplitude: 0,
        uDuration: 0,
      },
      lead,
      rng,
      0.03,
    );

    // Add M-shaped notch for left leads
    if (isLeftLead && lbbbTemplate.notchedR) {
      const notchStart = 180;
      const notchWidth = 20;
      for (let t = notchStart; t < notchStart + notchWidth && t < beat.length; t++) {
        const frac = (t - notchStart) / notchWidth;
        beat[t] -= 0.15 * Math.sin(frac * Math.PI);
      }
    }

    beats.push(beat);
  }
  return assembleBeats(beats, rng);
}

function rbbb(lead: string): WavePoint[] {
  // RBBB: QRS>120ms, V1=rsR', V6=wide S, T discordant V1-V3
  const rng = mulberry32(1414);
  const beats: number[][] = [];
  const baseCycle = 800;

  const isV1V2 = ['V1', 'V2'].includes(lead);
  const isLeftLead = ['I', 'V5', 'V6'].includes(lead);

  let rbbbTemplate: QrsTemplate;
  if (isV1V2) {
    // rsR' pattern
    rbbbTemplate = {
      qAmp: 0,
      rAmp: 0.25, // small r
      sAmp: -0.35, // s
      rPrimeAmp: 0.8, // tall R'
      qrsDurationMs: 130,
    };
  } else if (isLeftLead) {
    // Wide S wave in lateral leads
    rbbbTemplate = {
      qAmp: -0.04,
      rAmp: 0.85,
      sAmp: -0.45, // wide S
      qrsDurationMs: 130,
    };
  } else if (lead === 'aVR') {
    rbbbTemplate = {
      qAmp: -0.4,
      rAmp: 0.2,
      sAmp: 0,
      rPrimeAmp: 0.15,
      qrsDurationMs: 130,
    };
  } else {
    const base = getQrsTemplate(lead);
    rbbbTemplate = { ...base, qrsDurationMs: 130 };
  }

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 160,
          pDuration: 80,
          pPresent: true,
          qrsTemplate: rbbbTemplate,
          qrsWidthScale: 1.5, // wide QRS
          stOffset: 0,
          tDuration: 160,
          // Discordant T in V1-V3
          tAmplitudeScale: isV1V2 ? -1.0 : 1.0,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function stemiAnterior(lead: string): WavePoint[] {
  // V1-V4 ST elevation 0.3-0.5mV convex-up, reciprocal depression II,III,aVF
  const rng = mulberry32(1515);
  const beats: number[][] = [];
  const baseCycle = 750;

  const anteriorLeads = ['V1', 'V2', 'V3', 'V4'];
  const reciprocalLeads = ['II', 'III', 'aVF'];

  let stElev = 0;
  if (anteriorLeads.includes(lead)) {
    stElev = lead === 'V2' || lead === 'V3' ? 0.5 : 0.3;
  } else if (reciprocalLeads.includes(lead)) {
    stElev = -0.15;
  }

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 160,
          pDuration: 80,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: stElev,
          stConcaveUp: false, // STEMI is convex-up
          tDuration: anteriorLeads.includes(lead) ? 180 : 160,
          tAmplitudeScale: anteriorLeads.includes(lead) ? 1.8 : 1.0, // hyperacute T
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function stemiInferior(lead: string): WavePoint[] {
  // II,III,aVF ST elevation, reciprocal in I,aVL
  const rng = mulberry32(1616);
  const beats: number[][] = [];
  const baseCycle = 750;

  const inferiorLeads = ['II', 'III', 'aVF'];
  const reciprocalLeads = ['I', 'aVL'];

  let stElev = 0;
  if (inferiorLeads.includes(lead)) {
    stElev = lead === 'III' ? 0.4 : 0.3;
  } else if (reciprocalLeads.includes(lead)) {
    stElev = -0.15;
  }

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 160,
          pDuration: 80,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: stElev,
          tDuration: inferiorLeads.includes(lead) ? 180 : 160,
          tAmplitudeScale: inferiorLeads.includes(lead) ? 1.6 : 1.0,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function hyperkalemia(lead: string): WavePoint[] {
  // Peaked tent T (0.7mV, narrow 80ms), wide QRS, flat P
  const rng = mulberry32(1717);
  const beats: number[][] = [];
  const baseCycle = 900;

  const tmpl = getQrsTemplate(lead);
  // Widen QRS
  tmpl.qrsDurationMs = 140;
  // Reduce P amplitude (flattened)
  const pScale = 0.3;

  for (let i = 0; i < 4; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    const beat = buildSingleBeat(
      {
        cycleLength: baseCycle * rrJitter,
        pqInterval: 180,
        pDuration: 100,
        pPresent: true,
        qrsTemplate: tmpl,
        qrsWidthScale: 1.5, // wide QRS
        stOffset: 0,
        tDuration: 120,
        tAmplitudeScale: 1.0,
        tPeaked: true,
        tPeakedWidth: 80, // narrow peaked tent T
        uAmplitude: 0,
        uDuration: 0,
      },
      lead,
      rng,
      0.02,
    );

    // Scale down P wave (first ~100ms)
    for (let t = 0; t < 100 && t < beat.length; t++) {
      beat[t] *= pScale + (1 - pScale) * (t / 100);
    }

    // Override T wave amplitude to ensure 0.7mV peak
    // The buildTwave uses template amp * scale, we want ~0.7mV magnitude
    // We already set tAmplitudeScale=1.0 and the peaked option handles the shape.
    // T wave gets the lead template amp * scale. For lead II that is 0.3 * 1.0.
    // We want it ~0.7mV for lead II. Let's re-scale the T region.
    // The T wave starts roughly at qrs end + 20.
    const tStart = 220; // approximate
    const tEnd = tStart + 120;
    const tDesiredPeak = lead === 'aVR' ? -0.7 : 0.7;
    const tTemplatePeak = getTwaveTemplate(lead).amp;
    const tBoost = Math.abs(tTemplatePeak) > 0.01 ? tDesiredPeak / tTemplatePeak : 2.0;
    for (let t = tStart; t < tEnd && t < beat.length; t++) {
      // Boost just the T wave region
      const factor = Math.sin(((t - tStart) / (tEnd - tStart)) * Math.PI);
      beat[t] += (tBoost - 1) * factor * tTemplatePeak *
        Math.exp(-((t - (tStart + (tEnd - tStart) * 0.45)) ** 2) / (2 * 17 * 17));
    }

    beats.push(beat);
  }
  return assembleBeats(beats, rng);
}

function hypokalemia(lead: string): WavePoint[] {
  // Flat T, U waves, ST depression
  const rng = mulberry32(1818);
  const beats: number[][] = [];
  const baseCycle = 850;

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 160,
          pDuration: 80,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: -0.1, // ST depression
          tDuration: 140,
          tAmplitudeScale: 0.25, // flat T
          uAmplitude: 0.15, // prominent U wave
          uDuration: 100,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function longQt(lead: string): WavePoint[] {
  // Prolonged QT with stretched/notched T
  const rng = mulberry32(1919);
  const beats: number[][] = [];
  const baseCycle = 900;

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 160,
          pDuration: 80,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: 0,
          tDuration: 280, // very prolonged T
          tAmplitudeScale: 1.0,
          tNotched: true,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function wpw(lead: string): WavePoint[] {
  // Short PQ (90ms), delta wave (slurred 40ms upstroke), wide QRS
  const rng = mulberry32(2020);
  const beats: number[][] = [];
  const baseCycle = 750;

  const tmpl = getQrsTemplate(lead);
  tmpl.qrsDurationMs = 130; // wider due to delta

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 90, // short PQ
          pDuration: 70,
          pPresent: true,
          qrsTemplate: tmpl,
          qrsWidthScale: 1.3,
          stOffset: 0,
          tDuration: 160,
          tAmplitudeScale: 1.0,
          deltaWave: true,
          deltaDuration: 40,
          deltaAmplitude: 0.3,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function pericarditis(lead: string): WavePoint[] {
  // Diffuse concave-up ST elevation, PR depression, aVR mirror
  const rng = mulberry32(2121);
  const beats: number[][] = [];
  const baseCycle = 750;
  const isAVR = lead === 'aVR';

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    const beat = buildSingleBeat(
      {
        cycleLength: baseCycle * rrJitter,
        pqInterval: 160,
        pDuration: 80,
        pPresent: true,
        qrsTemplate: getQrsTemplate(lead),
        qrsWidthScale: 1.0,
        stOffset: isAVR ? -0.15 : 0.15, // diffuse elevation, depression in aVR
        stConcaveUp: !isAVR, // concave-up morphology
        tDuration: 160,
        tAmplitudeScale: 1.0,
        uAmplitude: 0,
        uDuration: 0,
      },
      lead,
      rng,
      0.03,
    );

    // PR depression (or elevation in aVR)
    const prDepression = isAVR ? 0.05 : -0.05;
    const pEnd = 80;
    const qrsStart = 160;
    for (let t = pEnd; t < qrsStart && t < beat.length; t++) {
      beat[t] += prDepression;
    }

    beats.push(beat);
  }
  return assembleBeats(beats, rng);
}

function pe(lead: string): WavePoint[] {
  // Tachycardia, S1Q3T3 pattern, T inversions V1-V3
  const rng = mulberry32(2222);
  const beats: number[][] = [];
  const baseCycle = 600; // tachycardia ~100 bpm

  const tmpl = getQrsTemplate(lead);

  // S1Q3T3 modifications
  if (lead === 'I') {
    tmpl.sAmp = -0.5; // Deep S in lead I
  } else if (lead === 'III') {
    tmpl.qAmp = -0.3; // Q in lead III
  }

  let tScale = 1.0;
  let stOff = 0;
  if (lead === 'III') {
    tScale = -1.0; // inverted T in III
  } else if (['V1', 'V2', 'V3'].includes(lead)) {
    tScale = -0.8; // T inversions V1-V3
    stOff = -0.05;
  }

  for (let i = 0; i < 6; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 140,
          pDuration: 70,
          pPresent: true,
          qrsTemplate: tmpl,
          qrsWidthScale: 1.0,
          stOffset: stOff,
          tDuration: 130,
          tAmplitudeScale: tScale,
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function digitalis(lead: string): WavePoint[] {
  // Scooped ST depression ("reverse tick"), short QT
  const rng = mulberry32(2323);
  const beats: number[][] = [];
  const baseCycle = 800;

  for (let i = 0; i < 5; i++) {
    const rrJitter = 1 + (rng() - 0.5) * 0.06;
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle * rrJitter,
          pqInterval: 160,
          pDuration: 80,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: -0.2, // ST depression
          stScooped: true, // scooped "Salvador Dali mustache"
          tDuration: 120, // short QT
          tAmplitudeScale: 0.4, // small/biphasic T
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.03,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

function torsade(lead: string): WavePoint[] {
  // Polymorphic VT with sinusoidal amplitude envelope
  const rng = mulberry32(2424);
  const totalLength = 4000;
  const points: WavePoint[] = [];

  const leadScale =
    lead === 'aVR' ? 0.7 :
    lead === 'aVL' ? 0.6 :
    ['V1', 'V2'].includes(lead) ? 0.8 : 1.0;

  const twistFreq = 0.0015; // frequency of axis rotation
  const qrsFreq = 0.015; // ~200 bpm

  for (let t = 0; t < totalLength; t++) {
    // Sinusoidal amplitude envelope (twisting)
    const envelope = 0.5 + 0.5 * Math.sin(t * twistFreq * Math.PI * 2);
    // QRS-like oscillation
    const qrs = Math.sin(t * qrsFreq * Math.PI * 2);
    // Harmonic for sharper peaks
    const harmonic = 0.3 * Math.sin(t * qrsFreq * Math.PI * 4 + 0.5);
    const y = (qrs + harmonic) * envelope * 0.8 + (rng() - 0.5) * 0.04;
    points.push({ x: t, y: y * leadScale });
  }
  return points;
}

function asystole(_lead: string): WavePoint[] {
  // Near-flat line with minimal deflections
  const rng = mulberry32(2525);
  const totalLength = 4000;
  const points: WavePoint[] = [];

  for (let t = 0; t < totalLength; t++) {
    const y =
      0.01 * Math.sin(t * 0.003) +
      0.005 * Math.sin(t * 0.01 + 0.5) +
      (rng() - 0.5) * 0.008;
    points.push({ x: t, y });
  }
  return points;
}

function pea(lead: string): WavePoint[] {
  // Organized slow rhythm (50bpm), normal morphology
  const rng = mulberry32(2626);
  const beats: number[][] = [];
  const baseCycle = 1200; // 50 bpm

  for (let i = 0; i < 4; i++) {
    beats.push(
      buildSingleBeat(
        {
          cycleLength: baseCycle,
          pqInterval: 170,
          pDuration: 80,
          pPresent: true,
          qrsTemplate: getQrsTemplate(lead),
          qrsWidthScale: 1.0,
          stOffset: 0,
          tDuration: 160,
          tAmplitudeScale: 0.8, // slightly lower amplitude
          uAmplitude: 0,
          uDuration: 0,
        },
        lead,
        rng,
        0.02,
      ),
    );
  }
  return assembleBeats(beats, rng);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const GENERATORS: Record<EkgPattern, (lead: string) => WavePoint[]> = {
  normal_sinus: normalSinus,
  sinus_bradycardia: sinusBradycardia,
  sinus_tachycardia: sinusTachycardia,
  afib,
  aflutter,
  svt,
  vt,
  vfib,
  av_block_1: avBlock1,
  av_block_2_type1: avBlock2Type1,
  av_block_2_type2: avBlock2Type2,
  av_block_3: avBlock3,
  lbbb,
  rbbb,
  stemi_anterior: stemiAnterior,
  stemi_inferior: stemiInferior,
  hyperkalemia,
  hypokalemia,
  long_qt: longQt,
  pea,
  asystole,
  wpw,
  pericarditis,
  pe,
  digitalis,
  torsade,
};

/**
 * Generate waveform points for a given EKG pattern and lead.
 * Returns an array of {x, y} where x is time in ms and y is amplitude in mV.
 * Multiple beats are generated for clinical realism.
 */
export function generateWaveform(pattern: EkgPattern, lead: string = 'II'): WavePoint[] {
  const gen = GENERATORS[pattern];
  if (!gen) {
    console.warn(`Unknown EKG pattern: ${pattern}, falling back to normal_sinus`);
    return normalSinus(lead);
  }
  return gen(lead);
}

/**
 * Get the approximate total waveform length in ms for a pattern.
 * Used by the renderer to know the extent of the generated data.
 */
export function getCycleLength(pattern: EkgPattern): number {
  const lengths: Partial<Record<EkgPattern, number>> = {
    normal_sinus: 4000,
    sinus_bradycardia: 4800,
    sinus_tachycardia: 3000,
    afib: 4800,
    aflutter: 4000,
    svt: 2100,
    vt: 2400,
    vfib: 3000,
    av_block_1: 4250,
    av_block_2_type1: 8000,
    av_block_2_type2: 4800,
    av_block_3: 4800,
    lbbb: 4000,
    rbbb: 4000,
    stemi_anterior: 3750,
    stemi_inferior: 3750,
    hyperkalemia: 3600,
    hypokalemia: 4250,
    long_qt: 4500,
    pea: 4800,
    asystole: 4000,
    wpw: 3750,
    pericarditis: 3750,
    pe: 3600,
    digitalis: 4000,
    torsade: 4000,
  };
  return lengths[pattern] ?? 4000;
}

/** List of all supported patterns. */
export const ALL_PATTERNS: EkgPattern[] = Object.keys(GENERATORS) as EkgPattern[];

/** Standard 12 leads in display order. */
export const STANDARD_LEADS = [
  'I', 'II', 'III', 'aVR', 'aVL', 'aVF',
  'V1', 'V2', 'V3', 'V4', 'V5', 'V6',
] as const;
