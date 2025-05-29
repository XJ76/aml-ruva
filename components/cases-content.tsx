"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle, Clock, Search, XCircle, Plus, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCaseStore, type Case } from "@/lib/store/case-store"
import { useToast } from "@/hooks/use-toast"

const caseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  riskLevel: z.enum(["High", "Medium", "Low"]),
  mlConfidence: z.number().min(0).max(100),
  assignedTo: z.string().optional(),
})

export function CasesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { cases, addCase, updateCaseStatus, syncWithTransactions, getFilteredCases } = useCaseStore()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof caseSchema>>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: "",
      description: "",
      riskLevel: "Medium",
      mlConfidence: 50,
      assignedTo: "",
    },
  })

  // Sync with transactions on component mount and periodically
  useEffect(() => {
    syncWithTransactions()
    const interval = setInterval(syncWithTransactions, 30000) // Sync every 30 seconds
    return () => clearInterval(interval)
  }, [syncWithTransactions])

  const filteredCases = getFilteredCases(searchQuery, riskFilter, statusFilter)

  const handleReviewCase = (caseItem: Case) => {
    setSelectedCase(caseItem)
  }

  const handleCloseCase = () => {
    setSelectedCase(null)
  }

  const handleUpdateStatus = (newStatus: Case["status"]) => {
    if (selectedCase) {
      updateCaseStatus(selectedCase.id, newStatus)
      toast({
        title: "Case status updated",
        description: `Case ${selectedCase.id} has been marked as ${newStatus}`,
      })
      setSelectedCase(null)
    }
  }

  const onSubmit = async (values: z.infer<typeof caseSchema>) => {
    setIsSubmitting(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addCase({
      ...values,
      status: "Open",
    })

    setIsSubmitting(false)
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Case created successfully",
      description: "The new case has been added to the system",
    })
  }

  const getRiskBadge = (risk: Case["riskLevel"]) => {
    switch (risk) {
      case "High":
        return <Badge variant="destructive">{risk}</Badge>
      case "Medium":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200"
          >
            {risk}
          </Badge>
        )
      case "Low":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
          >
            {risk}
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: Case["status"]) => {
    switch (status) {
      case "Open":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
          >
            {status}
          </Badge>
        )
      case "In Review":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-200"
          >
            {status}
          </Badge>
        )
      case "Closed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
          >
            {status}
          </Badge>
        )
      case "Escalated":
        return <Badge variant="destructive">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Case Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Case
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>Manually create a new compliance case for investigation.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Suspicious activity detected..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the suspicious activity..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="riskLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mlConfidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confidence Score (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="85"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Compliance Officer Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Case"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Cases</CardTitle>
          <CardDescription>Search and filter suspicious activity cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <label htmlFor="case-search" className="text-sm font-medium">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="case-search"
                  placeholder="Case ID or description..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="risk-filter" className="text-sm font-medium">
                Risk Level
              </label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger id="risk-filter">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Case List</CardTitle>
          <CardDescription>Review and manage flagged transactions and suspicious activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredCases.map((caseItem) => (
                <motion.div
                  key={caseItem.id}
                  className="rounded-md border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="grid gap-1">
                        <div className="font-semibold">Case #{caseItem.id}</div>
                        <div className="text-sm text-muted-foreground">Opened on {caseItem.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRiskBadge(caseItem.riskLevel)}
                        {getStatusBadge(caseItem.status)}
                        <Button variant="outline" size="sm" onClick={() => handleReviewCase(caseItem)}>
                          Review
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium">{caseItem.title}</p>
                      <p className="mt-1 text-sm">
                        {caseItem.description}
                        <span className="ml-2 text-sm font-medium text-primary">
                          ML model confidence: {caseItem.mlConfidence}%
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredCases.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No cases found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Assign Selected to Compliance Team
          </Button>
        </CardFooter>
      </Card>

      {selectedCase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Case Review: #{selectedCase.id}</h3>
              <Button variant="ghost" size="icon" onClick={handleCloseCase}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Risk Level:</span>
                  {getRiskBadge(selectedCase.riskLevel)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(selectedCase.status)}
                </div>
              </div>
              <div>
                <h4 className="font-medium">{selectedCase.title}</h4>
                <p className="mt-1 text-sm">{selectedCase.description}</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ML Confidence Score:</span>
                  <span className="text-sm font-bold">{selectedCase.mlConfidence}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted-foreground/20">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${selectedCase.mlConfidence}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Case Notes</label>
                <textarea
                  className="h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Add your investigation notes here..."
                />
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleUpdateStatus("Closed")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Close Case
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleUpdateStatus("In Review")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Mark In Review
                </Button>
                <Button variant="default" className="flex-1" onClick={() => handleUpdateStatus("Escalated")}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Escalate
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
