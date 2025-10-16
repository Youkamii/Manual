"use client"

import type React from "react"

import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { FileText, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { deleteDocument } from "@/app/actions/documents"
import { Button } from "@/components/ui/button"

interface Document {
  id: number
  title: string
  file_name: string
  file_size: number
  total_pages: number | null
  blob_url: string
  created_at: string
}

interface DocumentListProps {
  documents: Document[]
}

export function DocumentList({ documents }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault() // Link 클릭 방지

    if (!confirm("정말 이 문서를 삭제하시겠습니까?")) {
      return
    }

    setDeletingId(id)
    const result = await deleteDocument(id)

    if (result.success) {
      window.location.reload() // 목록 새로고침
    } else {
      alert(result.error)
      setDeletingId(null)
    }
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">업로드된 문서가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Link key={doc.id} href={`/view/${doc.id}`}>
          <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{doc.title}</h3>
                <p className="text-sm text-muted-foreground">{doc.file_name}</p>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  {doc.total_pages && <span>{doc.total_pages}페이지</span>}
                  <span>
                    {formatDistanceToNow(new Date(doc.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDelete(e, doc.id)}
                disabled={deletingId === doc.id}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
