import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { createClient } from '@supabase/supabase-js';
import { SecureStorage } from '@nativescript/secure-storage';
import { Profile, AuthResponse, ProfileResponse, ProfilesResponse, ErrorResponse } from '../types/supabase';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sztphuvjmkipbbugmstc.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
    throw new Error('Missing Supabase API key');
}

const secureStorage = new SecureStorage();

// Create Supabase client with secure storage
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: {
            async getItem(key: string) {
                return await secureStorage.get({ key });
            },
            async setItem(key: string, value: string) {
                await secureStorage.set({ key, value });
            },
            async removeItem(key: string) {
                await secureStorage.remove({ key });
            },
        },
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
    },
});

// Authentication functions
export const auth = {
    async signUp(email: string, password: string, userData: Partial<Profile>): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData,
                },
            });

            if (error) throw error;

            if (data?.user) {
                await profiles.create({
                    id: data.user.id,
                    email: data.user.email!,
                    ...userData,
                });
            }

            return { user: data?.user as Profile, session: data?.session };
        } catch (error) {
            throw handleError(error);
        }
    },

    async signIn(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            return { user: data?.user as Profile, session: data?.session };
        } catch (error) {
            throw handleError(error);
        }
    },

    async signOut(): Promise<void> {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            throw handleError(error);
        }
    },

    async getSession() {
        try {
            return await supabase.auth.getSession();
        } catch (error) {
            throw handleError(error);
        }
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback);
    },
};

// Profile management functions
export const profiles = {
    async create(profile: Partial<Profile>): Promise<ProfileResponse> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert([{ ...profile, created_at: new Date().toISOString() }])
                .select()
                .single();

            if (error) throw error;
            return { data };
        } catch (error) {
            throw handleError(error);
        }
    },

    async get(userId: string): Promise<ProfileResponse> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return { data };
        } catch (error) {
            throw handleError(error);
        }
    },

    async update(userId: string, updates: Partial<Profile>): Promise<ProfileResponse> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return { data };
        } catch (error) {
            throw handleError(error);
        }
    },

    async delete(userId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;
        } catch (error) {
            throw handleError(error);
        }
    },

    async list(role?: string): Promise<ProfilesResponse> {
        try {
            let query = supabase.from('profiles').select('*');
            
            if (role) {
                query = query.eq('role', role);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { data };
        } catch (error) {
            throw handleError(error);
        }
    },
};

// Error handling utility
export const handleError = (error: any): ErrorResponse => {
    console.error('Supabase Error:', error);
    return {
        message: error.message || 'An unexpected error occurred',
        status: error.status || 500
    };
};