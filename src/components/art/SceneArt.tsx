import { type CSSProperties } from "react";

/**
 * Brand-drawn vector scenes.
 *
 * They are used as the seeded artwork for hero backgrounds and the
 * "Explore China with us" gallery. Any record whose `image_url` starts with
 * `scene:` renders one of these instead of a bitmap, so the office can replace
 * artwork with real photographs from the dashboard at any time without a code
 * change.
 */
export const SCENE_KEYS = [
  "shanghai",
  "beijing",
  "guangzhou",
  "hangzhou",
  "xian",
  "campus-library",
  "campus-quad",
  "campus-gate",
  "night-bridge",
] as const;

export type SceneKey = (typeof SCENE_KEYS)[number];

export function isSceneRef(url: string | null | undefined): url is string {
  return typeof url === "string" && url.startsWith("scene:");
}

export function sceneKeyOf(url: string): SceneKey {
  const key = url.replace("scene:", "") as SceneKey;
  return (SCENE_KEYS as readonly string[]).includes(key) ? key : "shanghai";
}

type Landmark = "pearl" | "canton" | "pagoda" | "gate" | "library" | "quad" | "arch";

interface SceneSpec {
  sky: [string, string, string];
  glow: string;
  far: string;
  near: string;
  landmark: Landmark;
  water: boolean;
  seed: number;
  accent: string;
}

const SCENES: Record<SceneKey, SceneSpec> = {
  shanghai: {
    sky: ["#0b1d3a", "#1b3a6b", "#c8102e"],
    glow: "#e6c766",
    far: "#12294c",
    near: "#0a1830",
    landmark: "pearl",
    water: true,
    seed: 7,
    accent: "#d4af37",
  },
  beijing: {
    sky: ["#132a4f", "#2b5490", "#d98a3d"],
    glow: "#f2d08a",
    far: "#1b3a6b",
    near: "#101f3c",
    landmark: "gate",
    water: false,
    seed: 13,
    accent: "#c8102e",
  },
  guangzhou: {
    sky: ["#0d2140", "#3a4f8a", "#a4306b"],
    glow: "#e6c766",
    far: "#17305a",
    near: "#0b1a33",
    landmark: "canton",
    water: true,
    seed: 21,
    accent: "#d4af37",
  },
  hangzhou: {
    sky: ["#20406b", "#4a7fae", "#e9c98d"],
    glow: "#fdf3dc",
    far: "#2b5490",
    near: "#1b3a6b",
    landmark: "pagoda",
    water: true,
    seed: 34,
    accent: "#00a170",
  },
  xian: {
    sky: ["#26375e", "#7a5f7d", "#d9985a"],
    glow: "#f4d9a8",
    far: "#3a3f63",
    near: "#221f38",
    landmark: "pagoda",
    water: false,
    seed: 41,
    accent: "#c8102e",
  },
  "campus-library": {
    sky: ["#1b3a6b", "#3c6ea5", "#cfe0ef"],
    glow: "#ffffff",
    far: "#2b5490",
    near: "#16305c",
    landmark: "library",
    water: false,
    seed: 55,
    accent: "#d4af37",
  },
  "campus-quad": {
    sky: ["#22497f", "#5f95c4", "#e8f0f6"],
    glow: "#ffffff",
    far: "#2f5e97",
    near: "#1d3f70",
    landmark: "quad",
    water: false,
    seed: 63,
    accent: "#00a170",
  },
  "campus-gate": {
    sky: ["#132a4f", "#2b5490", "#e6c766"],
    glow: "#f7f4ef",
    far: "#1b3a6b",
    near: "#0f2244",
    landmark: "gate",
    water: false,
    seed: 71,
    accent: "#c8102e",
  },
  "night-bridge": {
    sky: ["#060f22", "#12294c", "#c8102e"],
    glow: "#d4af37",
    far: "#0d1f3d",
    near: "#060e1e",
    landmark: "arch",
    water: true,
    seed: 88,
    accent: "#d4af37",
  },
};

/** Small deterministic PRNG so every scene keeps a stable skyline. */
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Skyline({
  color,
  seed,
  baseline,
  minH,
  maxH,
  count,
  opacity,
  windows,
  windowColor,
}: {
  color: string;
  seed: number;
  baseline: number;
  minH: number;
  maxH: number;
  count: number;
  opacity: number;
  windows: boolean;
  windowColor: string;
}) {
  const rand = rng(seed);
  const step = 1600 / count;
  const items = [];

  for (let i = 0; i < count; i++) {
    const w = step * (0.55 + rand() * 0.5);
    const h = minH + rand() * (maxH - minH);
    const x = i * step + (step - w) / 2;
    const y = baseline - h;
    const rounded = rand() > 0.72;

    items.push(
      <rect
        key={`b${i}`}
        x={Math.round(x)}
        y={Math.round(y)}
        width={Math.round(w)}
        height={Math.round(h)}
        rx={rounded ? Math.round(w * 0.18) : 2}
        fill={color}
      />,
    );

    if (rand() > 0.6) {
      items.push(
        <rect
          key={`s${i}`}
          x={Math.round(x + w / 2 - 2)}
          y={Math.round(y - 26 - rand() * 40)}
          width={4}
          height={Math.round(30 + rand() * 40)}
          fill={color}
        />,
      );
    }

    // Sparse lit windows: enough to read as a city at night, cheap to render.
    if (windows) {
      const cols = Math.max(2, Math.min(4, Math.floor(w / 26)));
      const rows = Math.max(2, Math.min(7, Math.floor(h / 46)));
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (rand() > 0.42) continue;
          items.push(
            <rect
              key={`w${i}-${c}-${r}`}
              x={Math.round(x + 8 + c * (w / cols))}
              y={Math.round(y + 16 + r * (h / rows))}
              width={5}
              height={7}
              fill={windowColor}
              opacity={0.55}
            />,
          );
        }
      }
    }
  }

  return <g opacity={opacity}>{items}</g>;
}

function PearlTower({ accent, glow }: { accent: string; glow: string }) {
  return (
    <g transform="translate(1180 210)">
      <rect x="-4" y="0" width="8" height="440" fill="#0e1e3a" />
      <rect x="-26" y="330" width="52" height="110" fill="#0e1e3a" />
      <path d="M-30 440 L30 440 L46 500 L-46 500 Z" fill="#0e1e3a" />
      <circle cx="0" cy="132" r="46" fill={accent} opacity="0.92" />
      <circle cx="0" cy="300" r="66" fill={accent} opacity="0.92" />
      <circle cx="0" cy="60" r="22" fill={glow} opacity="0.9" />
      <rect x="-2" y="-58" width="4" height="60" fill={glow} />
      <circle cx="0" cy="132" r="46" fill="none" stroke={glow} strokeWidth="2" opacity="0.55" />
      <circle cx="0" cy="300" r="66" fill="none" stroke={glow} strokeWidth="2" opacity="0.5" />
    </g>
  );
}

function CantonTower({ accent, glow }: { accent: string; glow: string }) {
  const lines = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const topX = -34 + t * 68;
    const botX = -78 + t * 156;
    lines.push(
      <line
        key={i}
        x1={topX}
        y1="0"
        x2={botX}
        y2="470"
        stroke={i % 2 === 0 ? accent : glow}
        strokeWidth="2.4"
        opacity="0.75"
      />,
    );
  }
  return (
    <g transform="translate(1220 190)">
      <g>{lines}</g>
      {[80, 160, 240, 320, 400].map((y, i) => (
        <ellipse
          key={y}
          cx={0}
          cy={y}
          rx={38 + i * 9}
          ry={7}
          fill="none"
          stroke={glow}
          strokeWidth="2"
          opacity="0.5"
        />
      ))}
      <rect x="-2.5" y="-90" width="5" height="96" fill={glow} />
    </g>
  );
}

function PagodaRoof({ y, w, fill, edge }: { y: number; w: number; fill: string; edge: string }) {
  return (
    <g>
      <path
        d={`M ${-w} ${y} Q ${-w * 0.45} ${y - 34} 0 ${y - 44} Q ${w * 0.45} ${y - 34} ${w} ${y} Q ${w * 0.5} ${y + 12} 0 ${y + 12} Q ${-w * 0.5} ${y + 12} ${-w} ${y} Z`}
        fill={fill}
      />
      <path
        d={`M ${-w} ${y} Q ${-w * 0.45} ${y - 34} 0 ${y - 44} Q ${w * 0.45} ${y - 34} ${w} ${y}`}
        fill="none"
        stroke={edge}
        strokeWidth="3"
        opacity="0.85"
      />
    </g>
  );
}

function Pagoda({ accent, glow }: { accent: string; glow: string }) {
  return (
    <g transform="translate(1150 300)">
      <rect x="-58" y="240" width="116" height="150" fill="#12294c" />
      <rect x="-46" y="120" width="92" height="130" fill="#16325b" />
      <rect x="-34" y="20" width="68" height="110" fill="#1b3a6b" />
      <PagodaRoof y={240} w={104} fill={accent} edge={glow} />
      <PagodaRoof y={120} w={86} fill={accent} edge={glow} />
      <PagodaRoof y={20} w={64} fill={accent} edge={glow} />
      <rect x="-3" y="-56" width="6" height="60" fill={glow} />
      <circle cx="0" cy="-62" r="9" fill={glow} />
      {[-30, 0, 30].map((x) => (
        <rect key={x} x={x - 7} y={300} width="14" height="26" fill={glow} opacity="0.6" />
      ))}
    </g>
  );
}

function ImperialGate({ accent, glow }: { accent: string; glow: string }) {
  return (
    <g transform="translate(800 340)">
      <rect x="-320" y="150" width="640" height="200" fill="#7a1220" />
      <rect x="-320" y="150" width="640" height="200" fill={accent} opacity="0.55" />
      {[-220, -80, 60, 200].map((x) => (
        <g key={x}>
          <path d={`M ${x} 350 L ${x} 250 Q ${x + 40} 205 ${x + 80} 250 L ${x + 80} 350 Z`} fill="#3b0c14" />
        </g>
      ))}
      <rect x="-350" y="110" width="700" height="46" fill="#0f2244" />
      <PagodaRoof y={110} w={392} fill={accent} edge={glow} />
      <rect x="-300" y="40" width="600" height="72" fill="#8d1526" />
      <PagodaRoof y={40} w={340} fill={accent} edge={glow} />
      {[-240, -120, 0, 120, 240].map((x) => (
        <circle key={x} cx={x} cy={78} r="13" fill={glow} opacity="0.8" />
      ))}
    </g>
  );
}

function CampusLibrary({ accent, glow }: { accent: string; glow: string }) {
  return (
    <g transform="translate(800 330)">
      <rect x="-380" y="120" width="760" height="240" fill="#0f2a52" />
      <path d="M-410 120 L0 10 L410 120 Z" fill="#16325b" />
      <path d="M-410 120 L0 10 L410 120 Z" fill={accent} opacity="0.25" />
      {[-330, -250, -170, -90, -10, 70, 150, 230, 310].map((x) => (
        <rect key={x} x={x} y="140" width="34" height="220" rx="6" fill="#1d3f70" />
      ))}
      {[-330, -250, -170, -90, -10, 70, 150, 230, 310].map((x) => (
        <rect key={`g${x}`} x={x + 40} y="150" width="34" height="120" rx="4" fill={glow} opacity="0.35" />
      ))}
      <rect x="-70" y="250" width="140" height="110" rx="8" fill={accent} opacity="0.8" />
      <rect x="-6" y="-40" width="12" height="54" fill={glow} />
    </g>
  );
}

function CampusQuad({ accent, glow }: { accent: string; glow: string }) {
  return (
    <g transform="translate(800 340)">
      <rect x="-460" y="150" width="360" height="210" rx="10" fill="#12305e" />
      <rect x="100" y="150" width="360" height="210" rx="10" fill="#12305e" />
      <rect x="-90" y="90" width="180" height="270" rx="12" fill="#173d73" />
      {[-440, -380, -320, -260, -200, -140, 120, 180, 240, 300, 360, 420].map((x) => (
        <rect key={x} x={x} y="180" width="34" height="52" rx="4" fill={glow} opacity="0.32" />
      ))}
      {[-60, -10, 40].map((x) => (
        <rect key={x} x={x} y="130" width="30" height="60" rx="4" fill={glow} opacity="0.4" />
      ))}
      <rect x="-30" y="270" width="60" height="90" rx="6" fill={accent} opacity="0.85" />
      {[-560, -520, 520, 560].map((x, i) => (
        <g key={x}>
          <rect x={x} y="290" width="10" height="70" fill="#0d2244" />
          <circle cx={x + 5} cy="276" r={34 - i * 3} fill="#00a170" opacity="0.55" />
        </g>
      ))}
    </g>
  );
}

function BrandArch({ accent, glow }: { accent: string; glow: string }) {
  return (
    <g transform="translate(800 300)">
      <path
        d="M-560 280 Q 0 40 560 280"
        fill="none"
        stroke={accent}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M-560 300 Q 0 60 560 300"
        fill="none"
        stroke={glow}
        strokeWidth="8"
        opacity="0.75"
        strokeLinecap="round"
      />
      {[-420, -280, -140, 0, 140, 280, 420].map((x) => {
        const t = x / 560;
        const y = 280 - 240 * (1 - t * t);
        return <line key={x} x1={x} y1={y} x2={x} y2="330" stroke={accent} strokeWidth="9" opacity="0.85" />;
      })}
      <rect x="-620" y="326" width="1240" height="16" rx="8" fill={accent} opacity="0.9" />
    </g>
  );
}

function Landmark({ kind, accent, glow }: { kind: Landmark; accent: string; glow: string }) {
  switch (kind) {
    case "pearl":
      return <PearlTower accent={accent} glow={glow} />;
    case "canton":
      return <CantonTower accent={accent} glow={glow} />;
    case "pagoda":
      return <Pagoda accent={accent} glow={glow} />;
    case "gate":
      return <ImperialGate accent={accent} glow={glow} />;
    case "library":
      return <CampusLibrary accent={accent} glow={glow} />;
    case "quad":
      return <CampusQuad accent={accent} glow={glow} />;
    case "arch":
      return <BrandArch accent={accent} glow={glow} />;
  }
}

export default function SceneArt({
  scene,
  className,
  style,
}: {
  scene: SceneKey;
  className?: string;
  style?: CSSProperties;
}) {
  const spec = SCENES[scene] ?? SCENES.shanghai;
  const uid = `sc-${scene}`;

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={style}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={spec.sky[0]} />
          <stop offset="58%" stopColor={spec.sky[1]} />
          <stop offset="100%" stopColor={spec.sky[2]} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={spec.glow} stopOpacity="0.85" />
          <stop offset="100%" stopColor={spec.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={spec.near} stopOpacity="0.95" />
          <stop offset="100%" stopColor={spec.sky[2]} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill={`url(#${uid}-sky)`} />
      <circle cx="1080" cy="250" r="320" fill={`url(#${uid}-glow)`} />
      <circle cx="1080" cy="250" r="72" fill={spec.glow} opacity="0.55" />

      {/* distant haze ridge */}
      <path
        d="M0 560 Q 220 470 430 545 Q 640 620 860 520 Q 1100 415 1330 520 Q 1470 580 1600 530 L1600 900 L0 900 Z"
        fill={spec.far}
        opacity="0.45"
      />

      <Skyline
        color={spec.far}
        seed={spec.seed}
        baseline={700}
        minH={110}
        maxH={330}
        count={14}
        opacity={0.85}
        windows={false}
        windowColor={spec.glow}
      />

      <Landmark kind={spec.landmark} accent={spec.accent} glow={spec.glow} />

      <Skyline
        color={spec.near}
        seed={spec.seed + 3}
        baseline={760}
        minH={90}
        maxH={260}
        count={11}
        opacity={0.98}
        windows
        windowColor={spec.glow}
      />

      {spec.water ? (
        <>
          <rect x="0" y="748" width="1600" height="152" fill={`url(#${uid}-water)`} />
          {[770, 796, 822, 850, 876].map((y, i) => (
            <rect
              key={y}
              x={80 * i}
              y={y}
              width={1600 - 120 * i}
              height="3"
              fill={spec.glow}
              opacity={0.22 - i * 0.03}
            />
          ))}
        </>
      ) : (
        <rect x="0" y="758" width="1600" height="142" fill={spec.near} />
      )}
    </svg>
  );
}
