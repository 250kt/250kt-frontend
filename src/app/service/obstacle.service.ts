import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Obstacle} from "../shared/model/obstacle";

@Injectable({
    providedIn: 'root'
})
export class ObstacleService {

    constructor(
        private readonly http: HttpClient,
    ) {}

    private readonly url = environment.backendUrl + '/obstacle';

    retrieveObstacles(): Observable<Obstacle[]> {
        return this.http.get<Obstacle[]>(`${this.url}/all`);
    }
}
