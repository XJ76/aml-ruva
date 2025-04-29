import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardContent } from "@/components/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard - AML Shield",
  description: "Machine Learning-Enhanced Anti-Money Laundering Compliance System",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardContent />
    </DashboardShell>
  )
}

