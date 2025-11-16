import { NextResponse } from 'next/server';
import { getTeamMembers } from '@/lib/database';

export async function GET() {
  try {
    const members = getTeamMembers();
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch team members' }, { status: 500 });
  }
}
