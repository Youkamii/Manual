import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">PDF 검색 서비스</h1>
          <p className="text-xl text-muted-foreground">
            PDF 문서를 업로드하고 키워드로 검색하여 원하는 페이지를 빠르게 찾으세요
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/search">🔍 문서 검색</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/admin/upload">📤 문서 업로드</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/documents">📄 문서 목록</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="font-semibold mb-2">1. 업로드</h3>
            <p className="text-sm text-muted-foreground">PDF 문서를 업로드하면 자동으로 텍스트를 추출합니다</p>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold mb-2">2. 검색</h3>
            <p className="text-sm text-muted-foreground">키워드를 입력하여 관련 페이지를 찾습니다</p>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="font-semibold mb-2">3. 확인</h3>
            <p className="text-sm text-muted-foreground">검색 결과를 클릭하여 해당 페이지를 바로 확인합니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}
