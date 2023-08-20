import prismadb from '@/lib/prismadb';

const getStockCount = async (storeId: string) => {
	const productCount = await prismadb.product.count({
		where: {
			storeId,
			isArchived: false,
		},
	});

	return productCount;
};

export default getStockCount;
