import { Observable } from '@nativescript/core';
import { authService } from '../../services/auth.service';
import { navigate } from '../../utils/navigation';

export class HomeViewModel extends Observable {
    services = [
        { id: 1, name: 'Regular Cleaning', price: 'From $50' },
        { id: 2, name: 'Deep Cleaning', price: 'From $100' },
        { id: 3, name: 'Window Cleaning', price: 'From $75' },
        { id: 4, name: 'Move-in/Move-out', price: 'From $150' },
    ];

    userEmail = 'user@example.com';

    onBookService(args) {
        const service = args.object.bindingContext;
        // TODO: Implement booking flow
        console.log(`Booking service: ${service.name}`);
    }

    async onLogout() {
        await authService.logout();
        navigate('pages/login/login-page');
    }
}