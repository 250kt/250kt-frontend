import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {AirfieldShort} from "../shared/model/airfield";
import { User } from "../shared/model/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private readonly url = environment.backendUrl + '/user';

    retrieveFavoriteAirfield(): Observable<AirfieldShort> {
        return this.http.get<AirfieldShort>(`${this.url}/favorite-airfield`);
    }

    getUserProfile(): Observable<User> {
        return this.http.get<User>(`${this.url}/profile`);
    }

    updateFavoriteAirfield(airfield: AirfieldShort) {
        return this.http.put(`${this.url}/favorite-airfield`, airfield);
    }

    sendConfirmEmail() {
        return this.http.post(`${this.url}/send-confirm-email`, null);
    }

    confirmEmail(code: string) {
        return this.http.post(`${this.url}/confirm-email`, code);
    }

    changePassword(password: string) {
        return this.http.put(`${this.url}/change-password`, password);
    }

    deleteAccount() {
        return this.http.delete(`${this.url}/delete-account`);
    }
}
