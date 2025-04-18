"use client"
import { LineChart as TremorLineChart, BarChart as TremorBarChart, DonutChart as TremorDonutChart } from "@tremor/react"

interface ChartProps {
  data: any[]
  categories: string[]
  index: string
  colors?: string[]
  valueFormatter?: (value: number, category?: string) => string
  showLegend?: boolean
  showYAxis?: boolean
}

export function LineChart({
  data,
  categories,
  index,
  colors = ["blue", "emerald"],
  valueFormatter = (value) => `${value}`,
  showLegend = true,
  showYAxis = false,
}: ChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <TremorLineChart
      data={data}
      categories={categories}
      index={index}
      colors={colors}
      valueFormatter={valueFormatter}
      showLegend={showLegend}
      showYAxis={showYAxis}
      className="h-full"
    />
  )
}

export function BarChart({
  data,
  categories,
  index,
  colors = ["blue"],
  valueFormatter = (value) => `${value}`,
  showLegend = true,
}: ChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <TremorBarChart
      data={data}
      categories={categories}
      index={index}
      colors={colors}
      valueFormatter={valueFormatter}
      showLegend={showLegend}
      className="h-full"
    />
  )
}

interface PieChartProps {
  data: any[]
  category: string
  index: string
  valueFormatter?: (value: number) => string
  showLabel?: boolean
  showTooltip?: boolean
}

export function PieChart({
  data,
  category,
  index,
  valueFormatter = (value) => `${value}`,
  showLabel = true,
  showTooltip = true,
}: PieChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <TremorDonutChart
      data={data}
      category={category}
      index={index}
      valueFormatter={valueFormatter}
      showLabel={showLabel}
      showTooltip={showTooltip}
      className="h-full"
    />
  )
}
