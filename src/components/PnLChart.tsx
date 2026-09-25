import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { WeekData } from '@/types'

export function PnLChart({ data }: { data: WeekData['weeklyPnL'] }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Weekly P/L</CardTitle>
        <CardDescription>Stub daily equity — sample data for layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full md:h-[280px] lg:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="pnlFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--color-border)]" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                stroke="var(--color-muted-foreground)"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="var(--color-muted-foreground)"
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-foreground)',
                  fontSize: 13,
                }}
                formatter={(value) => [`$${Number(value ?? 0).toFixed(0)}`, 'P/L']}
              />
              <Area
                type="monotone"
                dataKey="pnl"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#pnlFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function StakeChart({ data }: { data: WeekData['stakeDistribution'] }) {
  const hasStake = data.some((d) => d.value > 0)
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Stake mix</CardTitle>
        <CardDescription>Where this week’s risk sits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full md:h-[280px] lg:h-[300px]">
          {hasStake ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--color-border)]" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="var(--color-muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="var(--color-muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-card)',
                    color: 'var(--color-foreground)',
                    fontSize: 13,
                  }}
                  formatter={(value) => [`$${Number(value ?? 0).toFixed(0)}`, 'Stake']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted-foreground)]">
              No stake yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
