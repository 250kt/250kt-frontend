import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from "@angular/router";
import {RouterService} from "./router.service";

@Injectable({
    providedIn: 'root'
})
export class NotAuthenticatedGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: AuthService,
        private routerService: RouterService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('AuthGuard#canActivate called')
        if(!this.authService.isAuthenticated()){
            return true;
        }
        this.routerService.navigateTo('home');
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(!this.authService.isAuthenticated()){
            return true;
        }
        this.routerService.navigateTo('home');
        return false;
    }
}
