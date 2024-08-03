import {FuelType} from "./fuelType";

export interface Aircraft {
    id: number;
    registration: string;
    model: string;
    consumption: number;
    fuelType: FuelType;
    tankCapacity: number;
    nonPumpableFuel: number;
    maximumWeight: number;
    unloadedWeight: number;
    trueAirSpeed: number;
    favorite: boolean;
}
