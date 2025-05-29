"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, FileText, Loader2 } from "lucide-react"
import jsPDF from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTransactionStore } from "@/lib/store/transaction-store"
import { useCaseStore } from "@/lib/store/case-store"

interface Report {
  id: string
  title: string
  description: string
  period: string
  lastGenerated: string | null
  type: "regulatory" | "internal" | "ml-performance"
  generateFunction: () => void
}

export function ReportsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [reportFormat, setReportFormat] = useState("pdf")
  const { toast } = useToast()

  const { transactions } = useTransactionStore()
  const { cases } = useCaseStore()

  const generateSARReport = () => {
    const doc = new jsPDF()
    const currentDate = new Date().toLocaleDateString()

    // Header
    doc.setFontSize(20)
    doc.text("Monthly Suspicious Activity Report", 20, 30)
    doc.setFontSize(12)
    doc.text(`Generated on: ${currentDate}`, 20, 45)

    // Summary Statistics
    const highRiskTransactions = transactions.filter((tx) => tx.riskScore >= 80)
    const flaggedTransactions = transactions.filter((tx) => tx.status === "Flagged" || tx.status === "Blocked")
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)

    doc.text("EXECUTIVE SUMMARY", 20, 65)
    doc.text(`Total Transactions Monitored: ${transactions.length}`, 20, 80)
    doc.text(`High Risk Transactions: ${highRiskTransactions.length}`, 20, 95)
    doc.text(`Flagged/Blocked Transactions: ${flaggedTransactions.length}`, 20, 110)
    doc.text(`Total Transaction Volume: $${totalAmount.toLocaleString()}`, 20, 125)
    doc.text(`Active Cases: ${cases.length}`, 20, 140)

    // High Risk Transactions Details
    doc.text("HIGH RISK TRANSACTIONS", 20, 165)
    let yPos = 180

    highRiskTransactions.slice(0, 5).forEach((tx, index) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 30
      }
      doc.text(`${index + 1}. ${tx.id} - $${tx.amount.toLocaleString()} (Risk: ${tx.riskScore}%)`, 20, yPos)
      doc.text(`   From: ${tx.sender} To: ${tx.recipient}`, 25, yPos + 10)
      doc.text(`   Status: ${tx.status} Date: ${tx.date}`, 25, yPos + 20)
      yPos += 35
    })

    doc.save("SAR_Report.pdf")
  }

  const generateRiskAssessment = () => {
    const doc = new jsPDF()
    const currentDate = new Date().toLocaleDateString()

    doc.setFontSize(20)
    doc.text("Quarterly Risk Assessment", 20, 30)
    doc.setFontSize(12)
    doc.text(`Generated on: ${currentDate}`, 20, 45)

    // Risk Distribution
    const lowRisk = transactions.filter((tx) => tx.riskScore < 50).length
    const mediumRisk = transactions.filter((tx) => tx.riskScore >= 50 && tx.riskScore < 80).length
    const highRisk = transactions.filter((tx) => tx.riskScore >= 80).length

    doc.text("RISK DISTRIBUTION ANALYSIS", 20, 65)
    doc.text(
      `Low Risk (0-49%): ${lowRisk} transactions (${((lowRisk / transactions.length) * 100).toFixed(1)}%)`,
      20,
      80,
    )
    doc.text(
      `Medium Risk (50-79%): ${mediumRisk} transactions (${((mediumRisk / transactions.length) * 100).toFixed(1)}%)`,
      20,
      95,
    )
    doc.text(
      `High Risk (80-100%): ${highRisk} transactions (${((highRisk / transactions.length) * 100).toFixed(1)}%)`,
      20,
      110,
    )

    // ML Performance Metrics
    const avgRiskScore = transactions.reduce((sum, tx) => sum + tx.riskScore, 0) / transactions.length
    const falsePositiveRate =
      (transactions.filter((tx) => tx.status === "Cleared" && tx.riskScore > 70).length / transactions.length) * 100

    doc.text("ML MODEL PERFORMANCE", 20, 135)
    doc.text(`Average Risk Score: ${avgRiskScore.toFixed(1)}%`, 20, 150)
    doc.text(`Estimated False Positive Rate: ${falsePositiveRate.toFixed(1)}%`, 20, 165)
    doc.text(`Model Accuracy: ${(100 - falsePositiveRate).toFixed(1)}%`, 20, 180)

    doc.save("Risk_Assessment_Report.pdf")
  }

  const generateMLPerformance = () => {
    const doc = new jsPDF()
    const currentDate = new Date().toLocaleDateString()

    doc.setFontSize(20)
    doc.text("ML Model Performance Report", 20, 30)
    doc.setFontSize(12)
    doc.text(`Generated on: ${currentDate}`, 20, 45)

    // Performance Metrics
    const totalPredictions = transactions.length
    const highConfidencePredictions = transactions.filter((tx) => tx.riskScore > 80 || tx.riskScore < 20).length
    const mediumConfidencePredictions = transactions.filter((tx) => tx.riskScore >= 20 && tx.riskScore <= 80).length

    doc.text("MODEL CONFIDENCE ANALYSIS", 20, 65)
    doc.text(`Total Predictions Made: ${totalPredictions}`, 20, 80)
    doc.text(
      `High Confidence Predictions: ${highConfidencePredictions} (${((highConfidencePredictions / totalPredictions) * 100).toFixed(1)}%)`,
      20,
      95,
    )
    doc.text(
      `Medium Confidence Predictions: ${mediumConfidencePredictions} (${((mediumConfidencePredictions / totalPredictions) * 100).toFixed(1)}%)`,
      20,
      110,
    )

    // Status Distribution
    const statusCounts = transactions.reduce(
      (acc, tx) => {
        acc[tx.status] = (acc[tx.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    doc.text("PREDICTION OUTCOMES", 20, 135)
    Object.entries(statusCounts).forEach(([status, count], index) => {
      doc.text(`${status}: ${count} (${((count / totalPredictions) * 100).toFixed(1)}%)`, 20, 150 + index * 15)
    })

    doc.save("ML_Performance_Report.pdf")
  }

  const reports: Report[] = [
    {
      id: "SAR-MAR-2023",
      title: "Monthly Suspicious Activity Report",
      description: "Comprehensive report of all suspicious activities detected and reported",
      period: "Current Month",
      lastGenerated: transactions.length > 0 ? new Date().toISOString().split("T")[0] : null,
      type: "regulatory",
      generateFunction: generateSARReport,
    },
    {
      id: "QRA-Q1-2023",
      title: "Quarterly Risk Assessment",
      description: "Assessment of AML risk factors and effectiveness of controls",
      period: "Current Quarter",
      lastGenerated: transactions.length > 0 ? new Date().toISOString().split("T")[0] : null,
      type: "regulatory",
      generateFunction: generateRiskAssessment,
    },
    {
      id: "ML-PERF-30D",
      title: "ML Model Performance Report",
      description: "Analysis of machine learning model accuracy and effectiveness",
      period: "Last 30 days",
      lastGenerated: transactions.length > 0 ? new Date().toISOString().split("T")[0] : null,
      type: "ml-performance",
      generateFunction: generateMLPerformance,
    },
  ]

  const filteredReports = reports.filter((report) => {
    if (activeTab === "all") return true
    return report.type === activeTab
  })

  const handleGenerateReport = (report: Report) => {
    if (transactions.length === 0) {
      toast({
        title: "No data available",
        description: "Add some transactions first to generate meaningful reports",
        variant: "destructive",
      })
      return
    }

    setGeneratingReport(report.id)

    // Simulate report generation
    setTimeout(() => {
      report.generateFunction()
      setGeneratingReport(null)
      toast({
        title: "Report generated successfully",
        description: "Your PDF report has been downloaded",
      })
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Compliance Reports</h2>
        <div className="flex items-center gap-2">
          <Select value={reportFormat} onValueChange={setReportFormat}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {transactions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding transactions to generate meaningful compliance reports
            </p>
            <Button asChild>
              <a href="/dashboard/transactions">Add Transactions</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {transactions.length > 0 && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            <TabsTrigger value="internal">Internal</TabsTrigger>
            <TabsTrigger value="ml-performance">ML Performance</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{report.period}</span>
                          </div>
                          {report.lastGenerated && (
                            <div className="text-sm text-muted-foreground">
                              Data available: {transactions.length} transactions
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => handleGenerateReport(report)}
                            disabled={generatingReport === report.id}
                          >
                            {generatingReport === report.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <FileText className="mr-2 h-4 w-4" />
                                Generate PDF
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
