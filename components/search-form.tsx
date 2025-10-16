"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchDocuments, type SearchResult } from "@/app/actions/search"
import { SearchResults } from "./search-results"

export function SearchForm() {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!keyword.trim()) {
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      const searchResults = await searchDocuments(keyword)
      setResults(searchResults)
    } catch (error) {
      console.error("[v0] Search error:", error)
      alert("검색 중 오류가 발생했습니다.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="검색할 키워드를 입력하세요..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          <Search className="w-4 h-4 mr-2" />
          {isSearching ? "검색 중..." : "검색"}
        </Button>
      </form>

      {hasSearched && <SearchResults results={results} keyword={keyword} />}
    </div>
  )
}
