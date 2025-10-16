import { put } from "@vercel/blob"

async function testBlobUpload() {
  try {
    console.log("[v0] Blob 업로드 테스트 시작...")
    console.log("[v0] BLOB_READ_WRITE_TOKEN 존재 여부:", !!process.env.BLOB_READ_WRITE_TOKEN)

    // 테스트용 텍스트 파일 생성
    const testContent = "Blob 연동 테스트 - " + new Date().toISOString()
    const blob = new Blob([testContent], { type: "text/plain" })

    // Blob에 업로드
    const result = await put("test-file.txt", blob, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log("[v0] ✅ 업로드 성공!")
    console.log("[v0] 파일 URL:", result.url)
    console.log("[v0] 파일 크기:", result.size, "bytes")

    return result
  } catch (error) {
    console.error("[v0] ❌ 업로드 실패:", error)
    throw error
  }
}

testBlobUpload()
