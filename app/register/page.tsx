import type { Metadata } from "next"
import Link from "next/link"
import { Shield } from "lucide-react"

import { RegisterForm } from "@/components/register-form"

export const metadata: Metadata = {
  title: "Register - AML Shield",
  description: "Create a new AML Shield account",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">AML Shield</h1>
          <p className="text-muted-foreground">Create an account to access the ML-powered AML compliance dashboard</p>
        </div>
        <RegisterForm />
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

