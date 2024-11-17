import { Observable, alert } from '@nativescript/core';
import { authService } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';

export class LoginViewModel extends Observable {
    email = '';
    password = '';
    isLoading = false;

    async onLogin() {
        if (!this.email || !this.password) {
            alert({
                title: "Validation Error",
                message: "Please enter both email and password",
                okButtonText: "OK"
            });
            return;
        }

        try {
            this.isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            await authService.login(this.email, this.password);
            
            const permissions = authService.permissions;
            if (permissions.canAccessAdmin) {
                navigate('pages/admin/dashboard-page');
            } else {
                navigate('pages/home/home-page');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert({
                title: "Login Failed",
                message: error.message || "Please check your credentials and try again",
                okButtonText: "OK"
            });
        } finally {
            this.isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    onRegister() {
        navigate('pages/auth/register-page');
    }
}