// ============================================================
// CompareIQ — Centralized Application Configuration
// All env vars are accessed here ONLY — never process.env elsewhere
// ============================================================

export interface AppConfig {
    port: number;
    nodeEnv: string;
    db: {
        url: string;
        directUrl: string;
    };
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    cors: {
        origin: string;
    };
    ai: {
        geminiApiKey: string;
        model: string;
        maxOutputTokens: number;
        temperature: number;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
}

export function loadAppConfig(): AppConfig {
    const required = (key: string): string => {
        const value = process.env[key];
        if (!value) throw new Error(`Missing required env variable: ${key}`);
        return value;
    };

    const optional = (key: string, fallback: string): string =>
        process.env[key] ?? fallback;

    return {
        port: parseInt(optional('PORT', '3001'), 10),
        nodeEnv: optional('NODE_ENV', 'development'),

        db: {
            url: required('DATABASE_URL'),
            directUrl: optional('DIRECT_URL', required('DATABASE_URL')),
        },

        jwt: {
            secret: optional('JWT_SECRET', 'dev-secret-change-in-production'),
            refreshSecret: optional('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
            expiresIn: optional('JWT_EXPIRES_IN', '15m'),
            refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7d'),
        },

        cors: {
            origin: optional('ALLOWED_ORIGIN', 'http://localhost:3000'),
        },

        ai: {
            geminiApiKey: optional('GEMINI_API_KEY', ''),
            model: optional('GEMINI_MODEL', 'gemini-2.0-flash'),
            maxOutputTokens: parseInt(optional('GEMINI_MAX_TOKENS', '4000'), 10),
            temperature: parseFloat(optional('GEMINI_TEMPERATURE', '0.7')),
        },

        google: {
            clientId: optional('GOOGLE_CLIENT_ID', ''),
            clientSecret: optional('GOOGLE_CLIENT_SECRET', ''),
            callbackUrl: optional('GOOGLE_CALLBACK_URL', 'http://localhost:3001/auth/google/callback'),
        },
    };
}
