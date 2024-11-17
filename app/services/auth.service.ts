import { Observable } from '@nativescript/core';
import { supabase, auth, profiles } from './supabase.service';
import type { Profile } from '../types/supabase';

class AuthService extends Observable {
    private static instance: AuthService;
    private _isAuthenticated = false;
    private _currentUser: Profile | null = null;

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    get currentUser(): Profile | null {
        return this._currentUser;
    }

    async register(email: string, password: string, role: 'client' | 'cleaner', fullName: string): Promise<void> {
        try {
            const { user, error } = await auth.signUp(email, password, {
                role,
                full_name: fullName,
            });

            if (error) throw error;

            this._currentUser = user;
            this._isAuthenticated = !!user;
            this.notifyPropertyChange('currentUser', this._currentUser);
            this.notifyPropertyChange('isAuthenticated', this._isAuthenticated);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<void> {
        try {
            const { user, error } = await auth.signIn(email, password);

            if (error) throw error;

            if (user) {
                const { data: profile } = await profiles.get(user.id);
                this._currentUser = profile;
                this._isAuthenticated = true;
                this.notifyPropertyChange('currentUser', this._currentUser);
                this.notifyPropertyChange('isAuthenticated', this._isAuthenticated);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await auth.signOut();
            this._isAuthenticated = false;
            this._currentUser = null;
            this.notifyPropertyChange('currentUser', this._currentUser);
            this.notifyPropertyChange('isAuthenticated', this._isAuthenticated);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async updateProfile(updates: Partial<Profile>): Promise<void> {
        if (!this._currentUser) throw new Error('No authenticated user');

        try {
            const { data: updatedProfile } = await profiles.update(this._currentUser.id, updates);
            this._currentUser = updatedProfile;
            this.notifyPropertyChange('currentUser', this._currentUser);
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }

    async checkSession(): Promise<void> {
        try {
            const { data: { session } } = await auth.getSession();
            
            if (session?.user) {
                const { data: profile } = await profiles.get(session.user.id);
                this._currentUser = profile;
                this._isAuthenticated = true;
                this.notifyPropertyChange('currentUser', this._currentUser);
                this.notifyPropertyChange('isAuthenticated', this._isAuthenticated);
            }
        } catch (error) {
            console.error('Session check error:', error);
            throw error;
        }
    }
}

export const authService = AuthService.getInstance();
export const initializeAuth = async () => {
    try {
        const service = AuthService.getInstance();
        await service.checkSession();
        return service;
    } catch (error) {
        console.error('Auth initialization error:', error);
        throw error;
    }
};