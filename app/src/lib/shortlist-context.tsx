"use client"

import * as React from "react"

interface ShortlistContextType {
  shortlist: string[] // advisor IDs
  addToShortlist: (id: string) => void
  removeFromShortlist: (id: string) => void
  isInShortlist: (id: string) => boolean
  clearShortlist: () => void
  isHydrated: boolean
}

const ShortlistContext = React.createContext<ShortlistContextType | null>(null)

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [shortlist, setShortlist] = React.useState<string[]>([])
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("advisor-shortlist")
    if (stored) {
      try {
        setShortlist(JSON.parse(stored))
      } catch {
        // Invalid JSON, ignore
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage on change
  React.useEffect(() => {
    localStorage.setItem("advisor-shortlist", JSON.stringify(shortlist))
  }, [shortlist])

  const addToShortlist = React.useCallback((id: string) => {
    setShortlist(prev => prev.includes(id) ? prev : [...prev, id].slice(0, 5)) // Max 5
  }, [])

  const removeFromShortlist = React.useCallback((id: string) => {
    setShortlist(prev => prev.filter(x => x !== id))
  }, [])

  const isInShortlist = React.useCallback((id: string) => shortlist.includes(id), [shortlist])

  const clearShortlist = React.useCallback(() => setShortlist([]), [])

  const value = React.useMemo(
    () => ({ shortlist, addToShortlist, removeFromShortlist, isInShortlist, clearShortlist, isHydrated }),
    [shortlist, addToShortlist, removeFromShortlist, isInShortlist, clearShortlist, isHydrated]
  )

  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  )
}

export const useShortlist = () => {
  const context = React.useContext(ShortlistContext)
  if (!context) throw new Error("useShortlist must be used within ShortlistProvider")
  return context
}
