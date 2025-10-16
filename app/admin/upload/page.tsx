import { UploadForm } from "@/components/upload-form"

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">PDF 업로드</h1>
      <p className="text-muted-foreground mb-8">
        PDF 파일을 업로드하면 자동으로 텍스트를 추출하여 검색 가능하게 만듭니다.
      </p>
      <UploadForm />
    </div>
  )
}
