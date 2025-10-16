"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, CheckCircle2 } from "lucide-react"
import { savePDFMetadata } from "@/app/actions/upload"
import { extractTextFromPDF } from "@/app/actions/extract-text"

export function UploadForm() {
  const [title, setTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputFileRef.current?.files || !title) {
      setError("파일과 제목을 모두 입력해주세요.")
      return
    }

    const file = inputFileRef.current.files[0]

    if (file.type !== "application/pdf") {
      setError("PDF 파일만 업로드 가능합니다.")
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("파일 크기는 4MB를 초과할 수 없습니다. (서버 업로드 제한)")
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadSuccess(false)

    try {
      console.log("[v0] Uploading file:", file.name, "Size:", file.size)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("업로드 실패")
      }

      const { url, documentId } = await response.json()
      console.log("[v0] File uploaded to Blob:", url)

      const result = await savePDFMetadata({
        title,
        fileName: file.name, // fileName 파라미터 추가
        blobUrl: url,
        fileSize: file.size,
      })

      if (result.success) {
        console.log("[v0] Starting text extraction for document:", result.documentId)
        extractTextFromPDF(result.documentId!, url).then((extractResult) => {
          if (extractResult.success) {
            console.log("[v0] Text extraction completed:", extractResult.pagesProcessed, "pages")
          } else {
            console.error("[v0] Text extraction failed:", extractResult.error)
          }
        })

        setUploadSuccess(true)
        setTitle("")
        if (inputFileRef.current) inputFileRef.current.value = ""
      } else {
        setError(result.error || "업로드 중 오류가 발생했습니다.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.")
      console.error("[v0] Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 PDF 문서 등록</CardTitle>
        <CardDescription>PDF 파일을 선택하고 제목을 입력하세요. (최대 4MB)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">문서 제목</Label>
            <Input
              id="title"
              type="text"
              placeholder="예: 2024년 매출 보고서"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">PDF 파일</Label>
            <Input id="file" type="file" accept=".pdf" ref={inputFileRef} disabled={isUploading} />
            {inputFileRef.current?.files?.[0] && (
              <p className="text-sm text-muted-foreground">
                선택된 파일: {inputFileRef.current.files[0].name} (
                {(inputFileRef.current.files[0].size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          {uploadSuccess && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              업로드가 완료되었습니다!
            </div>
          )}

          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                업로드
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
