import { NextRequest, NextResponse } from 'next/server';
import { autoTagQuery, detectPriority } from '@/lib/query-utils';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid content' },
        { status: 400 }
      );
    }

    const tags = autoTagQuery(content);
    const priority = detectPriority(content, tags);

    return NextResponse.json({
      success: true,
      data: { tags, priority },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to auto-tag query' },
      { status: 500 }
    );
  }
}
