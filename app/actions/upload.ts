"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function savePDFMetadata({
  title,
  fileName,
  blobUrl,
  fileSize,
}: {
  title: string
  fileName: string
  blobUrl: string
  fileSize: number
}) {
  try {
    const result = await sql`
      INSERT INTO documents (title, file_name, blob_url, file_size, total_pages)
      VALUES (${title}, ${fileName}, ${blobUrl}, ${fileSize}, 0)
      RETURNING id
    `

    console.log("[v0] PDF metadata saved:", { id: result[0].id, title, url: blobUrl })

    return {
      success: true,
      documentId: result[0].id,
    }
  } catch (error) {
    console.error("[v0] Save metadata error:", error)
    return {
      success: false,
      error: "메타데이터 저장 중 오류가 발생했습니다.",
    }
  }
}
