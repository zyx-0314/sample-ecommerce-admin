import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { storeId: string; billboardsId: string } }
) {
	try {
		if (!params.storeId)
			return new NextResponse('Store Id is required', { status: 400 });
		if (!params.billboardsId)
			return new NextResponse('Billboard Id is required', { status: 400 });

		const response = await prismadb.billboard.findFirst({
			where: {
				id: params.billboardsId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[BILLBOARDS_BILLBOARDSID_GET_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { storeId: string; billboardsId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		const body = await request.json();
		const { label, imageUrl } = body;
		if (!label) return new NextResponse('Label is required', { status: 400 });
		if (!imageUrl)
			return new NextResponse('Image is required', { status: 400 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });
		if (!params.billboardsId)
			return new NextResponse('Billboard Id Required', { status: 401 });

		const billboardExist = await prismadb.billboard.findFirst({
			where: {
				id: params.billboardsId,
				storeId: params.storeId,
			},
		});

		if (!billboardExist)
			return new NextResponse('Billboard not found', { status: 404 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.billboard.update({
			where: {
				id: params.billboardsId,
				storeId: params.storeId,
			},
			data: {
				label,
				imageUrl,
			},
		});

		if (!response)
			return new NextResponse('Billboard not found', { status: 404 });

		return NextResponse.json(response);
	} catch (error) {
		console.log('[BILLBOARDS_BILLBOARDSID_PATCH_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { storeId: string; billboardsId: string } }
) {
	console.log('[BILLBOARDS_BILLBOARDSID_DELETE]', params);
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });
		if (!params.billboardsId)
			return new NextResponse('Billboard Id Required', { status: 401 });

		const billboardExist = await prismadb.billboard.findFirst({
			where: {
				id: params.billboardsId,
				storeId: params.storeId,
			},
		});

		if (!billboardExist)
			return new NextResponse('Billboard not found', { status: 404 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const response = await prismadb.billboard.deleteMany({
			where: {
				id: params.billboardsId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[BILLBOARDS_BILLBOARDSID_DELETE_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
