import { create } from "zustand"

interface useFilterProductsProps
{
  category: string[]
  size: string[]
  color: string[]
}

export const useFilterProduct = create<useFilterProductsProps>( ( set ) => ( {
  category: [ "All" ],
  size: [ "All" ],
  color: [ "All" ],
} ) )