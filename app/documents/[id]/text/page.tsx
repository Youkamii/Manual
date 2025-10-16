import { getDocumentPages } from "@/app/actions/documents"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function DocumentTextPage({
  params,
}: {
  params: { id: string }
}) {
  const documentId = Number.parseInt(params.id)
  const result = await getDocumentPages(documentId)

  if (!result.success || !result.pages) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/documents">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{result.documentTitle}</h1>
          <p className="text-sm text-muted-foreground">추출된 텍스트 ({result.pages.length}페이지)</p>
        </div>
      </div>

      <div className="space-y-6">
        {result.pages.map((page) => (
          <div key={page.page_number} className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">페이지 {page.page_number}</h2>
              <span className="text-sm text-muted-foreground">{page.extracted_text?.length || 0}자</span>
            </div>
            <div className="text-sm whitespace-pre-wrap bg-muted p-4 rounded">
              {page.extracted_text || "텍스트가 없습니다."}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
