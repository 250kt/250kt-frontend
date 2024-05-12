import {Territory} from "./territory";

export interface Airfield {
    id: number;
    fullName: string;
    code: string;
    altitude: number;
    latitude: number;
    longitude: number;
    territory: Territory;
}
