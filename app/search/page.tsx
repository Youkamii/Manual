import { SearchForm } from "@/components/search-form"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">PDF 문서 검색</h1>
          <p className="text-muted-foreground">업로드된 PDF 문서에서 키워드를 검색하세요</p>
        </div>

        <SearchForm />
      </div>
    </div>
  )
}
