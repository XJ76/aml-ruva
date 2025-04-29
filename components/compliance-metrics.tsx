"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const initialMetrics = [
  {
    name: "SAR Filing Timeliness",
    value: 92,
    target: 95,
    description: "Percentage of SARs filed within required timeframe",
  },
  {
    name: "KYC Compliance",
    value: 97,
    target: 100,
    description: "Percentage of customer profiles with complete KYC",
  },
  {
    name: "Alert Resolution",
    value: 85,
    target: 90,
    description: "Percentage of alerts resolved within 48 hours",
  },
  {
    name: "ML Model Accuracy",
    value: 87,
    target: 90,
    description: "Accuracy of ML predictions vs. human review",
  },
]

export function ComplianceMetrics() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [animateProgress, setAnimateProgress] = useState(false)

  useEffect(() => {
    // Start animation after component mounts
    setAnimateProgress(true)
  }, [])

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.name}
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{metric.name}</span>
            <span className="text-sm font-medium">{metric.value}%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: animateProgress ? `${metric.value}%` : 0 }}
              transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{metric.description}</span>
            <span>Target: {metric.target}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

