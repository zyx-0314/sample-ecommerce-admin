import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
	request: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
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

		if (!price) return new NextResponse('Value is required', { status: 400 });

		if (!categoryId)
			return new NextResponse('Category is required', { status: 400 });

		if (!sizeId) return new NextResponse('Size is required', { status: 400 });

		if (!colorId) return new NextResponse('Color is required', { status: 400 });

		if (!params.storeId)
			return new NextResponse('Store Id is required', { status: 400 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.product.create({
			data: {
				storeId: params.storeId,
				name,
				price,
				categoryId,
				sizeId,
				colorId,
				isArchived,
				isFeatured,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[PRODUCT_POST_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId)
			return new NextResponse('Store Id is required', { status: 400 });

		const response = await prismadb.color.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[PRODUCT_GET_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
