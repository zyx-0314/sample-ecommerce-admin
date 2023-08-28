import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sample CMS Online Store - Color Form',
}

export default function RootLayout ( {
  children,
}: {
  children: React.ReactNode
} )
{
  return (
    <>
      { children }
    </>
  )
}
