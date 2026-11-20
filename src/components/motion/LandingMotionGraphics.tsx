import { motion, useReducedMotion } from 'motion/react';

/**
 * Hero background subtle architectural CAD grid & drawing elevation lines.
 * Uses only opacity & transform / pathLength for compositor performance.
 */
export function HeroBlueprintOverlay({ slideIndex }: { slideIndex: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {/* Subtle architectural coordinate grid */}
      <svg
        className="w-full h-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-arch-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-arch-grid)" />
      </svg>

      {/* Right-side architectural elevation drawing accent */}
      <svg
        key={slideIndex}
        viewBox="0 0 560 420"
        className="hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 w-[420px] xl:w-[500px] h-auto opacity-35"
        fill="none"
      >
        {/* Horizon & datum lines */}
        <motion.line
          x1="20"
          y1="360"
          x2="540"
          y2="360"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="1"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.line
          x1="80"
          y1="40"
          x2="80"
          y2="380"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Primary building volume elevation */}
        <motion.path
          d="M140 360 V130 L260 95 V360"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.5"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M260 155 L395 185 V360"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="1.5"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M395 235 L475 250 V360"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.2"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Floor slab ticks */}
        {[175, 215, 255, 295, 330].map((y, idx) => (
          <motion.line
            key={y}
            x1="140"
            y1={y}
            x2="260"
            y2={y}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            initial={{ opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + idx * 0.08 }}
          />
        ))}

        {/* Architectural dimension arc */}
        <motion.path
          d="M120 130 C 120 65, 320 55, 415 160"
          stroke="rgba(96,165,250,0.75)"
          strokeWidth="1.2"
          strokeDasharray="5 5"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}

/**
 * Philosophy architectural massing & asset growth blueprint panel.
 */
export function LifecycleMassingGraphic({ language }: { language: 'ko' | 'en' }) {
  const shouldReduceMotion = useReducedMotion();

  const bars = [
    { x: 34, h: 48, label: language === 'ko' ? '부지·입지' : 'Site' },
    { x: 96, h: 78, label: language === 'ko' ? '설계·인허가' : 'Design' },
    { x: 158, h: 112, label: language === 'ko' ? 'PM·시공' : 'Build' },
    { x: 220, h: 148, label: language === 'ko' ? '자산가치' : 'Value' },
  ];

  return (
    <div className="bg-gray-950 text-white rounded-2xl border border-gray-800 p-5 sm:p-6">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <span className="font-medium tracking-wide uppercase">
          {language === 'ko' ? '개발 가치 상승 구조' : 'Development Value Curve'}
        </span>
        <span className="font-mono tabular-nums text-gray-300">
          {language === 'ko' ? '기획 → 시공 → 운영' : 'Plan → Build → Operate'}
        </span>
      </div>

      <svg
        viewBox="0 0 300 185"
        className="w-full h-auto"
        role="img"
        aria-label={
          language === 'ko'
            ? '부지 분석부터 자산 가치 상승까지의 4단계 건축 개발 흐름 그래프'
            : 'Four-stage architectural development value growth chart'
        }
      >
        {/* Horizontal reference lines */}
        {[40, 80, 120, 155].map((y) => (
          <line
            key={y}
            x1="16"
            y1={y}
            x2="284"
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Building massing bars */}
        {bars.map((bar, idx) => {
          const topY = 155 - bar.h;
          return (
            <g key={bar.label}>
              <motion.rect
                x={bar.x}
                y={topY}
                width="36"
                height={bar.h}
                rx="4"
                fill={idx === 3 ? '#2563EB' : 'rgba(255,255,255,0.14)'}
                stroke={idx === 3 ? '#60A5FA' : 'rgba(255,255,255,0.28)'}
                strokeWidth="1"
                style={{ transformOrigin: `${bar.x + 18}px 155px` }}
                initial={{ scaleY: shouldReduceMotion ? 1 : 0.15, opacity: shouldReduceMotion ? 1 : 0.2 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
              <text
                x={bar.x + 18}
                y="174"
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="11"
                fontWeight="500"
              >
                {bar.label}
              </text>
            </g>
          );
        })}

        {/* Smooth asset trajectory curve */}
        <motion.path
          d="M 52 104 C 95 96, 130 78, 176 42 C 202 22, 224 14, 238 8"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Endpoint highlight */}
        <motion.circle
          cx="238"
          cy="8"
          r="4"
          fill="#93C5FD"
          initial={{ scale: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.3, delay: 1.15 }}
        />
      </svg>
    </div>
  );
}

/**
 * Interactive 3-Layer Isometric Architectural Value Cube for CoreValues.tsx
 */
export function IsometricValueGraphic({
  activeIndex,
  onSelect,
  language,
}: {
  activeIndex: number;
  onSelect: (idx: number) => void;
  language: 'ko' | 'en';
}) {
  const shouldReduceMotion = useReducedMotion();

  const layers = [
    {
      index: 2,
      code: 'G',
      name: 'Gain! Value',
      ko: '금융기획 · 자산수익',
      en: 'Finance & Asset Gains',
      baseY: 54,
      accentFill: '#1D4ED8',
      accentStroke: '#60A5FA',
    },
    {
      index: 1,
      code: 'I',
      name: 'Insight!',
      ko: 'PM 플랫폼 · 공정관리',
      en: 'Intelligence Platform',
      baseY: 138,
      accentFill: '#111827',
      accentStroke: '#9CA3AF',
    },
    {
      index: 0,
      code: 'B',
      name: 'We Buildup!',
      ko: '입지분석 · 공간창조',
      en: 'Site & Space Creation',
      baseY: 222,
      accentFill: '#0F172A',
      accentStroke: '#38BDF8',
    },
  ];

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 overflow-hidden">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span className="font-semibold tracking-wider uppercase text-gray-700">
          {language === 'ko' ? 'B · I · G 공간 가치 아키텍처' : 'B · I · G Value Architecture'}
        </span>
        <span className="tabular-nums font-mono">
          0{activeIndex + 1} / 03
        </span>
      </div>

      <svg
        viewBox="0 0 440 340"
        className="w-full h-auto max-h-[340px]"
        role="img"
        aria-label={
          language === 'ko'
            ? 'Buildup, Insight, Gains 3계층 건축 가치 다이어그램'
            : 'Three-tier Buildup, Insight, Gains architectural value diagram'
        }
      >
        {/* Vertical isometric axis guide */}
        <line
          x1="175"
          y1="26"
          x2="175"
          y2="316"
          stroke="#E5E7EB"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {layers.map((layer) => {
          const isActive = activeIndex === layer.index;
          const liftY = shouldReduceMotion ? 0 : isActive ? -8 : 0;

          return (
            <motion.g
              key={layer.code}
              className="cursor-pointer"
              onClick={() => onSelect(layer.index)}
              animate={{ y: liftY }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top isometric diamond face */}
              <polygon
                points={`175,${layer.baseY} 290,${layer.baseY + 42} 175,${layer.baseY + 84} 60,${layer.baseY + 42}`}
                fill={isActive ? layer.accentFill : '#F9FAFB'}
                stroke={isActive ? layer.accentStroke : '#D1D5DB'}
                strokeWidth={isActive ? '1.8' : '1.2'}
              />
              {/* Left extruded edge */}
              <polygon
                points={`60,${layer.baseY + 42} 175,${layer.baseY + 84} 175,${layer.baseY + 100} 60,${layer.baseY + 58}`}
                fill={isActive ? '#1E293B' : '#E5E7EB'}
                stroke={isActive ? layer.accentStroke : '#D1D5DB'}
                strokeWidth="1"
              />
              {/* Right extruded edge */}
              <polygon
                points={`290,${layer.baseY + 42} 175,${layer.baseY + 84} 175,${layer.baseY + 100} 290,${layer.baseY + 58}`}
                fill={isActive ? '#0F172A' : '#F3F4F6'}
                stroke={isActive ? layer.accentStroke : '#D1D5DB'}
                strokeWidth="1"
              />

              {/* Layer glyph inside isometric plate */}
              <text
                x="175"
                y={layer.baseY + 48}
                textAnchor="middle"
                fill={isActive ? '#FFFFFF' : '#374151'}
                fontSize="16"
                fontWeight="700"
              >
                {layer.code}
              </text>

              {/* Callout leader line to right label */}
              <line
                x1="290"
                y1={layer.baseY + 42}
                x2="320"
                y2={layer.baseY + 42}
                stroke={isActive ? '#2563EB' : '#D1D5DB'}
                strokeWidth={isActive ? '1.6' : '1'}
              />
              <circle
                cx="320"
                cy={layer.baseY + 42}
                r={isActive ? 3.5 : 2.5}
                fill={isActive ? '#2563EB' : '#9CA3AF'}
              />

              {/* Right-side descriptive label */}
              <text
                x="330"
                y={layer.baseY + 38}
                fill={isActive ? '#111827' : '#6B7280'}
                fontSize="13"
                fontWeight="700"
              >
                {layer.name}
              </text>
              <text
                x="330"
                y={layer.baseY + 55}
                fill={isActive ? '#2563EB' : '#9CA3AF'}
                fontSize="11.5"
                fontWeight="500"
              >
                {language === 'ko' ? layer.ko : layer.en}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>
          {language === 'ko'
            ? '각 계층을 클릭하여 상세 가치를 확인하세요'
            : 'Click any tier to inspect value details'}
        </span>
        <span className="font-medium text-gray-800">
          {language === 'ko' ? '통합 개발 체계' : 'Integrated System'}
        </span>
      </div>
    </div>
  );
}

/**
 * Services Bento 01: BIG Consulting — Parcel & Financial Curve SVG Motion
 */
export function ConsultingCurveGraphic() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-hidden"
    >
      <svg viewBox="0 0 360 120" className="w-full h-28">
        {/* Baseline grid */}
        <line x1="12" y1="96" x2="348" y2="96" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="12" y1="58" x2="348" y2="58" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="12" y1="20" x2="348" y2="20" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />

        {/* Parcel / Zoning blueprint box */}
        <motion.rect
          x="20"
          y="26"
          width="86"
          height="64"
          rx="4"
          fill="#FFFFFF"
          stroke="#9CA3AF"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          initial={{ opacity: shouldReduceMotion ? 1 : 0.4 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />
        <motion.rect
          x="34"
          y="38"
          width="58"
          height="40"
          rx="3"
          fill="#DBEAFE"
          stroke="#2563EB"
          strokeWidth="1.4"
          initial={{ scale: shouldReduceMotion ? 1 : 0.8 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Cash Flow optimization curve */}
        <motion.path
          d="M 132 88 C 175 86, 205 68, 240 52 C 278 35, 305 24, 340 18"
          fill="none"
          stroke="#111827"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M 132 76 C 175 78, 215 74, 260 66 C 295 60, 315 54, 340 48"
          fill="none"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {[
          { cx: 185, cy: 74 },
          { cx: 240, cy: 52 },
          { cx: 340, cy: 18 },
        ].map((pt, i) => (
          <motion.circle
            key={i}
            cx={pt.cx}
            cy={pt.cy}
            r="3.5"
            fill={i === 2 ? '#2563EB' : '#111827'}
            initial={{ scale: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * Services Bento 02: BIG Management — Animated Construction Schedule Bars
 */
export function ManagementTimelineGraphic({ language }: { language: 'ko' | 'en' }) {
  const shouldReduceMotion = useReducedMotion();

  const tracks = [
    { label: language === 'ko' ? '설계·인허가' : 'Design', left: 10, width: 32 },
    { label: language === 'ko' ? '골조·시공' : 'Structure', left: 28, width: 46 },
    { label: language === 'ko' ? '품질·감리' : 'Inspect', left: 52, width: 38 },
  ];

  return (
    <div
      aria-hidden="true"
      className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5"
    >
      {tracks.map((track, idx) => (
        <div key={track.label} className="space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-gray-600">
            <span>{track.label}</span>
            <span className="font-mono tabular-nums text-gray-400">0{idx + 1}</span>
          </div>
          <div className="h-2.5 bg-gray-200/80 rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full ${idx === 2 ? 'bg-blue-600' : 'bg-gray-900'}`}
              style={{
                marginLeft: `${track.left}%`,
                width: `${track.width}%`,
                transformOrigin: 'left center',
              }}
              initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Services Bento 03: BIG Credit — Escrow Payment Protection Flow
 */
export function EscrowShieldGraphic({ language }: { language: 'ko' | 'en' }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="bg-gray-50 border border-gray-200 rounded-xl p-4"
    >
      <svg viewBox="0 0 320 96" className="w-full h-24">
        {/* Left Node: 건축주 */}
        <rect x="8" y="24" width="76" height="46" rx="8" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.2" />
        <text x="46" y="51" textAnchor="middle" fill="#111827" fontSize="11.5" fontWeight="600">
          {language === 'ko' ? '건축주' : 'Owner'}
        </text>

        {/* Center Node: 에스크로 보호 */}
        <rect x="116" y="18" width="88" height="58" rx="10" fill="#111827" />
        <text x="160" y="44" textAnchor="middle" fill="#93C5FD" fontSize="10.5" fontWeight="600">
          ESCROW
        </text>
        <text x="160" y="61" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="700">
          {language === 'ko' ? '안전 예치' : 'Protected'}
        </text>

        {/* Right Node: 기성 정산 */}
        <rect x="236" y="24" width="76" height="46" rx="8" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.2" />
        <text x="274" y="51" textAnchor="middle" fill="#111827" fontSize="11.5" fontWeight="600">
          {language === 'ko' ? '기성 정산' : 'Release'}
        </text>

        {/* Connectors */}
        <motion.path
          d="M 86 47 L 114 47"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        />
        <motion.path
          d="M 206 47 L 234 47"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
        />
      </svg>
    </div>
  );
}

/**
 * Services Bento 04: 방재실 AI 민원 도우미 — Automated Triage Flow
 */
export function AiTriageFlowGraphic({ language }: { language: 'ko' | 'en' }) {
  const shouldReduceMotion = useReducedMotion();

  const stages = [
    { x: 14, title: language === 'ko' ? '입주민 문의' : 'Tenant Ask', sub: language === 'ko' ? '24시간 접수' : 'Intake' },
    { x: 136, title: language === 'ko' ? 'AI 매뉴얼 안내' : 'AI Guide', sub: language === 'ko' ? '위치·내용 정리' : 'Classify' },
    { x: 258, title: language === 'ko' ? '방재실 전달' : 'Ops Dispatch', sub: language === 'ko' ? '이력 자동 기록' : 'Logged' },
  ];

  return (
    <div
      aria-hidden="true"
      className="bg-gray-950 text-white border border-gray-800 rounded-xl p-4"
    >
      <svg viewBox="0 0 380 96" className="w-full h-24">
        {/* Flow lines */}
        <motion.line
          x1="122"
          y1="48"
          x2="136"
          y2="48"
          stroke="#60A5FA"
          strokeWidth="2"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
        />
        <motion.line
          x1="244"
          y1="48"
          x2="258"
          y2="48"
          stroke="#60A5FA"
          strokeWidth="2"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.45 }}
        />

        {stages.map((stage, idx) => (
          <motion.g
            key={stage.title}
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.15 }}
          >
            <rect
              x={stage.x}
              y="16"
              width="108"
              height="64"
              rx="8"
              fill={idx === 1 ? '#1D4ED8' : 'rgba(255,255,255,0.06)'}
              stroke={idx === 1 ? '#60A5FA' : 'rgba(255,255,255,0.2)'}
              strokeWidth="1.2"
            />
            <text
              x={stage.x + 54}
              y="43"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontWeight="700"
            >
              {stage.title}
            </text>
            <text
              x={stage.x + 54}
              y="62"
              textAnchor="middle"
              fill={idx === 1 ? '#DBEAFE' : '#9CA3AF'}
              fontSize="10.5"
              fontWeight="500"
            >
              {stage.sub}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Contact CTA animated architectural perspective horizon lines
 */
export function CtaHorizonMotion() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg className="w-full h-full opacity-20" viewBox="0 0 1200 420" preserveAspectRatio="none">
        <defs>
          <pattern id="cta-arch-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="1200" height="420" fill="url(#cta-arch-grid)" />

        <motion.path
          d="M 0 320 Q 380 230, 620 265 T 1200 130"
          fill="none"
          stroke="rgba(96,165,250,0.65)"
          strokeWidth="1.5"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M 0 360 Q 440 285, 720 300 T 1200 185"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          strokeDasharray="6 6"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}
