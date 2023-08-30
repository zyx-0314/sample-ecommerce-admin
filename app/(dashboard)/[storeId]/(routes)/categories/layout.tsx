import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sample CMS Online Store - Categories List',
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
