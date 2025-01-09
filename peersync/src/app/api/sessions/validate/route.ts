import { NextResponse } from "next/server";
import { getSession,deleteSession } from "@/lib/session";

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
    try{
        const session = await getSession(params.sessionId);
        if(!session || Date.now() >session.expiresAt){
            if(session){
                await deleteSession(params.sessionId);
            }
            return NextResponse.json({valid: false}, {status: 404});
        }
        return NextResponse.json({valid: true}, {status: 200});
    } catch {
        return NextResponse.json({ valid: false, error: "Failed to validate session"}, {status: 500});
    }
}