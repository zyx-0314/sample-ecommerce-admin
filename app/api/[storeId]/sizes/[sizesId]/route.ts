import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { storeId: string; sizesId: string } }
) {
	try {
		if (!params.storeId)
			return new NextResponse('Store Id is required', { status: 400 });
		if (!params.sizesId)
			return new NextResponse('Size Id is required', { status: 400 });

		const response = await prismadb.size.findFirst({
			where: {
				id: params.sizesId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[SIZE_SIZEID_GET_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { storeId: string; sizesId: string } }
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

		if (!params.sizesId)
			return new NextResponse('Size Id Required', { status: 401 });

		const sizeExist = await prismadb.size.findFirst({
			where: {
				id: params.sizesId,
				storeId: params.storeId,
			},
		});

		if (!sizeExist) return new NextResponse('Size not found', { status: 404 });

		const sizeByStoreId = await prismadb.size.findFirst({
			where: {
				storeId: params.storeId,
			},
		});

		if (!sizeByStoreId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.size.update({
			where: {
				id: params.sizesId,
				storeId: params.storeId,
			},
			data: {
				name,
				value,
			},
		});

		if (!response) return new NextResponse('Size not found', { status: 404 });

		return NextResponse.json(response);
	} catch (error) {
		console.log('[SIZE_SIZEID_PATCH_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { storeId: string; sizesId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });
		if (!params.sizesId)
			return new NextResponse('Size Id Required', { status: 401 });

		const sizeExist = await prismadb.size.findFirst({
			where: {
				id: params.sizesId,
				storeId: params.storeId,
			},
		});

		if (!sizeExist) return new NextResponse('Size not found', { status: 404 });

		const sizeByStoreId = await prismadb.size.findFirst({
			where: {
				storeId: params.storeId,
			},
		});

		if (!sizeByStoreId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.size.deleteMany({
			where: {
				id: params.sizesId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[SIZE_SIZEID_DELETE_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
