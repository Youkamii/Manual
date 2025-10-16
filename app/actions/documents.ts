"use server"

import { neon } from "@neondatabase/serverless"
import { del } from "@vercel/blob"

const sql = neon(process.env.DATABASE_URL!)

export async function getDocuments() {
  try {
    const documents = await sql`
      SELECT 
        id,
        title,
        file_name,
        file_size,
        total_pages,
        blob_url,
        created_at
      FROM documents
      ORDER BY created_at DESC
    `

    return { success: true, documents }
  } catch (error) {
    console.error("[v0] Get documents error:", error)
    return { success: false, error: "문서 목록을 불러오는데 실패했습니다." }
  }
}

export async function deleteDocument(id: number) {
  try {
    console.log("[v0] Deleting document:", id)

    // 문서 정보 조회
    const [document] = await sql`
      SELECT blob_url FROM documents WHERE id = ${id}
    `

    if (!document) {
      return { success: false, error: "문서를 찾을 수 없습니다." }
    }

    // Blob에서 파일 삭제
    await del(document.blob_url)
    console.log("[v0] Blob deleted:", document.blob_url)

    // DB에서 관련 페이지 데이터 삭제
    await sql`DELETE FROM document_pages WHERE document_id = ${id}`

    // DB에서 문서 삭제
    await sql`DELETE FROM documents WHERE id = ${id}`

    console.log("[v0] Document deleted from DB:", id)

    return { success: true }
  } catch (error) {
    console.error("[v0] Delete document error:", error)
    return { success: false, error: "문서 삭제에 실패했습니다." }
  }
}

export async function getDocumentPages(documentId: number) {
  try {
    const pages = await sql`
      SELECT 
        page_number,
        extracted_text
      FROM document_pages
      WHERE document_id = ${documentId}
      ORDER BY page_number ASC
    `

    const [document] = await sql`
      SELECT title FROM documents WHERE id = ${documentId}
    `

    return { success: true, pages, documentTitle: document?.title }
  } catch (error) {
    console.error("[v0] Get document pages error:", error)
    return { success: false, error: "페이지 데이터를 불러오는데 실패했습니다." }
  }
}
