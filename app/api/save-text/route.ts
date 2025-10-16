import { type NextRequest, NextResponse } from "next/server"
import { savePageText } from "@/app/actions/extract-text"

export async function POST(request: NextRequest) {
  try {
    const { documentId, pages } = await request.json()

    console.log("[v0] Saving extracted text for document:", documentId)

    if (!documentId || !pages || !Array.isArray(pages)) {
      throw new Error("Invalid request data")
    }

    let pagesProcessed = 0

    // 각 페이지 텍스트를 DB에 저장
    for (const page of pages) {
      await savePageText(documentId, page.pageNumber, page.text)
      pagesProcessed++
    }

    console.log("[v0] Pages saved:", pagesProcessed)

    return NextResponse.json({
      success: true,
      pagesProcessed,
    })
  } catch (error) {
    console.error("[v0] Save text API error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
