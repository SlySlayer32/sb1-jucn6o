import { supabase } from './client';
import { profiles } from './profile.service';
import { handleError } from './error.utils';
import type { Profile, AuthResponse } from '../../types/supabase';

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