import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		if (!params.storeId)
			return new NextResponse('Store Id is required', { status: 400 });
		if (!params.productId)
			return new NextResponse('Product Id is required', { status: 400 });

		const response = await prismadb.product.findFirst({
			where: {
				id: params.productId,
			},
			include: {
				images: true,
				category: true,
				size: true,
				color: true,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[PRODUCTS_PRODUCTSID_GET_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		const body = await request.json();

		const {
			name,
			images,
			price,
			categoryId,
			sizeId,
			colorId,
			isArchived,
			isFeatured,
		} = body;

		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!name) return new NextResponse('Name is required', { status: 400 });

		if (!images || !images.length) {
			return new NextResponse('Image/s is required', { status: 400 });
		}

		if (!price) return new NextResponse('Price is required', { status: 400 });

		if (!categoryId)
			return new NextResponse('Category is required', { status: 400 });

		if (!sizeId) return new NextResponse('Size is required', { status: 400 });

		if (!colorId) return new NextResponse('Color is required', { status: 400 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });
		if (!params.productId)
			return new NextResponse('Produtc Id Required', { status: 401 });

		const productExist = await prismadb.product.findFirst({
			where: {
				id: params.productId,
				storeId: params.storeId,
			},
		});

		if (!productExist)
			return new NextResponse('Produtc not found', { status: 404 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.product.update({
			where: {
				id: params.productId,
				storeId: params.storeId,
			},
			data: {
				name,
				price,
				categoryId,
				sizeId,
				colorId,
				isArchived,
				isFeatured,
				images: {
					deleteMany: {},
				},
			},
		});

		const imagesResponse = await prismadb.product.update({
			where: {
				id: params.productId,
				storeId: params.storeId,
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: string) => image)],
					},
				},
			},
		});

		if (!response)
			return new NextResponse('Product not found', { status: 404 });
		if (!imagesResponse)
			return new NextResponse('Product not found', { status: 404 });

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		console.log('[PRODUCTS_PRODUCTID_PATCH_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	console.log('[PRODUCTS_PRODUCTID_DELETE]', params);
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });
		if (!params.productId)
			return new NextResponse('Product Id Required', { status: 401 });

		const productExist = await prismadb.product.findFirst({
			where: {
				id: params.productId,
				storeId: params.storeId,
			},
		});

		if (!productExist)
			return new NextResponse('Product not found', { status: 404 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.product.deleteMany({
			where: {
				id: params.productId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[PRODUCTS_PRODUCTID_DELETE_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
