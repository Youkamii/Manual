import { neon } from "@neondatabase/serverless"
import { PDFViewer } from "@/components/pdf-viewer"
import { notFound } from "next/navigation"

interface ViewPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

async function getDocument(id: string) {
  const sql = neon(process.env.DATABASE_URL!)
  const result = await sql`
    SELECT id, title, file_name, blob_url, file_size, total_pages
    FROM documents
    WHERE id = ${id}
  `
  return result[0] || null
}

export default async function ViewPage({ params, searchParams }: ViewPageProps) {
  const { id } = await params
  const { page } = await searchParams
  const document = await getDocument(id)

  if (!document) {
    notFound()
  }

  const initialPage = page ? Number.parseInt(page, 10) : 1

  return (
    <main className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{document.title}</h1>
        <p className="text-muted-foreground">
          {document.file_name} • {document.total_pages}페이지
        </p>
      </div>

      <PDFViewer url={document.blob_url} initialPage={initialPage} />
    </main>
  )
}
