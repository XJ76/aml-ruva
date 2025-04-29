import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { ReportsContent } from "@/components/reports-content"

export const metadata: Metadata = {
  title: "Reports - AML Shield",
  description: "Generate and view regulatory compliance reports",
}

export default function ReportsPage() {
  return (
    <DashboardShell>
      <ReportsContent />
    </DashboardShell>
  )
}

