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
		const { label, imageUrl } = body;

		if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

		if (!label) return new NextResponse('Label is required', { status: 400 });
		if (!imageUrl)
			return new NextResponse('Image is required', { status: 400 });
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

		const response = await prismadb.billboard.create({
			data: {
				label,
				imageUrl,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[BILLBOARD_POST_ERROR]', error);
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

		const response = await prismadb.billboard.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[BILLBOARD_POST_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
