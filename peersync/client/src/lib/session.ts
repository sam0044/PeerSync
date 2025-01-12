import { randomBytes } from "crypto";

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

// In memory store for session. Will be replaced with Redis or other persistent storage in the future.
const sessions = new Map<string, Session>();

export async function createSession(): Promise<string>{
    const sessionId = randomBytes(16).toString('hex');
    const session: Session = {
        id: sessionId,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 60 * 1000,
    }
    sessions.set(sessionId, session);
    return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null>{
    return sessions.get(sessionId) || null;
}

export async function deleteSession(sessionId: string): Promise<void>{
    sessions.delete(sessionId);
}

// Cleanup function for expired sessions that runs 
setInterval(()=> {
    const now = Date.now();
    sessions.forEach((session, sessionId) => {
        if(session.expiresAt < now){
            deleteSession(sessionId);
        }
    });
}, 1000 * 60 * 5); 