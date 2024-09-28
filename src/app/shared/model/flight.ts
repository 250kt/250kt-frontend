import {Aircraft} from "./aircraft";
import {Step} from "./step";

export interface Flight {
    id?: number;
    createdAt?: string;
    aircraft?: Aircraft;
    currentEdit?: boolean;
    distance?: number;
    duration?: number;
    fuelReport?: FuelReport;
    steps?: Step[];
}

export interface FuelReport {
    fuelOnBoard: number;
    fuelSecurityTenPercent: number;
    fuelReserve: number;
    fuelNeeded: number;
}
