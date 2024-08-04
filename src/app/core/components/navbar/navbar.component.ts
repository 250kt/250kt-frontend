import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../../service/auth.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {RouterService} from "../../../service/router.service";

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    animations: [
        trigger('fadeInDropdown', [
            state('void', style({ opacity: 0 })),
            transition(':enter', [
                animate('200ms ease-in', style({ opacity: 1 }))
            ])
        ]),
        trigger('fadeOutDropdown', [
            state('void', style({ opacity: 1 })),
            transition(':leave', [
                animate('200ms ease-out', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class NavbarComponent {

    constructor(
        public authService: AuthService,
        private readonly routerService: RouterService
    ) {}

    isProfilDropdownOpen = false;
    isMobileMenuOpen = false;
    currentPage?: string;

    logout() {
        this.toggleProfilDropdown();
        this.authService.logout();
    }

    toggleProfilDropdown() {
        this.isProfilDropdownOpen = !this.isProfilDropdownOpen;
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    changePage(target: string) {
        this.routerService.navigateTo(target)
        this.currentPage = target;
        this.isProfilDropdownOpen = false;
    }

    isActive(path: string) {
        return this.routerService.getCurrentRoute().includes(path);
    }

}
