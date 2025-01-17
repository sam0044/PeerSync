import { randomBytes } from "crypto";
import { redis } from "./redis";

export interface Session {
    id: string;
    createdAt: number;
    expiresAt: number;
    fileInfo?: {
      name: string;
      size: number;
      type: string;
    };
}

export async function createSession(): Promise<string>{
    const sessionId = randomBytes(16).toString('hex');
    const session: Session = {
        id: sessionId,
        createdAt: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000,
    }
    await redis.set(`session:${sessionId}`, JSON.stringify(session), {
        ex: 900
    });
    return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null>{
    const session = await redis.get<Session>(`session:${sessionId}`);
    console.log(session);
    return session
}

export async function deleteSession(sessionId: string): Promise<void>{
    console.log('deleting session', sessionId);
    const result = await redis.del(`session:${sessionId}`);
    console.log(result);
}
