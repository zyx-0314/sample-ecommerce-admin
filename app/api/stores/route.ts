import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { userId } = auth();
		const body = await request.json();
		const { name } = body;

		if (!userId) return new NextResponse('Unauthorized', { status: 401 });

		if (!name) return new NextResponse('Name is required', { status: 400 });

		const response = await prismadb.store.create({
			data: {
				name,
				userId,
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.log('[STORES_POST_ERROR]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
