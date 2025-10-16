"use server"

import { put } from "@vercel/blob"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function uploadPDF(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const title = formData.get("title") as string

    if (!file || !title) {
      return { success: false, error: "파일과 제목이 필요합니다." }
    }

    // PDF 파일인지 확인
    if (file.type !== "application/pdf") {
      return { success: false, error: "PDF 파일만 업로드 가능합니다." }
    }

    // Vercel Blob에 업로드
    const blob = await put(file.name, file, {
      access: "public",
    })

    // DB에 메타데이터 저장
    const result = await sql`
      INSERT INTO documents (title, blob_url, file_size, page_count)
      VALUES (${title}, ${blob.url}, ${file.size}, 0)
      RETURNING id
    `

    console.log("[v0] PDF uploaded:", { id: result[0].id, title, url: blob.url })

    return {
      success: true,
      documentId: result[0].id,
      blobUrl: blob.url,
    }
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return {
      success: false,
      error: "업로드 중 오류가 발생했습니다.",
    }
  }
}
