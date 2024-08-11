import {Aircraft} from "./aircraft";
import {Step} from "./step";

export interface Flight {
    id?: number;
    createdAt?: string;
    aircraft?: Aircraft;
    currentEdit?: boolean;
    distance?: number;
    duration?: number;
    steps?: Step[];
}
