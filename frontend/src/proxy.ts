import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 proxy (previously: middleware).
 * Auth is handled client-side in (app)/layout.tsx.
 * This proxy does nothing — just passes all requests through.
 */
export function proxy(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [],
};
