import { NextResponse } from 'next/server';
import { getAllQueries } from '@/lib/database';
import { calculateAnalytics } from '@/lib/analytics-utils';

export async function GET() {
  try {
    const queries = getAllQueries();
    const analytics = calculateAnalytics(queries);
    
    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
