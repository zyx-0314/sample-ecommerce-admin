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
		const { name, value } = body;

		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!name) return new NextResponse('Name is required', { status: 400 });

		if (!value) return new NextResponse('Value is required', { status: 400 });

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

		const response = await prismadb.color.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[COLOR_POST_ERROR]', error);
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
		console.log('[COLOR_GET_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
