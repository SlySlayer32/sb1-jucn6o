import { Application } from '@nativescript/core';
import { supabase } from './services/supabase';

// Initialize Supabase client
if (!supabase) {
    console.error('Failed to initialize Supabase client');
    throw new Error('Supabase client initialization failed');
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.id);
});

Application.run({ moduleName: 'app-root' });