import { createClient } from '@supabase/supabase-js';
import { SecureStorage } from '@nativescript/secure-storage';

const supabaseUrl = 'https://sztphuvjmkipbbugmstc.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
    throw new Error('Missing Supabase API key');
}

const secureStorage = new SecureStorage();

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