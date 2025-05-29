import { create } from "zustand"
import { useTransactionStore } from "./transaction-store"

export interface Case {
  id: string
  date: string
  title: string
  description: string
  riskLevel: "High" | "Medium" | "Low"
  mlConfidence: number
  status: "Open" | "In Review" | "Closed" | "Escalated"
  transactionId?: string
  assignedTo?: string
}

interface CaseState {
  cases: Case[]
  addCase: (caseData: Omit<Case, "id" | "date">) => void
  updateCaseStatus: (id: string, status: Case["status"]) => void
  syncWithTransactions: () => void
  getFilteredCases: (searchQuery: string, riskFilter: string, statusFilter: string) => Case[]
}

// Initial cases
const initialCases: Case[] = []

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: initialCases,

  addCase: (caseData) => {
    const newCase: Case = {
      ...caseData,
      id: `AML-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    }

    set((state) => ({
      cases: [newCase, ...state.cases],
    }))

    // Notify user store that user has cases
    const { setHasCases } = require("./user-store").useUserStore.getState()
    setHasCases(true)
  },

  updateCaseStatus: (id, status) => {
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, status } : c)),
    }))
  },

  syncWithTransactions: () => {
    const transactions = useTransactionStore.getState().transactions
    const existingCases = get().cases
    const newCases: Case[] = []

    transactions.forEach((tx) => {
      // Create cases for high-risk or flagged transactions that don't already have cases
      if (
        (tx.riskScore >= 80 || tx.status === "Flagged" || tx.status === "Blocked") &&
        !existingCases.some((c) => c.transactionId === tx.id)
      ) {
        const riskLevel: Case["riskLevel"] = tx.riskScore >= 90 ? "High" : tx.riskScore >= 70 ? "High" : "Medium"

        newCases.push({
          id: `AML-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          date: tx.date,
          title: `Suspicious transaction: ${tx.sender} to ${tx.recipient}`,
          description: `${tx.status} transaction of $${tx.amount.toLocaleString()} from ${tx.sender} to ${tx.recipient}. ${tx.description || "No additional details."}`,
          riskLevel,
          mlConfidence: tx.riskScore,
          status: tx.status === "Blocked" ? "Escalated" : "Open",
          transactionId: tx.id,
        })
      }
    })

    if (newCases.length > 0) {
      set((state) => ({
        cases: [...newCases, ...state.cases],
      }))
    }
  },

  getFilteredCases: (searchQuery, riskFilter, statusFilter) => {
    const cases = get().cases

    return cases.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRisk = riskFilter === "all" || c.riskLevel.toLowerCase() === riskFilter.toLowerCase()
      const matchesStatus =
        statusFilter === "all" || c.status.toLowerCase().replace(" ", "-") === statusFilter.toLowerCase()

      return matchesSearch && matchesRisk && matchesStatus
    })
  },
}))
