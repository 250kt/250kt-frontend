import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Airfield} from "../shared/model/airfield";
import { User } from "../shared/model/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private url = environment.backendUrl + '/user';

    retrieveFavoriteAirfield(): Observable<Airfield> {
        return this.http.get<Airfield>(`${this.url}/favorite-airfield`);
    }

    getUserProfile(): Observable<User> {
        return this.http.get<User>(`${this.url}/profile`);
    }

    updateFavoriteAirfield(airfield: Airfield) {
        return this.http.put(`${this.url}/favorite-airfield`, airfield);
    }

}
