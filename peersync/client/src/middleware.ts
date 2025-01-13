import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(_request: NextRequest){
    // if(!request.nextUrl.pathname.startsWith('/receive')){
    //     return NextResponse.next();
    // }

    // const sessionId = request.nextUrl.pathname.split('/').pop();
    // try{
    //     const response = await fetch(`${request.nextUrl.origin}/api/sessions/validate/${sessionId}`, {method: 'GET'});
    //     const data = await response.json();
    //     if(data.valid){
    //         return NextResponse.next();
    //     }
    //     const redirectUrl = new URL('/error', request.url);
    //     redirectUrl.searchParams.set('type', data.message === 'Session expired' ? 'expired-session' : 'invalid-session');
    //     return NextResponse.redirect(redirectUrl);

    // } catch {
    //     const redirectUrl = new URL('/error', request.url);
    //     redirectUrl.searchParams.set('type', 'invalid-session');
    //     return NextResponse.redirect(redirectUrl);
    // }
    return NextResponse.next();
}


export const config = {
    matcher: '/receive/:path*',
};