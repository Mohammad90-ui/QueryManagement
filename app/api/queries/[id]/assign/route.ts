import { NextRequest, NextResponse } from 'next/server';
import { assignQueryToTeamMember } from '@/lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { teamMemberId } = await request.json();
    
    const updated = assignQueryToTeamMember(id, teamMemberId);
    
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Query not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to assign query' }, { status: 400 });
  }
}
