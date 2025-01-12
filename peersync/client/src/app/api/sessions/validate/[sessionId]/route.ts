import { NextResponse } from "next/server";
import { getSession,deleteSession } from "../../../../../lib/session";

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
    try{
        const {sessionId} = await params;
        const session = await getSession(sessionId);
        if (!session) {
            return NextResponse.json({ 
              valid: false, 
              message: "Invalid session" 
            }, { status: 404 });
          }
      
          if (Date.now() > session.expiresAt) {
            await deleteSession(params.sessionId);
            return NextResponse.json({ 
              valid: false, 
              message: "Session expired" 
            }, { status: 410 });
          }
        return NextResponse.json({valid: true}, {status: 200});
    } catch {
        return NextResponse.json({ valid: false, message: "Server error"}, {status: 500});
    }
}