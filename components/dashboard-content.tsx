"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, BarChart3, Bell, FileText, Filter, RefreshCw, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskScoreChart } from "@/components/risk-score-chart"
import { AlertsOverview } from "@/components/alerts-overview"
import { TransactionTable } from "@/components/transaction-table"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/lib/store/user-store"
import { useTransactionStore } from "@/lib/store/transaction-store"
import { useCaseStore } from "@/lib/store/case-store"
import Link from "next/link"

export function DashboardContent() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { hasTransactions } = useUserStore()
  const { transactions } = useTransactionStore()
  const { cases } = useCaseStore()

  const [metrics, setMetrics] = useState({
    totalAlerts: 0,
    highRiskCases: 0,
    falsePositives: 0,
    mlAccuracy: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (transactions.length > 0) {
      const highRiskTransactions = transactions.filter((tx) => tx.riskScore >= 80)
      const flaggedTransactions = transactions.filter((tx) => tx.status === "Flagged")
      const clearedHighRisk = transactions.filter((tx) => tx.status === "Cleared" && tx.riskScore > 70)
      const falsePositiveRate = transactions.length > 0 ? (clearedHighRisk.length / transactions.length) * 100 : 0
      const avgRiskScore = transactions.reduce((sum, tx) => sum + tx.riskScore, 0) / transactions.length

      setMetrics({
        totalAlerts: flaggedTransactions.length + highRiskTransactions.length,
        highRiskCases: cases.filter((c) => c.riskLevel === "High").length,
        falsePositives: Math.round(falsePositiveRate),
        mlAccuracy: Math.round(100 - falsePositiveRate),
      })
    }
  }, [transactions, cases])

  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate data refresh
    setTimeout(() => {
      // Randomly adjust metrics for demo purposes
      setMetrics({
        totalAlerts: Math.floor(metrics.totalAlerts * (1 + (Math.random() * 0.1 - 0.05))),
        highRiskCases: Math.floor(metrics.highRiskCases * (1 + (Math.random() * 0.1 - 0.05))),
        falsePositives: Math.floor(metrics.falsePositives * (1 + (Math.random() * 0.1 - 0.05))),
        mlAccuracy: Number.parseFloat((metrics.mlAccuracy * (1 + (Math.random() * 0.02 - 0.01))).toFixed(1)),
      })

      setIsRefreshing(false)
      toast({
        title: "Dashboard updated",
        description: "Latest data has been loaded",
      })
    }, 1500)
  }

  if (!hasTransactions && transactions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Welcome to AML Shield</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start monitoring transactions and managing AML compliance. Add your first transaction to see real-time
              analytics and risk assessments.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/dashboard/transactions">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Add First Transaction
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/reports">
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button variant="outline" onClick={refreshData} disabled={isRefreshing} className="transition-all duration-200">
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={metrics.totalAlerts}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {metrics.totalAlerts}
            </motion.div>
            <p className="text-xs text-muted-foreground">+22% from last month</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={metrics.highRiskCases}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {metrics.highRiskCases}
            </motion.div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">False Positives</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={metrics.falsePositives}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {metrics.falsePositives}%
            </motion.div>
            <p className="text-xs text-muted-foreground">-15% from last month</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ML Accuracy</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={metrics.mlAccuracy}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {metrics.mlAccuracy}%
            </motion.div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="cases">Case Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Risk Score Distribution</CardTitle>
                <CardDescription>ML-powered risk assessment across customer segments</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RiskScoreChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Alerts Overview</CardTitle>
                <CardDescription>Breakdown of alerts by type and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsOverview />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction Monitoring</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <CardDescription>Comprehensive view of all transactions with ML-based risk scoring</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionTable limit={10} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <CardTitle>Case Management</CardTitle>
              <CardDescription>Review and manage flagged transactions and suspicious activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div className="rounded-md border" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="grid gap-1">
                        <div className="font-semibold">Case #AML-2023-089</div>
                        <div className="text-sm text-muted-foreground">Opened on Mar 15, 2023</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                          High Risk
                        </div>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm">
                        Multiple high-value transactions from multiple jurisdictions within 24 hours. ML model
                        confidence: 92%
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div className="rounded-md border" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="grid gap-1">
                        <div className="font-semibold">Case #AML-2023-087</div>
                        <div className="text-sm text-muted-foreground">Opened on Mar 14, 2023</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          Medium Risk
                        </div>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm">
                        Unusual pattern of small deposits followed by large withdrawal. ML model confidence: 78%
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div className="rounded-md border" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="grid gap-1">
                        <div className="font-semibold">Case #AML-2023-085</div>
                        <div className="text-sm text-muted-foreground">Opened on Mar 12, 2023</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                          High Risk
                        </div>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm">
                        Transaction with entity on watchlist. Structured to avoid reporting threshold. ML model
                        confidence: 95%
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Assign to Compliance Team
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generate and view regulatory compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div
                  className="rounded-md border p-4"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Monthly Suspicious Activity Report</h3>
                      <p className="text-sm text-muted-foreground">March 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                </motion.div>
                <motion.div
                  className="rounded-md border p-4"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Quarterly Risk Assessment</h3>
                      <p className="text-sm text-muted-foreground">Q1 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                </motion.div>
                <motion.div
                  className="rounded-md border p-4"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">ML Model Performance Report</h3>
                      <p className="text-sm text-muted-foreground">Last 30 days</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
