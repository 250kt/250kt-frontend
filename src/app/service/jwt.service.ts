import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

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
