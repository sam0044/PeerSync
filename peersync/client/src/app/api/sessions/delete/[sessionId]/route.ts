import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function DELETE(request: NextRequest) {
    const sessionId = request.nextUrl.pathname.split('/').pop();
    if(!sessionId){
        return NextResponse.json({ message: "Invalid session" }, { status: 404 });
    }
    try{
        await deleteSession(sessionId);
        return NextResponse.json({ message: "Session deleted" }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Failed to delete session" }, { status: 500 });
    }
}