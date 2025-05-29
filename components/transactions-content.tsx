"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, Search, Plus, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TransactionTable } from "@/components/transaction-table"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTransactionStore } from "@/lib/store/transaction-store"
import { useToast } from "@/hooks/use-toast"

const transactionSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  sender: z.string().min(2, "Sender name must be at least 2 characters"),
  recipient: z.string().min(2, "Recipient name must be at least 2 characters"),
  description: z.string().optional(),
})

export function TransactionsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [riskLevel, setRiskLevel] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("7days")
  const [showFilters, setShowFilters] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { transactions, addTransaction } = useTransactionStore()
  const { toast } = useToast()

  // Add state for advanced filters at the top of the component:
  const [advancedFilters, setAdvancedFilters] = useState({
    amountMin: "",
    amountMax: "",
    senderFilter: "",
    recipientFilter: "",
    statusFilter: "all",
  })
  const [isAdvancedDialogOpen, setIsAdvancedDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      sender: "",
      recipient: "",
      description: "",
    },
  })

  // Update the filteredTransactions logic to include advanced filters:
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRisk =
      riskLevel === "all" ||
      (riskLevel === "high" && tx.riskScore >= 80) ||
      (riskLevel === "medium" && tx.riskScore >= 50 && tx.riskScore < 80) ||
      (riskLevel === "low" && tx.riskScore < 50)

    const matchesStatus = statusFilter === "all" || tx.status.toLowerCase() === statusFilter.toLowerCase()

    // Advanced filters
    const matchesAmountMin = !advancedFilters.amountMin || tx.amount >= Number(advancedFilters.amountMin)
    const matchesAmountMax = !advancedFilters.amountMax || tx.amount <= Number(advancedFilters.amountMax)
    const matchesSender =
      !advancedFilters.senderFilter || tx.sender.toLowerCase().includes(advancedFilters.senderFilter.toLowerCase())
    const matchesRecipient =
      !advancedFilters.recipientFilter ||
      tx.recipient.toLowerCase().includes(advancedFilters.recipientFilter.toLowerCase())
    const matchesAdvancedStatus =
      advancedFilters.statusFilter === "all" || tx.status.toLowerCase() === advancedFilters.statusFilter.toLowerCase()

    return (
      matchesSearch &&
      matchesRisk &&
      matchesStatus &&
      matchesAmountMin &&
      matchesAmountMax &&
      matchesSender &&
      matchesRecipient &&
      matchesAdvancedStatus
    )
  })

  // Add functions to handle advanced filters:
  const handleApplyAdvancedFilters = () => {
    setIsAdvancedDialogOpen(false)
    toast({
      title: "Filters applied",
      description: "Advanced filters have been applied to the transaction list",
    })
  }

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters({
      amountMin: "",
      amountMax: "",
      senderFilter: "",
      recipientFilter: "",
      statusFilter: "all",
    })
    toast({
      title: "Filters reset",
      description: "All advanced filters have been cleared",
    })
  }

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    setIsAnalyzing(true)

    // Simulate ML analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    addTransaction(values)

    setIsAnalyzing(false)
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Transaction added successfully",
      description: "The transaction has been analyzed and added to the system",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transaction Monitoring</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Enter transaction details. The system will automatically analyze and assign risk scores.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Smith" {...field} />
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
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Payment for services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Add Transaction"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAdvancedDialogOpen} onOpenChange={setIsAdvancedDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Transactions</DialogTitle>
                <DialogDescription>Set specific criteria to narrow down transaction results.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="amount-min" className="text-sm font-medium">
                    Amount Range
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="amount-min"
                      placeholder="Min"
                      className="w-full"
                      type="number"
                      value={advancedFilters.amountMin}
                      onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, amountMin: e.target.value }))}
                    />
                    <span>to</span>
                    <Input
                      id="amount-max"
                      placeholder="Max"
                      className="w-full"
                      type="number"
                      value={advancedFilters.amountMax}
                      onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, amountMax: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="sender" className="text-sm font-medium">
                    Sender
                  </label>
                  <Input
                    id="sender"
                    placeholder="Sender name or ID"
                    value={advancedFilters.senderFilter}
                    onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, senderFilter: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="recipient" className="text-sm font-medium">
                    Recipient
                  </label>
                  <Input
                    id="recipient"
                    placeholder="Recipient name or ID"
                    value={advancedFilters.recipientFilter}
                    onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, recipientFilter: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="advanced-status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={advancedFilters.statusFilter}
                    onValueChange={(value) => setAdvancedFilters((prev) => ({ ...prev, statusFilter: value }))}
                  >
                    <SelectTrigger id="advanced-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cleared">Cleared</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleResetAdvancedFilters}>
                  Reset
                </Button>
                <Button onClick={handleApplyAdvancedFilters}>Apply Filters</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="grid gap-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Transaction ID, sender, recipient..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="risk-level" className="text-sm font-medium">
                  Risk Level
                </label>
                <Select value={riskLevel} onValueChange={setRiskLevel}>
                  <SelectTrigger id="risk-level">
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="date-range" className="text-sm font-medium">
                  Date Range
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction List</CardTitle>
              <CardDescription>View and analyze all transactions with ML-based risk scoring</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={filteredTransactions} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
