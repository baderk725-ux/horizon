import type { DailyRevenuePoint } from "@/lib/data/admin/analytics";

/**
 * A plain inline-SVG bar chart — no charting library dependency for one
 * dashboard, consistent with this project's bundle-size discipline.
 */
export function RevenueTrendChart({ points, currency }: { points: DailyRevenuePoint[]; currency: string }) {
  const max = Math.max(1, ...points.map((p) => p.revenue));
  const width = 720;
  const height = 180;
  const barGap = 2;
  const barWidth = points.length > 0 ? width / points.length - barGap : 0;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-44 w-full min-w-[480px]"
        role="img"
        aria-label="Revenue trend"
      >
        {points.map((p, i) => {
          const barHeight = (p.revenue / max) * (height - 20);
          const x = i * (barWidth + barGap);
          const y = height - barHeight;
          return (
            <g key={p.date}>
              <rect
                x={x}
                y={y}
                width={Math.max(barWidth, 1)}
                height={barHeight}
                className="fill-accent-500"
              >
                <title>
                  {p.date}: {p.revenue.toFixed(2)} {currency}
                </title>
              </rect>
            </g>
          );
        })}
        <line x1="0" y1={height} x2={width} y2={height} className="stroke-brand-200" strokeWidth="1" />
      </svg>
    </div>
  );
}
