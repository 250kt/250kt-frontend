import {Injectable} from "@angular/core";
import {AuthService} from "../service/auth.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {RouterService} from "../service/router.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticatedGuard  {

    constructor(
        private authService: AuthService,
        private routerService: RouterService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.authService.isAuthenticated()){
            return true;
        }
        this.routerService.navigateTo('login');
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.authService.isAuthenticated()){
            return true;
        }
        this.routerService.navigateTo('login');
        return false;
    }
}
