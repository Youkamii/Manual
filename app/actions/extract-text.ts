"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function extractTextFromPDF(documentId: number, pdfUrl: string) {
  try {
    console.log("[v0] Starting text extraction for document:", documentId)

    // PDF.js를 사용하여 텍스트 추출
    // 클라이언트에서 실행되어야 하므로 별도 API Route 필요
    const response = await fetch("/api/extract-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, pdfUrl }),
    })

    if (!response.ok) {
      throw new Error("Text extraction failed")
    }

    const result = await response.json()
    console.log("[v0] Text extraction completed:", result)

    return { success: true, pagesProcessed: result.pagesProcessed }
  } catch (error) {
    console.error("[v0] Text extraction error:", error)
    return { success: false, error: String(error) }
  }
}

export async function savePageText(documentId: number, pageNumber: number, extractedText: string) {
  try {
    await sql`
      INSERT INTO document_pages (document_id, page_number, extracted_text)
      VALUES (${documentId}, ${pageNumber}, ${extractedText})
      ON CONFLICT (document_id, page_number) 
      DO UPDATE SET extracted_text = ${extractedText}
    `
    return { success: true }
  } catch (error) {
    console.error("[v0] Save page text error:", error)
    return { success: false, error: String(error) }
  }
}
