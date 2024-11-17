import type { ErrorResponse } from '../../types/supabase';

export const handleError = (error: any): ErrorResponse => {
    console.error('Supabase Error:', error);
    
    return {
        message: error.message || 'An unexpected error occurred',
        status: error.status || 500,
        code: error.code,
        details: error.details
    };
};