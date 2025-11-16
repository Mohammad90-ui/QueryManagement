import { NextRequest, NextResponse } from 'next/server';
import { getAllQueries, createQuery } from '@/lib/database';

export async function GET() {
  try {
    const queries = getAllQueries();
    return NextResponse.json({ success: true, data: queries });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch queries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newQuery = createQuery(body);
    return NextResponse.json({ success: true, data: newQuery }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create query' }, { status: 400 });
  }
}
