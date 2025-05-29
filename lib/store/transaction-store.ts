import { create } from "zustand"

export interface Transaction {
  id: string
  date: string
  amount: number
  sender: string
  recipient: string
  riskScore: number
  status: "Pending" | "Cleared" | "Flagged" | "Blocked"
  description?: string
}

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "riskScore" | "status">) => void
  updateTransactionStatus: (id: string, status: Transaction["status"]) => void
  getHighRiskTransactions: () => Transaction[]
  getFlaggedTransactions: () => Transaction[]
}

// Initial transactions
const initialTransactions: Transaction[] = []

// ML Analysis simulation
const analyzeTransaction = (
  transaction: Omit<Transaction, "id" | "date" | "riskScore" | "status">,
): { riskScore: number; status: Transaction["status"] } => {
  let riskScore = 0

  // Amount-based risk
  if (transaction.amount > 50000) riskScore += 30
  else if (transaction.amount > 20000) riskScore += 20
  else if (transaction.amount > 10000) riskScore += 10

  // Sender/recipient risk patterns
  const highRiskKeywords = ["offshore", "anonymous", "cash", "shell", "unknown"]
  const mediumRiskKeywords = ["trading", "holdings", "international", "foreign"]

  const senderLower = transaction.sender.toLowerCase()
  const recipientLower = transaction.recipient.toLowerCase()

  highRiskKeywords.forEach((keyword) => {
    if (senderLower.includes(keyword) || recipientLower.includes(keyword)) {
      riskScore += 25
    }
  })

  mediumRiskKeywords.forEach((keyword) => {
    if (senderLower.includes(keyword) || recipientLower.includes(keyword)) {
      riskScore += 15
    }
  })

  // Structured transaction detection (amounts just below thresholds)
  if (transaction.amount === 9999 || transaction.amount === 4999) {
    riskScore += 35
  }

  // Add some randomness to simulate ML uncertainty
  riskScore += Math.floor(Math.random() * 10) - 5
  riskScore = Math.max(0, Math.min(100, riskScore))

  // Determine status based on risk score
  let status: Transaction["status"]
  if (riskScore >= 90) status = "Blocked"
  else if (riskScore >= 70) status = "Flagged"
  else if (riskScore >= 50) status = "Pending"
  else status = "Cleared"

  return { riskScore, status }
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: initialTransactions,

  addTransaction: (transactionData) => {
    const analysis = analyzeTransaction(transactionData)
    const newTransaction: Transaction = {
      ...transactionData,
      id: `TX-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      riskScore: analysis.riskScore,
      status: analysis.status,
    }

    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }))

    // Notify user store that user has transactions
    const { setHasTransactions } = require("./user-store").useUserStore.getState()
    setHasTransactions(true)
  },

  updateTransactionStatus: (id, status) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => (tx.id === id ? { ...tx, status } : tx)),
    }))
  },

  getHighRiskTransactions: () => {
    return get().transactions.filter((tx) => tx.riskScore >= 80)
  },

  getFlaggedTransactions: () => {
    return get().transactions.filter((tx) => tx.status === "Flagged" || tx.status === "Blocked")
  },
}))
