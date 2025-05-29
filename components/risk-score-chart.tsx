"use client"

import { useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

const initialData = [
  {
    month: "Jan",
    "High Risk": 24,
    "Medium Risk": 43,
    "Low Risk": 125,
  },
  {
    month: "Feb",
    "High Risk": 27,
    "Medium Risk": 38,
    "Low Risk": 132,
  },
  {
    month: "Mar",
    "High Risk": 28,
    "Medium Risk": 45,
    "Low Risk": 118,
  },
  {
    month: "Apr",
    "High Risk": 22,
    "Medium Risk": 41,
    "Low Risk": 120,
  },
  {
    month: "May",
    "High Risk": 25,
    "Medium Risk": 37,
    "Low Risk": 130,
  },
  {
    month: "Jun",
    "High Risk": 29,
    "Medium Risk": 40,
    "Low Risk": 135,
  },
]

export function RiskScoreChart() {
  const [data, setData] = useState(initialData)
  const [activeLines, setActiveLines] = useState({
    "High Risk": true,
    "Medium Risk": true,
    "Low Risk": true,
  })

  const toggleLine = (line) => {
    setActiveLines((prev) => ({
      ...prev,
      [line]: !prev[line],
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeLines["High Risk"] ? "default" : "outline"}
          className={`${activeLines["High Risk"] ? "" : "opacity-50"}`}
          onClick={() => toggleLine("High Risk")}
        >
          <div className="mr-2 h-3 w-3 rounded-full bg-destructive" />
          High Risk
        </Button>
        <Button
          size="sm"
          variant={activeLines["Medium Risk"] ? "default" : "outline"}
          className={`${activeLines["Medium Risk"] ? "" : "opacity-50"}`}
          onClick={() => toggleLine("Medium Risk")}
        >
          <div className="mr-2 h-3 w-3 rounded-full bg-amber-500" />
          Medium Risk
        </Button>
        <Button
          size="sm"
          variant={activeLines["Low Risk"] ? "default" : "outline"}
          className={`${activeLines["Low Risk"] ? "" : "opacity-50"}`}
          onClick={() => toggleLine("Low Risk")}
        >
          <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
          Low Risk
        </Button>
      </div>

      <ChartContainer
        config={{
          "High Risk": {
            label: "High Risk",
            color: "hsl(var(--destructive))",
          },
          "Medium Risk": {
            label: "Medium Risk",
            color: "hsl(38, 92%, 50%)",
          },
          "Low Risk": {
            label: "Low Risk",
            color: "hsl(142, 76%, 36%)",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {activeLines["High Risk"] && (
              <Line
                type="monotone"
                dataKey="High Risk"
                stroke="var(--color-High Risk)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            )}
            {activeLines["Medium Risk"] && (
              <Line
                type="monotone"
                dataKey="Medium Risk"
                stroke="var(--color-Medium Risk)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            )}
            {activeLines["Low Risk"] && (
              <Line
                type="monotone"
                dataKey="Low Risk"
                stroke="var(--color-Low Risk)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
