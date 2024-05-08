import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

    getExpirationDate(): any {
        const token = this.getToken();
        if(token){
            const exp = JSON.parse(atob(token.split('.')[1])).exp;
            return new Date(exp * 1000); // Convert to milliseconds
        }
        return null;
    }

    isTokenValid(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        const expirationDate = this.getExpirationDate();
        if (!expirationDate) {
            return false;
        }
        return expirationDate.getTime() > new Date().getTime();
    }

    getToken(): any {
      return sessionStorage.getItem('token');
    }

    saveToken(token: string) {
      sessionStorage.setItem('token', token);
    }

    destroyToken() {
      sessionStorage.removeItem('token');
    }

    saveRefreshToken(refreshToken: string) {
        sessionStorage.setItem('refreshToken', refreshToken);
    }

    getRefreshToken(): any {
        return sessionStorage.getItem('refreshToken');
    }

    destroyRefreshToken() {
        sessionStorage.removeItem('refreshToken');
    }

    getAuthorities(): string[] {
        const token = this.getToken();
        if(token){
            return JSON.parse(atob(token.split('.')[1])).authorities;
        }
        return [];
    }
}
