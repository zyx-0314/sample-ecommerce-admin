import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { OrderColumn } from "@/components/non-reusable/order/columns";
import { OrderView } from "@/components/non-reusable/order/order-view";

export default async function OrderPage (
  { params: { storeId } }: { params: { storeId: string } }
)
{
  const orders = await prismadb.order.findMany( {
    where: { storeId: storeId },
    include: {
      orderItems: {
        include: { product: true },
      }
    },
    orderBy: { createdAt: "desc" },
  } );

  const formattedOrders: OrderColumn[] = orders.map( ( order ) => ( {
    id: order.id,
    phone: order.phone,
    address: order.address,
    isPaid: order.isPaid,
    products: order.orderItems.map( ( orderItem ) => orderItem.product.name ).join( ", " ),
    totalPrice: formatter.format( order.orderItems.reduce( ( total, item ) =>
    {
      return total + Number( item.product.price ) * Number( item.quantity )
    }, 0 ) ),
    createdAt: format( order.createdAt, "MMMM do, yyyy" ),
    updatedAt: format( order.updatedAt, "MMMM do, yyyy" ),
  } ) );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderView data={ formattedOrders } />
      </div>
    </div>
  )
}
