import { Observable } from '@nativescript/core';
import { authService } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';

export class RegisterViewModel extends Observable {
    fullName = '';
    email = '';
    password = '';
    selectedRoleIndex = 0;
    isLoading = false;

    get role(): 'client' | 'cleaner' {
        return this.selectedRoleIndex === 0 ? 'client' : 'cleaner';
    }

    async onRegister() {
        if (!this.fullName || !this.email || !this.password) {
            // TODO: Show validation error
            return;
        }

        try {
            this.isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            await authService.register(
                this.email,
                this.password,
                this.role,
                this.fullName
            );

            // Auto-login after registration
            await authService.login(this.email, this.password);
            navigate('pages/home/home-page');
        } catch (error) {
            console.error('Registration failed:', error);
            // TODO: Show error message
        } finally {
            this.isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    onBackToLogin() {
        navigate('pages/auth/login-page');
    }
}