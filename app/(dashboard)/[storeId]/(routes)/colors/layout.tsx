import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sample CMS Online Store - Colors List',
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
