import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }

    console.log("[v0] Uploading file to Blob:", file.name, "Size:", file.size)

    // Vercel Blob에 업로드
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    console.log("[v0] Blob upload successful:", blob.url)

    return NextResponse.json({ url: blob.url, size: file.size })
  } catch (error) {
    console.error("[v0] Upload API error:", error)
    return NextResponse.json({ error: "업로드 중 오류가 발생했습니다." }, { status: 500 })
  }
}
