import { RichText } from '@payloadcms/richtext-lexical/react'

type LexicalData = React.ComponentProps<typeof RichText>['data']

/**
 * Render nội dung rich text (Lexical) từ Payload thành HTML.
 * Cô lập việc ép kiểu ở một chỗ vì type generated lỏng hơn type của RichText.
 */
export function RichTextBlock({
  data,
  className,
}: {
  data?: unknown
  className?: string
}) {
  if (!data || typeof data !== 'object') return null
  return (
    <RichText
      data={data as LexicalData}
      className={className}
      disableIndent
      disableTextAlign
    />
  )
}
