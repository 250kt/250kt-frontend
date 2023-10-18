import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../shared/model/user";
import {Observable} from "rxjs";
import {Authenticate} from "../shared/model/authenticate";
import {JwtService} from "./jwt.service";
import {Authority} from "../shared/model/authority";
import {RouterService} from "./router.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private readonly http: HttpClient,
        private jwtService: JwtService,
        private routerService: RouterService
    ) {}

    login(user: User): Observable<Authenticate> {
        return this.http.post<Authenticate>(`${environment.backendUrl}/auth/authenticate`, user);
    }

    register(user: User): Observable<Authenticate> {
        return this.http.post<Authenticate>(`${environment.backendUrl}/auth/register`, user);
    }

    logout() {
        this.jwtService.destroyToken();
        this.routerService.navigateTo('login');
    }

    saveToken(token: string) {
        this.jwtService.saveToken(token);
    }

    isAuthenticated(): boolean {
        return this.jwtService.isTokenValid();
    }

    isAdmin(): boolean {
        let authorities: any;
        authorities = this.jwtService.getAuthorities();
        for (let authority of authorities) {
            if (authority.authority === Authority.ADMIN) {
                return true;
            }
        }
        return false;
    }

}
