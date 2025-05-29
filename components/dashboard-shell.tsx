"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  Home,
  Loader2,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useTransactionStore } from "@/lib/store/transaction-store"
import { useCaseStore } from "@/lib/store/case-store"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface SearchResult {
  id: string
  title: string
  type: "transaction" | "case" | "user"
  href: string
  description?: string
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Case Management",
    href: "/dashboard/cases",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: <FileText className="h-5 w-5" />,
  },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState(4)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()

  const { transactions } = useTransactionStore()
  const { cases } = useCaseStore()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 1) {
      // Changed from 2 to 1 for faster search
      setIsSearching(true)

      // Reduced search delay for better UX
      const searchTimer = setTimeout(() => {
        const results: SearchResult[] = []

        // Search transactions with better matching
        transactions.forEach((tx) => {
          const searchLower = searchQuery.toLowerCase()
          if (
            tx.id.toLowerCase().includes(searchLower) ||
            tx.sender.toLowerCase().includes(searchLower) ||
            tx.recipient.toLowerCase().includes(searchLower) ||
            (tx.description && tx.description.toLowerCase().includes(searchLower)) ||
            tx.amount.toString().includes(searchQuery) ||
            tx.status.toLowerCase().includes(searchLower)
          ) {
            results.push({
              id: tx.id,
              title: `Transaction ${tx.id}`,
              type: "transaction",
              href: "/dashboard/transactions",
              description: `$${tx.amount.toLocaleString()} from ${tx.sender} to ${tx.recipient} (${tx.status})`,
            })
          }
        })

        // Search cases with better matching
        cases.forEach((c) => {
          const searchLower = searchQuery.toLowerCase()
          if (
            c.id.toLowerCase().includes(searchLower) ||
            c.title.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower) ||
            c.riskLevel.toLowerCase().includes(searchLower) ||
            c.status.toLowerCase().includes(searchLower)
          ) {
            results.push({
              id: c.id,
              title: `Case ${c.id}`,
              type: "case",
              href: "/dashboard/cases",
              description: `${c.riskLevel} Risk - ${c.status} - ${c.title}`,
            })
          }
        })

        setSearchResults(results.slice(0, 8)) // Increased to 8 results
        setIsSearching(false)
        setShowSearchResults(true)
      }, 200) // Reduced delay from 300ms to 200ms

      return () => clearTimeout(searchTimer)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
      setIsSearching(false)
    }
  }, [searchQuery, transactions, cases])

  const handleNotificationClick = () => {
    toast({
      title: "New alerts",
      description: "You have 4 new suspicious activity alerts to review",
    })
    setNotifications(0)
  }

  const handleSearchResultClick = (href: string) => {
    setSearchQuery("")
    setShowSearchResults(false)
    // Navigate to the result
    window.location.href = href
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:max-w-xs">
            <div className="flex items-center gap-2 pb-4 pt-2">
              <Shield className="h-6 w-6" />
              <span className="font-semibold">AML Shield</span>
            </div>
            <nav className="grid gap-2 py-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold md:hidden">
          <Shield className="h-6 w-6" />
          <span>AML Shield</span>
        </Link>
        <div className="hidden md:flex">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6" />
            <span>AML Shield</span>
          </Link>
          <nav className="ml-8 flex items-center gap-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions, cases..."
              className="w-64 rounded-lg bg-background pl-8 md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            />
            {isSearching && (
              <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-1 w-full rounded-md border bg-popover p-2 shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Search Results</span>
                    <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => setShowSearchResults(false)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.href}
                      onClick={() => handleSearchResultClick(result.href)}
                      className="block rounded-sm p-2 hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        {result.type === "transaction" ? (
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{result.title}</p>
                          {result.description && (
                            <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="p-2 text-center text-sm text-muted-foreground">No results found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <ThemeToggle />
          <Button variant="outline" size="icon" className="relative" onClick={handleNotificationClick}>
            <Bell className="h-4 w-4" />
            <AnimatePresence>
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
                >
                  {notifications}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-1 items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
