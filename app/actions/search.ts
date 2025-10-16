"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface SearchResult {
  documentId: number
  documentTitle: string
  pageNumber: number
  extractedText: string
  blobUrl: string
}

export async function searchDocuments(keyword: string): Promise<SearchResult[]> {
  if (!keyword || keyword.trim().length === 0) {
    return []
  }

  try {
    const results = await sql`
      SELECT 
        d.id as document_id,
        d.title as document_title,
        dp.page_number,
        dp.extracted_text,
        d.blob_url
      FROM document_pages dp
      JOIN documents d ON dp.document_id = d.id
      WHERE dp.extracted_text ILIKE ${"%" + keyword + "%"}
      ORDER BY d.id, dp.page_number
      LIMIT 50
    `

    return results.map((row: any) => ({
      documentId: row.document_id,
      documentTitle: row.document_title,
      pageNumber: row.page_number,
      extractedText: row.extracted_text,
      blobUrl: row.blob_url,
    }))
  } catch (error) {
    console.error("[v0] Search error:", error)
    throw new Error("검색 중 오류가 발생했습니다.")
  }
}
