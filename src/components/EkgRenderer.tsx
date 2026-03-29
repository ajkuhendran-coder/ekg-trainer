// =============================================================================
// EkgRenderer -- SVG-based 12-lead ECG renderer for medical training
// Renders realistic waveforms on a classic pink/red ECG grid.
// Supports static and animated (scrolling monitor) display.
// =============================================================================

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import {
  generateWaveform,
  getCycleLength,
  type EkgPattern,
  type WavePoint,
} from '../utils/ekgWaveforms';

export type { EkgPattern };

// ---------------------------------------------------------------------------
// Grid colours and constants
// ---------------------------------------------------------------------------

const COLORS = {
  background: '#fff5f5',
  majorGrid: 'rgba(220, 70, 70, 0.3)',
  minorGrid: 'rgba(220, 70, 70, 0.12)',
  waveform: '#1a1a2e',
  label: '#555',
} as const;

// At 25 mm/s and 10 mm/mV:
// 1 mm on paper = 0.04 s in time = 40 ms
// 1 mm on paper = 0.1 mV in amplitude
// 5 mm = 1 large square = 200 ms or 0.5 mV

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface EkgRendererProps {
  /** The EKG pattern to render. */
  pattern: EkgPattern;
  /** Which lead to display. Default "II". */
  lead?: string;
  /** SVG width in CSS pixels. Default 600. */
  width?: number;
  /** SVG height in CSS pixels. Default 200. */
  height?: number;
  /** Paper speed in mm/s. Default 25. */
  speed?: number;
  /** Show the background grid. Default true. */
  showGrid?: boolean;
  /** Show the lead label in the corner. Default true. */
  showLabel?: boolean;
  /** Continuously scroll the waveform like a monitor. Default false. */
  animate?: boolean;
}

// ---------------------------------------------------------------------------
// Pixel-per-unit conversion helpers
// ---------------------------------------------------------------------------

interface ScaleFactors {
  /** Pixels per millimetre on the virtual paper. */
  pxPerMm: number;
  /** Pixels per millisecond of ECG time (at given paper speed). */
  pxPerMs: number;
  /** Pixels per millivolt of amplitude (at standard 10mm/mV). */
  pxPerMv: number;
  /** Y-centre of the SVG (baseline). */
  baselineY: number;
}

function computeScale(width: number, height: number, speed: number): ScaleFactors {
  // We define pxPerMm so the entire width corresponds to a certain paper length.
  // A typical 25mm/s strip over 600px wide ~= 24s worth of paper = 600mm.
  // So 1px ~ 1mm. We can adjust so the grid looks nice.
  // Width in mm of paper shown = width (we map 1 CSS px to ~1mm for convenience)
  const paperWidthMm = width; // 1px = 1mm
  const _pxPerMm = width / paperWidthMm; // = 1

  // Time shown = paperWidthMm / speed seconds
  // pxPerMs = width / (timeShown * 1000)
  const timeShownMs = (paperWidthMm / speed) * 1000;
  const pxPerMs = width / timeShownMs;

  // But to make waveforms visually significant in a 200px tall SVG,
  // we scale the amplitude so that +/- 2mV fills most of the height.
  const desiredMvRange = 4; // -2mV to +2mV
  const availableHeight = height * 0.85;
  const scaledPxPerMv = availableHeight / desiredMvRange;

  return {
    pxPerMm: _pxPerMm,
    pxPerMs,
    pxPerMv: scaledPxPerMv,
    baselineY: height / 2,
  };
}

// ---------------------------------------------------------------------------
// Grid component (memoized)
// ---------------------------------------------------------------------------

interface GridProps {
  width: number;
  height: number;
}

const EcgGrid = React.memo<GridProps>(function EcgGrid({ width, height }) {
  // Minor grid: every 1mm (1px at our scale), Major: every 5mm (5px)
  const minorSpacing = 5; // px between minor lines (scaled up for visibility)
  const majorSpacing = minorSpacing * 5; // 25px

  const minorLines: React.ReactNode[] = [];
  const majorLines: React.ReactNode[] = [];

  // Vertical lines
  for (let x = 0; x <= width; x += minorSpacing) {
    const isMajor = x % majorSpacing === 0;
    (isMajor ? majorLines : minorLines).push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={height} />,
    );
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += minorSpacing) {
    const isMajor = y % majorSpacing === 0;
    (isMajor ? majorLines : minorLines).push(
      <line key={`h${y}`} x1={0} y1={y} x2={width} y2={y} />,
    );
  }

  return (
    <g>
      <g stroke={COLORS.minorGrid} strokeWidth={0.5}>
        {minorLines}
      </g>
      <g stroke={COLORS.majorGrid} strokeWidth={0.8}>
        {majorLines}
      </g>
    </g>
  );
});

// ---------------------------------------------------------------------------
// Waveform path builder
// ---------------------------------------------------------------------------

function buildSvgPath(
  points: WavePoint[],
  scale: ScaleFactors,
  xOffset: number = 0,
): string {
  if (points.length === 0) return '';

  const parts: string[] = [];
  for (let i = 0; i < points.length; i++) {
    const px = points[i].x * scale.pxPerMs + xOffset;
    // Y is inverted (SVG y-axis goes down, positive mV goes up)
    const py = scale.baselineY - points[i].y * scale.pxPerMv;
    parts.push(i === 0 ? `M${px.toFixed(2)},${py.toFixed(2)}` : `L${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// Static waveform component
// ---------------------------------------------------------------------------

interface StaticWaveformProps {
  pattern: EkgPattern;
  lead: string;
  width: number;
  height: number;
  scale: ScaleFactors;
}

const StaticWaveform = React.memo<StaticWaveformProps>(function StaticWaveform({
  pattern,
  lead,
  width,
  scale,
}) {
  const pathData = useMemo(() => {
    const singleCycle = generateWaveform(pattern, lead);
    const cycleMs = getCycleLength(pattern);
    const totalTimeMs = width / scale.pxPerMs;

    // Tile cycles to fill the strip width
    const allPoints: WavePoint[] = [];
    let offset = 0;

    // For multi-cycle patterns (afib, blocks, etc.), the generated data
    // already contains multiple cycles, so we may only need one copy.
    const generatedDuration = singleCycle[singleCycle.length - 1]?.x ?? cycleMs;

    while (offset < totalTimeMs) {
      for (const pt of singleCycle) {
        const x = pt.x + offset;
        if (x <= totalTimeMs + 50) {
          allPoints.push({ x, y: pt.y });
        }
      }
      offset += generatedDuration + 1; // +1 to avoid overlap
    }

    return buildSvgPath(allPoints, scale);
  }, [pattern, lead, width, scale]);

  return (
    <path
      d={pathData}
      fill="none"
      stroke={COLORS.waveform}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
});

// ---------------------------------------------------------------------------
// Animated (scrolling) waveform component
// ---------------------------------------------------------------------------

interface AnimatedWaveformProps {
  pattern: EkgPattern;
  lead: string;
  width: number;
  height: number;
  scale: ScaleFactors;
}

const AnimatedWaveform: React.FC<AnimatedWaveformProps> = ({
  pattern,
  lead,
  width,
  height: _height,
  scale,
}) => {
  void _height;
  const canvasRef = useRef<SVGPathElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pointBufferRef = useRef<WavePoint[]>([]);

  // Pre-generate a long buffer of waveform data
  const waveBuffer = useMemo(() => {
    const singleCycle = generateWaveform(pattern, lead);
    const generatedDuration = singleCycle[singleCycle.length - 1]?.x ?? getCycleLength(pattern);
    // Build ~30 seconds of data
    const targetDuration = 30000;
    const allPoints: WavePoint[] = [];
    let offset = 0;

    while (offset < targetDuration) {
      // Re-generate for patterns with randomness (afib, vfib, etc.)
      const cycle = generateWaveform(pattern, lead);
      const dur = cycle[cycle.length - 1]?.x ?? generatedDuration;
      for (const pt of cycle) {
        allPoints.push({ x: pt.x + offset, y: pt.y });
      }
      offset += dur + 1;
    }
    return allPoints;
  }, [pattern, lead]);

  const animate = useCallback(() => {
    if (!canvasRef.current) return;

    const now = performance.now();
    if (!startTimeRef.current) startTimeRef.current = now;

    const elapsedMs = now - startTimeRef.current;
    // Convert elapsed real time to ECG time
    // At 25mm/s, 1 second real = 25mm = 1 second ECG time (real-time playback)
    const scrollMs = elapsedMs; // real-time

    // Window of data to show: [scrollMs - windowMs, scrollMs]
    const windowMs = width / scale.pxPerMs;

    // Find the visible slice from the buffer (with wrapping)
    const bufferDuration = waveBuffer[waveBuffer.length - 1]?.x ?? 30000;
    const startMs = scrollMs % bufferDuration;
    const endMs = startMs + windowMs;

    const visible: WavePoint[] = [];
    for (const pt of waveBuffer) {
      const adjX = pt.x;
      if (adjX >= startMs && adjX <= endMs) {
        visible.push({ x: adjX - startMs, y: pt.y });
      }
      // Handle wrap-around
      if (endMs > bufferDuration && adjX <= endMs - bufferDuration) {
        visible.push({ x: adjX + bufferDuration - startMs, y: pt.y });
      }
    }

    // Sort by x to ensure correct path
    visible.sort((a, b) => a.x - b.x);
    pointBufferRef.current = visible;

    const pathData = buildSvgPath(visible, scale);
    canvasRef.current.setAttribute('d', pathData);

    animFrameRef.current = requestAnimationFrame(animate);
  }, [waveBuffer, width, scale]);

  useEffect(() => {
    startTimeRef.current = 0;
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate]);

  return (
    <path
      ref={canvasRef}
      fill="none"
      stroke={COLORS.waveform}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

// ---------------------------------------------------------------------------
// Main EkgRenderer component
// ---------------------------------------------------------------------------

const EkgRenderer: React.FC<EkgRendererProps> = ({
  pattern,
  lead = 'II',
  width = 600,
  height = 200,
  speed = 25,
  showGrid = true,
  showLabel = true,
  animate = false,
}) => {
  const scale = useMemo(() => computeScale(width, height, speed), [width, height, speed]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        backgroundColor: COLORS.background,
        display: 'block',
        borderRadius: 4,
      }}
    >
      {/* Grid */}
      {showGrid && <EcgGrid width={width} height={height} />}

      {/* Waveform */}
      {animate ? (
        <AnimatedWaveform
          pattern={pattern}
          lead={lead}
          width={width}
          height={height}
          scale={scale}
        />
      ) : (
        <StaticWaveform
          pattern={pattern}
          lead={lead}
          width={width}
          height={height}
          scale={scale}
        />
      )}

      {/* Calibration pulse -- 1mV square at the very start */}
      {!animate && (
        <g>
          <line
            x1={2}
            y1={scale.baselineY}
            x2={2}
            y2={scale.baselineY - scale.pxPerMv}
            stroke={COLORS.waveform}
            strokeWidth={1.5}
          />
          <line
            x1={2}
            y1={scale.baselineY - scale.pxPerMv}
            x2={12}
            y2={scale.baselineY - scale.pxPerMv}
            stroke={COLORS.waveform}
            strokeWidth={1.5}
          />
          <line
            x1={12}
            y1={scale.baselineY - scale.pxPerMv}
            x2={12}
            y2={scale.baselineY}
            stroke={COLORS.waveform}
            strokeWidth={1.5}
          />
        </g>
      )}

      {/* Lead label */}
      {showLabel && (
        <text
          x={width - 8}
          y={20}
          textAnchor="end"
          fill={COLORS.label}
          fontSize={14}
          fontFamily="monospace"
          fontWeight={600}
        >
          {lead}
        </text>
      )}

      {/* Speed label */}
      {showLabel && (
        <text
          x={width - 8}
          y={height - 8}
          textAnchor="end"
          fill={COLORS.label}
          fontSize={9}
          fontFamily="monospace"
        >
          {speed} mm/s
        </text>
      )}
    </svg>
  );
};

export default React.memo(EkgRenderer);
