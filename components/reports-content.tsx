"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Download, FileText, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Report {
  id: string
  title: string
  description: string
  period: string
  lastGenerated: string | null
  type: "regulatory" | "internal" | "ml-performance"
}

const reports: Report[] = [
  {
    id: "SAR-MAR-2023",
    title: "Monthly Suspicious Activity Report",
    description: "Comprehensive report of all suspicious activities detected and reported",
    period: "March 2023",
    lastGenerated: "2023-04-02",
    type: "regulatory",
  },
  {
    id: "QRA-Q1-2023",
    title: "Quarterly Risk Assessment",
    description: "Assessment of AML risk factors and effectiveness of controls",
    period: "Q1 2023",
    lastGenerated: "2023-04-05",
    type: "regulatory",
  },
  {
    id: "ML-PERF-30D",
    title: "ML Model Performance Report",
    description: "Analysis of machine learning model accuracy and effectiveness",
    period: "Last 30 days",
    lastGenerated: "2023-04-01",
    type: "ml-performance",
  },
  {
    id: "REG-AUDIT-2023",
    title: "Regulatory Compliance Audit",
    description: "Comprehensive audit of AML compliance program",
    period: "Annual 2023",
    lastGenerated: null,
    type: "regulatory",
  },
  {
    id: "FP-ANALYSIS-Q1",
    title: "False Positive Analysis",
    description: "Analysis of false positive alerts and recommendations for improvement",
    period: "Q1 2023",
    lastGenerated: "2023-04-03",
    type: "internal",
  },
  {
    id: "HIGH-RISK-REVIEW",
    title: "High-Risk Customer Review",
    description: "Detailed review of high-risk customer accounts and transactions",
    period: "Q1 2023",
    lastGenerated: null,
    type: "internal",
  },
]

export function ReportsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [reportFormat, setReportFormat] = useState("pdf")
  const { toast } = useToast()

  const filteredReports = reports.filter((report) => {
    if (activeTab === "all") return true
    return report.type === activeTab
  })

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReport(reportId)

    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(null)
      toast({
        title: "Report generated successfully",
        description: "Your report is ready to download",
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
                          <div className="text-sm text-muted-foreground">Last generated: {report.lastGenerated}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => handleGenerateReport(report.id)}
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
                              Generate
                            </>
                          )}
                        </Button>
                        {report.lastGenerated && (
                          <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

