"use client"

import { useState } from "react"

export function useAIGenerate() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generateDraft(params: {
    topic: string
    pillar: string
    postType: string
    hookPattern: string
  }) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to generate draft")
      }

      const data = await response.json()
      return data.draft as string
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { generateDraft, isLoading, error }
}
