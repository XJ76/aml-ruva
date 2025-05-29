import type { Metadata } from 'next';

import { DashboardContent } from '@/components/dashboard-content';
import { DashboardShell } from '@/components/dashboard-shell';

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
