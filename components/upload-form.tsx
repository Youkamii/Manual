"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadPDF } from "@/app/actions/upload"
import { Loader2, Upload, CheckCircle2 } from "lucide-react"

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !title) {
      setError("파일과 제목을 모두 입력해주세요.")
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)

      const result = await uploadPDF(formData)

      if (result.success) {
        setUploadSuccess(true)
        setFile(null)
        setTitle("")
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setError(result.error || "업로드 중 오류가 발생했습니다.")
      }
    } catch (err) {
      setError("업로드 중 오류가 발생했습니다.")
      console.error("[v0] Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 PDF 문서 등록</CardTitle>
        <CardDescription>PDF 파일을 선택하고 제목을 입력하세요.</CardDescription>
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
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
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
