import { createSession } from '../../../../lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const sessionId = await createSession();
    return NextResponse.json({ sessionId }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
