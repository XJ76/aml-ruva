import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "AML Compliance Dashboard",
  description: "Machine Learning-Enhanced Anti-Money Laundering Compliance System",
}

export default function Page() {
  // In a real app, this would check the auth state from a server component
  // For demo purposes, we'll redirect to the login page
  redirect("/login")
}

