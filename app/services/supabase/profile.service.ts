import { supabase } from './client';
import { handleError } from './error.utils';
import type { Profile, ProfileResponse, ProfilesResponse } from '../../types/supabase';

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