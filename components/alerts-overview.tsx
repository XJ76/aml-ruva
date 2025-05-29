"use client"

import { useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { motion } from "framer-motion"

const initialData = [
  { name: "Structured Transactions", value: 35, color: "#ef4444" },
  { name: "Unusual Activity", value: 25, color: "#f97316" },
  { name: "High-Risk Jurisdictions", value: 20, color: "#eab308" },
  { name: "Watchlist Matches", value: 15, color: "#3b82f6" },
  { name: "Other", value: 5, color: "#6b7280" },
]

export function AlertsOverview() {
  const [data, setData] = useState(initialData)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handlePieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const handlePieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={handlePieEnter}
              onMouseLeave={handlePieLeave}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                  stroke={activeIndex === index ? "#fff" : "none"}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} alerts`, "Count"]}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            className="flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setActiveIndex(index)}
            onHoverEnd={() => setActiveIndex(null)}
          >
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{item.value} alerts</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
