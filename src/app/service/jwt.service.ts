import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

    isTokenValid(): boolean {
        const expirationDate = this.getExpirationDate();
        if(expirationDate === null){
            return false;
        }
        return !(expirationDate.valueOf() > new Date().valueOf());
    }

    getExpirationDate(): any {
        const token = this.getToken();
        if(token){
            return JSON.parse(atob(token.split('.')[1])).exp;
        }
        return null;
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

    getAuthorities(): string[] {
        const token = this.getToken();
        if(token){
            return JSON.parse(atob(token.split('.')[1])).authorities;
        }
        return [];
    }
}
