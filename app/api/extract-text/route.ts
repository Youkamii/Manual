import { type NextRequest, NextResponse } from "next/server"
import { savePageText } from "@/app/actions/extract-text"

export async function POST(request: NextRequest) {
  try {
    const { documentId, blobUrl } = await request.json()

    console.log("[v0] Extracting text from PDF:", blobUrl)

    if (!blobUrl) {
      throw new Error("PDF URL is required")
    }

    // PDF 파일 다운로드
    const response = await fetch(blobUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()

    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs")

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    })

    const pdfDocument = await loadingTask.promise
    const numPages = pdfDocument.numPages

    console.log("[v0] Total pages:", numPages)

    let pagesProcessed = 0

    // 각 페이지에서 텍스트 추출
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum)
      const textContent = await page.getTextContent()

      // 텍스트 아이템들을 하나의 문자열로 결합
      const pageText = textContent.items.map((item: any) => item.str).join(" ")

      if (pageText.trim()) {
        await savePageText(documentId, pageNum, pageText)
        pagesProcessed++
      }
    }

    console.log("[v0] Pages processed:", pagesProcessed)

    return NextResponse.json({
      success: true,
      pagesProcessed,
    })
  } catch (error) {
    console.error("[v0] Extract text API error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
