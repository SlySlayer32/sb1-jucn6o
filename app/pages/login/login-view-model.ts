import { Observable } from '@nativescript/core';
import { authService } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';

export class LoginViewModel extends Observable {
    email = '';
    password = '';

    async onLogin() {
        if (!this.email || !this.password) {
            // TODO: Show validation error
            return;
        }

        try {
            await authService.login(this.email, this.password);
            navigate('pages/home/home-page');
        } catch (error) {
            console.error('Login failed:', error);
        }
    }
}