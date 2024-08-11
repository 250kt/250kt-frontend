import {Airfield} from "./airfield";

export interface Step {

    id: number;
    altitude?: number;
    cap?: number;
    distance: number;
    duration: number;
    order: number;
    airfield: Airfield;
}
