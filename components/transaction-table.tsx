"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpDown, Eye, MoreHorizontal, Shield, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  date: string
  amount: number
  sender: string
  recipient: string
  riskScore: number
  status: "Pending" | "Cleared" | "Flagged" | "Blocked"
}

const initialTransactions: Transaction[] = [
  {
    id: "TX-7829",
    date: "2023-03-28",
    amount: 24950,
    sender: "Global Trading Ltd.",
    recipient: "Acme Corp",
    riskScore: 87,
    status: "Flagged",
  },
  {
    id: "TX-7828",
    date: "2023-03-27",
    amount: 5000,
    sender: "John Smith",
    recipient: "Jane Doe",
    riskScore: 32,
    status: "Cleared",
  },
  {
    id: "TX-7827",
    date: "2023-03-27",
    amount: 18750,
    sender: "Offshore Holdings",
    recipient: "Local Business Inc.",
    riskScore: 76,
    status: "Pending",
  },
  {
    id: "TX-7826",
    date: "2023-03-26",
    amount: 9999,
    sender: "Anonymous Sender",
    recipient: "Cash Services Ltd.",
    riskScore: 92,
    status: "Blocked",
  },
  {
    id: "TX-7825",
    date: "2023-03-26",
    amount: 3500,
    sender: "Regular Customer",
    recipient: "Online Shop",
    riskScore: 12,
    status: "Cleared",
  },
  {
    id: "TX-7824",
    date: "2023-03-25",
    amount: 12000,
    sender: "Foreign Entity",
    recipient: "Local Charity",
    riskScore: 65,
    status: "Flagged",
  },
  {
    id: "TX-7823",
    date: "2023-03-25",
    amount: 7500,
    sender: "Investment Fund",
    recipient: "Private Account",
    riskScore: 54,
    status: "Pending",
  },
  {
    id: "TX-7822",
    date: "2023-03-24",
    amount: 50000,
    sender: "Unknown Source",
    recipient: "Shell Company",
    riskScore: 98,
    status: "Blocked",
  },
  {
    id: "TX-7821",
    date: "2023-03-24",
    amount: 2750,
    sender: "Small Business",
    recipient: "Supplier Inc.",
    riskScore: 23,
    status: "Cleared",
  },
  {
    id: "TX-7820",
    date: "2023-03-23",
    amount: 15000,
    sender: "High-Risk Country Corp",
    recipient: "Local Bank",
    riskScore: 82,
    status: "Flagged",
  },
]

interface TransactionTableProps {
  limit?: number
}

export function TransactionTable({ limit }: TransactionTableProps) {
  const [sorting, setSorting] = useState<"asc" | "desc">("desc")
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const { toast } = useToast()

  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newTransaction: Transaction = {
          id: `TX-${7830 + Math.floor(Math.random() * 100)}`,
          date: new Date().toISOString().split("T")[0],
          amount: Math.floor(Math.random() * 50000) + 1000,
          sender: ["Global Corp", "International Trading", "Finance Ltd.", "Investment Group"][
            Math.floor(Math.random() * 4)
          ],
          recipient: ["Local Business", "Private Account", "Offshore Entity", "Merchant Services"][
            Math.floor(Math.random() * 4)
          ],
          riskScore: Math.floor(Math.random() * 100),
          status: ["Pending", "Cleared", "Flagged", "Blocked"][Math.floor(Math.random() * 4)] as Transaction["status"],
        }

        setTransactions((prev) => [newTransaction, ...prev.slice(0, prev.length - 1)])

        if (newTransaction.riskScore > 80) {
          toast({
            title: "High-risk transaction detected",
            description: `Transaction ${newTransaction.id} has been flagged for review`,
          })
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [toast])

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">{score}</Badge>
    if (score >= 50)
      return (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200"
        >
          {score}
        </Badge>
      )
    return (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
      >
        {score}
      </Badge>
    )
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "Flagged":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200"
          >
            {status}
          </Badge>
        )
      case "Blocked":
        return <Badge variant="destructive">{status}</Badge>
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
          >
            {status}
          </Badge>
        )
      case "Cleared":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
          >
            {status}
          </Badge>
        )
    }
  }

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleCloseTransaction = () => {
    setSelectedTransaction(null)
  }

  const handleUpdateStatus = (id: string, newStatus: Transaction["status"]) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, status: newStatus } : tx)))

    toast({
      title: "Transaction status updated",
      description: `Transaction ${id} has been marked as ${newStatus}`,
    })

    setSelectedTransaction(null)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Sender</TableHead>
              <TableHead className="hidden md:table-cell">Recipient</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 hover:bg-transparent"
                  onClick={() => setSorting(sorting === "asc" ? "desc" : "asc")}
                >
                  Risk Score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {displayedTransactions
                .sort((a, b) => (sorting === "asc" ? a.riskScore - b.riskScore : b.riskScore - a.riskScore))
                .map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, backgroundColor: "rgba(var(--primary-rgb), 0.1)" }}
                    animate={{ opacity: 1, backgroundColor: "rgba(var(--primary-rgb), 0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell">{transaction.sender}</TableCell>
                    <TableCell className="hidden md:table-cell">{transaction.recipient}</TableCell>
                    <TableCell>{getRiskBadge(transaction.riskScore)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewTransaction(transaction)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateStatus(transaction.id, "Flagged")}>
                            <Shield className="mr-2 h-4 w-4" />
                            Flag as suspicious
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(transaction.id, "Blocked")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Block transaction
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(transaction.id, "Cleared")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Clear transaction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {selectedTransaction && (
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
              <h3 className="text-lg font-semibold">Transaction Details: {selectedTransaction.id}</h3>
              <Button variant="ghost" size="icon" onClick={handleCloseTransaction}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{selectedTransaction.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p>${selectedTransaction.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sender</p>
                  <p>{selectedTransaction.sender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recipient</p>
                  <p>{selectedTransaction.recipient}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                  <div className="flex items-center">
                    {getRiskBadge(selectedTransaction.riskScore)}
                    <div className="ml-2 h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${
                          selectedTransaction.riskScore >= 80
                            ? "bg-destructive"
                            : selectedTransaction.riskScore >= 50
                              ? "bg-amber-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${selectedTransaction.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              <div className="rounded-md bg-muted p-3">
                <h4 className="font-medium">ML Analysis</h4>
                <p className="mt-1 text-sm">
                  {selectedTransaction.riskScore >= 80
                    ? "This transaction exhibits multiple high-risk indicators consistent with money laundering patterns. Immediate review recommended."
                    : selectedTransaction.riskScore >= 50
                      ? "This transaction shows some unusual patterns that may require further investigation."
                      : "This transaction appears to be routine with no significant risk indicators detected."}
                </p>
              </div>

              <div className="flex justify-between gap-2">
                <Button
                  variant={selectedTransaction.status === "Cleared" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleUpdateStatus(selectedTransaction.id, "Cleared")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  variant={selectedTransaction.status === "Flagged" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleUpdateStatus(selectedTransaction.id, "Flagged")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Flag
                </Button>
                <Button
                  variant={selectedTransaction.status === "Blocked" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleUpdateStatus(selectedTransaction.id, "Blocked")}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Block
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

function CheckCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

