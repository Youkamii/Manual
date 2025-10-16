"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SearchResult } from "@/app/actions/search"

interface SearchResultsProps {
  results: SearchResult[]
  keyword: string
}

export function SearchResults({ results, keyword }: SearchResultsProps) {
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text

    const parts = text.split(new RegExp(`(${keyword})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const getTextSnippet = (text: string, keyword: string, length = 200) => {
    const lowerText = text.toLowerCase()
    const lowerKeyword = keyword.toLowerCase()
    const index = lowerText.indexOf(lowerKeyword)

    if (index === -1) {
      return text.slice(0, length) + (text.length > length ? "..." : "")
    }

    const start = Math.max(0, index - 50)
    const end = Math.min(text.length, index + keyword.length + 150)

    let snippet = text.slice(start, end)
    if (start > 0) snippet = "..." + snippet
    if (end < text.length) snippet = snippet + "..."

    return snippet
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>검색 결과가 없습니다.</p>
        <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{results.length}개의 결과를 찾았습니다.</p>

      {results.map((result, index) => {
        const snippet = getTextSnippet(result.extractedText, keyword)

        return (
          <Link
            key={`${result.documentId}-${result.pageNumber}-${index}`}
            href={`/view/${result.documentId}?page=${result.pageNumber}`}
          >
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {result.documentTitle} - {result.pageNumber}페이지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{highlightText(snippet, keyword)}</p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
