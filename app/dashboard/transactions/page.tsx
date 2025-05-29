import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { TransactionsContent } from "@/components/transactions-content"

export const metadata: Metadata = {
  title: "Transactions - AML Shield",
  description: "Monitor and analyze transactions with ML-based risk scoring",
}

export default function TransactionsPage() {
  return (
    <DashboardShell>
      <TransactionsContent />
    </DashboardShell>
  )
}
