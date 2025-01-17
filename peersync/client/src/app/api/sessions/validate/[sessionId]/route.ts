import { NextResponse, NextRequest } from "next/server";
import { getSession,deleteSession } from "../../../../../lib/session";

export async function GET(request: NextRequest) {
    try{
        const sessionId = request.nextUrl.pathname.split('/').pop();
        if (!sessionId) {
          return NextResponse.json({ valid: false, message: "Invalid session" }, { status: 404 });
        }
        console.log("session exists")
        const session = await getSession(sessionId);
        if (!session) {
            return NextResponse.json({ 
              valid: false, 
              message: "Invalid session" 
            }, { status: 404 });
          }
          console.log("never got here")
      
          if (Date.now() > session.expiresAt) {
            await deleteSession(sessionId);
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