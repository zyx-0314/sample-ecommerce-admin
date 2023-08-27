import prismadb from '@/lib/prismadb';

const getStockCount = async (storeId: string) => {
	const stockCount = await prismadb.product.findMany({
		where: {
			storeId,
			isArchived: false,
		},
	});

	const productCount = stockCount.reduce((total, product) => {
		return total + product.stock;
	}, 0);

	return productCount;
};

export default getStockCount;
