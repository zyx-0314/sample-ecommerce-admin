import getGraphRevenue from "@/actions/get-graph-revenue";
import getSalesCount from "@/actions/get-sales-count";
import getStockCount from "@/actions/get-stock-count";
import getTotalRevenue from "@/actions/get-total-revenue";
import Overview from "@/components/non-reusable/dashboard/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { CandlestickChart, Coins, Layers } from "lucide-react";

interface DashboardPageProps
{
  params: {
    storeId: string
  }
}

export default async function DashboardPage ( {
  params: { storeId },
}: DashboardPageProps )
{
  const totalRevenue = await getTotalRevenue( storeId )
  const totalSales = await getSalesCount( storeId )
  const totalProductsInStock = await getStockCount( storeId )
  const graphRevenue = await getGraphRevenue( storeId )

  const iconClassNameFormat = 'h-6 w-6 text-muted-foreground'

  const displayCardsData = [
    {
      title: 'Total Revenue',
      value: formatter.format( totalRevenue ),
      icon: <Coins className={ iconClassNameFormat } />
    },
    {
      title: 'Sales',
      value: totalSales,
      icon: <CandlestickChart className={ iconClassNameFormat } />
    },
    {
      title: 'Products in Stock',
      value: totalProductsInStock,
      icon: <Layers className={ iconClassNameFormat } />
    },
  ]

  return (
    <div>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading
            title="Dashboard"
            description="Overview of your store"
          />
          <Separator />
          <div className="grid gap-4 grid-cols-3">
            { displayCardsData.map( ( { title, value, icon }, index ) => (
              <Card key={ index }>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    { title }
                  </CardTitle>
                  { icon }
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    { value }
                  </div>
                </CardContent>
              </Card>
            ) )
            }
          </div>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                overview
              </CardTitle>

            </CardHeader>
            <CardContent>
              <Overview data={ graphRevenue } />
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  )
}
