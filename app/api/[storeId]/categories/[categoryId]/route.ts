import { Category } from '@prisma/client';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		if (!params.storeId)
			return new NextResponse('Store Id is required', { status: 400 });
		if (!params.categoryId)
			return new NextResponse('Category Id is required', { status: 400 });

		const response = await prismadb.category.findFirst({
			where: {
				id: params.categoryId,
			},
			include: {
				billboard: true,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[CATEGORIES_CATEGORYID_GET_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		const body = await request.json();
		const { name, billboardId } = body;
		if (!name) return new NextResponse('Name is required', { status: 400 });
		if (!billboardId)
			return new NextResponse('Billboard is required', { status: 400 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });
		if (!params.categoryId)
			return new NextResponse('Category Id Required', { status: 401 });

		const billboardExist = await prismadb.billboard.findFirst({
			where: {
				id: billboardId,
				storeId: params.storeId,
			},
		});
		const categoryExist = await prismadb.category.findFirst({
			where: {
				id: params.categoryId,
				storeId: params.storeId,
			},
		});

		if (!billboardExist)
			return new NextResponse('Billboard not found', { status: 404 });

		if (!categoryExist)
			return new NextResponse('Category not found', { status: 404 });

		const categoryByStoreId = await prismadb.category.findFirst({
			where: {
				storeId: params.storeId,
			},
		});

		if (!categoryByStoreId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.category.update({
			where: {
				id: params.categoryId,
				storeId: params.storeId,
			},
			data: {
				name,
				billboardId,
			},
		});

		if (!response)
			return new NextResponse('Billboard not found', { status: 404 });

		return NextResponse.json(response);
	} catch (error) {
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	console.log('[CATEGORIES_CATEGORYID_DELETE]', params);
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });
		if (!params.categoryId)
			return new NextResponse('Category Id Required', { status: 401 });

		const categoryExist = await prismadb.category.findFirst({
			where: {
				id: params.categoryId,
				storeId: params.storeId,
			},
		});

		if (!categoryExist)
			return new NextResponse('Category not found', { status: 404 });

		const categoryByStoreId = await prismadb.category.findFirst({
			where: {
				storeId: params.storeId,
			},
		});

		if (!categoryByStoreId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.category.deleteMany({
			where: {
				id: params.categoryId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[CATEGORIES_CATEGORYID_DELETE_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
