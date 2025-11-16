import { NextRequest, NextResponse } from 'next/server';
import { getQueryById, updateQuery, deleteQuery } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const query = getQueryById(id);
    
    if (!query) {
      return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: query });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch query' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const updated = updateQuery(id, body);
    
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update query' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = deleteQuery(id);
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Query deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete query' }, { status: 500 });
  }
}
