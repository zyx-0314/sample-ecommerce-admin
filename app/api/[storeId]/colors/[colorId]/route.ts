import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { storeId: string; colorId: string } }
) {
	try {
		if (!params.storeId)
			return new NextResponse('Store Id is required', { status: 400 });
		if (!params.colorId)
			return new NextResponse('Color Id is required', { status: 400 });

		const response = await prismadb.color.findFirst({
			where: {
				id: params.colorId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[COLOR_COLORID_GET_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { storeId: string; colorId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		const body = await request.json();
		const { name, value } = body;

		if (!name) return new NextResponse('Name is required', { status: 400 });

		if (!value) return new NextResponse('Value is required', { status: 400 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });

		if (!params.colorId)
			return new NextResponse('Color Id Required', { status: 401 });

		const colorExist = await prismadb.color.findFirst({
			where: {
				id: params.colorId,
				storeId: params.storeId,
			},
		});

		if (!colorExist)
			return new NextResponse('Color not found', { status: 404 });

		const colorByStoreId = await prismadb.color.findFirst({
			where: {
				storeId: params.storeId,
			},
		});

		if (!colorByStoreId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.color.update({
			where: {
				id: params.colorId,
				storeId: params.storeId,
			},
			data: {
				name,
				value,
			},
		});

		if (!response) return new NextResponse('Color not found', { status: 404 });

		return NextResponse.json(response);
	} catch (error) {
		console.log('[COLOR_COLORID_PATCH_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { storeId: string; colorId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });
		if (!params.colorId)
			return new NextResponse('Color Id Required', { status: 401 });

		const colorExist = await prismadb.color.findFirst({
			where: {
				id: params.colorId,
				storeId: params.storeId,
			},
		});

		if (!colorExist)
			return new NextResponse('Color not found', { status: 404 });

		const colorByStoreId = await prismadb.color.findFirst({
			where: {
				storeId: params.storeId,
			},
		});

		if (!colorByStoreId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.color.deleteMany({
			where: {
				id: params.colorId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[COLOR_COLORID_DELETE_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
