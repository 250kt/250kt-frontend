import {Airfield} from "./airfield";
import {Aircraft} from "./aircraft";

export interface Flight {
    id?: number;
    airfieldDeparture?: Airfield;
    airfieldArrival?: Airfield;
    createdAt?: String;
    aircraft?: Aircraft;
    isCurrentEdit?: boolean;
}
