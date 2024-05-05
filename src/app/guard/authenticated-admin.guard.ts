import {Injectable} from "@angular/core";
import {AuthService} from "../service/auth.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {RouterService} from "../service/router.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticatedAdminGuard  {

    constructor(
        private authService: AuthService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.authService.isAuthenticated() && this.authService.isAdmin()){
            return true;
        }
        this.authService.logout();
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.authService.isAuthenticated() && this.authService.isAdmin()){
            return true;
        }
        this.authService.logout();
        return false;
    }
}
