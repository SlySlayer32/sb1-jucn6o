export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'client' | 'cleaner' | 'admin';
    phone?: string;
    verified: boolean;
    created_at: string;
    updated_at?: string;
}

export interface AuthResponse {
    user: Profile | null;
    session: any | null;
    error?: Error;
}

export interface ProfileResponse {
    data: Profile | null;
    error?: Error;
}

export interface ProfilesResponse {
    data: Profile[] | null;
    error?: Error;
}

export interface ErrorResponse {
    message: string;
    status: number;
    code?: string;
    details?: any;
}