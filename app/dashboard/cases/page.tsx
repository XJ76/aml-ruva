import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { CasesContent } from "@/components/cases-content"

export const metadata: Metadata = {
  title: "Case Management - AML Shield",
  description: "Review and manage flagged transactions and suspicious activities",
}

export default function CasesPage() {
  return (
    <DashboardShell>
      <CasesContent />
    </DashboardShell>
  )
}
