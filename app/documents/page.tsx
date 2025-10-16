import { getDocuments } from "@/app/actions/documents"
import { DocumentList } from "@/components/document-list"

export default async function DocumentsPage() {
  const result = await getDocuments()

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">업로드된 문서</h1>
        <p className="mb-8 text-muted-foreground">업로드된 PDF 문서 목록입니다.</p>

        {result.success ? (
          <DocumentList documents={result.documents} />
        ) : (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            {result.error}
          </div>
        )}
      </div>
    </main>
  )
}
