import { Observable, alert } from '@nativescript/core';
import { authService, UserProfile } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';

export class ProfileViewModel extends Observable {
    profile: UserProfile;
    isLoading = false;

    constructor() {
        super();
        this.profile = { ...authService.currentUser };
    }

    async onSave() {
        if (!this.profile.full_name?.trim()) {
            alert({
                title: "Validation Error",
                message: "Full name is required",
                okButtonText: "OK"
            });
            return;
        }

        try {
            this.isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            await authService.updateProfile({
                full_name: this.profile.full_name.trim(),
                phone: this.profile.phone?.trim(),
            });

            alert({
                title: "Success",
                message: "Profile updated successfully",
                okButtonText: "OK"
            });
        } catch (error) {
            console.error('Profile update failed:', error);
            alert({
                title: "Update Failed",
                message: error.message || "Failed to update profile",
                okButtonText: "OK"
            });
        } finally {
            this.isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    async onLogout() {
        try {
            await authService.logout();
            navigate('pages/auth/login-page');
        } catch (error) {
            console.error('Logout failed:', error);
            alert({
                title: "Logout Failed",
                message: error.message || "Failed to logout",
                okButtonText: "OK"
            });
        }
    }
}