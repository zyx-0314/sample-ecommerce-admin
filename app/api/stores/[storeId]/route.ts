import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(
	request: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		const body = await request.json();
		const { name } = body;
		if (!name) return new NextResponse('Name is required', { status: 400 });

		const duplicatedStoreName = await prismadb.store.findFirst({
			where: {
				name,
			},
		});

		if (duplicatedStoreName)
			return new NextResponse('Name is already taken', { status: 400 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });

		const store = await prismadb.store.update({
			where: {
				id: params.storeId,
				userId,
			},
			data: {
				name,
			},
		});

		if (!store) return new NextResponse('Store not found', { status: 404 });

		return NextResponse.json(store);
	} catch (error) {
		console.log('[STORES_STOREID_PATCH_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!params.storeId)
			return new NextResponse('Store Id Required', { status: 401 });

		const store = await prismadb.store.deleteMany({
			where: {
				id: params.storeId,
				userId,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log('[STORES_STOREID_DELETE_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
