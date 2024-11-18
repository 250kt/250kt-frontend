import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../shared/model/user";
import {Observable, tap, throwError} from "rxjs";
import {Authenticate} from "../shared/model/authenticate";
import {JwtService} from "./jwt.service";
import {Authority} from "../shared/model/authority";
import {RouterService} from "./router.service";
import {catchError} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private readonly http: HttpClient,
        private readonly jwtService: JwtService,
        private readonly routerService: RouterService
    ) {}

    login(user: User): Observable<Authenticate> {
        return this.http.post<Authenticate>(`${environment.backendUrl}/auth/authenticate`, user);
    }

    register(user: User): Observable<Authenticate> {
        return this.http.post<Authenticate>(`${environment.backendUrl}/auth/register`, user);
    }

    logout() {
        this.jwtService.destroyToken();
        this.jwtService.destroyRefreshToken();
        this.routerService.navigateTo('signin');
    }

    refreshToken(): Observable<any> {
        const refreshToken = this.jwtService.getRefreshToken();
        if (!refreshToken) {
            // No refresh token, cannot refresh
            return throwError('Refresh token not found');
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
        });
        return this.http.post(`${environment.backendUrl}/auth/refresh-token`, {}, {headers: headers}).pipe(
            tap((tokens: any) => {
                this.jwtService.saveToken(tokens.access_token);
                this.jwtService.saveRefreshToken(tokens.refresh_token);
            }),
            catchError(error => {
                this.logout();
                return throwError(error);
            })
        );
    }

    getToken(): string {
        return this.jwtService.getToken();
    }

    saveToken(token: string) {
        this.jwtService.saveToken(token);
    }

    saveRefreshToken(refreshToken: string) {
        this.jwtService.saveRefreshToken(refreshToken);
    }

    isAuthenticated(): boolean {
        return this.jwtService.getToken();

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
