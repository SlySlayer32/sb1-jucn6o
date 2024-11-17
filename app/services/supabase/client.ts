import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { createClient } from '@supabase/supabase-js';
import { SecureStorage } from '@nativescript/secure-storage';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sztphuvjmkipbbugmstc.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
    throw new Error('Missing Supabase API key - Please check your environment variables');
}

const secureStorage = new SecureStorage();

const customStorage = {
    async getItem(key: string): Promise<string | null> {
        try {
            return await secureStorage.get({ key });
        } catch (error) {
            console.error('Storage getItem error:', error);
            return null;
        }
    },
    async setItem(key: string, value: string): Promise<void> {
        try {
            await secureStorage.set({ key, value });
        } catch (error) {
            console.error('Storage setItem error:', error);
        }
    },
    async removeItem(key: string): Promise<void> {
        try {
            await secureStorage.remove({ key });
        } catch (error) {
            console.error('Storage removeItem error:', error);
        }
    }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: customStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce'
    },
    global: {
        headers: {
            'X-Client-Info': 'nativescript-supabase'
        }
    }
});