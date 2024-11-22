import {Territory} from "./territory";
import {Runway} from "./runway";

export interface Airfield {
    id: number;
    fullName: string;
    code: string;
    altitude: number;
    latitude: number;
    longitude: number;
    territory: Territory;
    type: AirfieldType;
    runway: Runway;
}

export interface AirfieldShort {
    id: number;
    fullName: string;
    code: string;
    territory: Territory;
    latitude: number;
    longitude: number;
}

export enum AirfieldType {
    MILITARY_PAVED = 'MILITARY_PAVED',
    MILITARY_UNPAVED = 'MILITARY_UNPAVED',
    CIVIL_PAVED = 'CIVIL_PAVED',
    CIVIL_UNPAVED = 'CIVIL_UNPAVED',
    MILITARY_CIVIL_PAVED = 'MILITARY_CIVIL_PAVED',
    MILITARY_CIVIL_UNPAVED = 'MILITARY_CIVIL_UNPAVED',
    ABANDONED = 'ABANDONED',
    PRIVATE = 'PRIVATE',
}

export function getIconAirfield(airfieldType: AirfieldType): any{
    switch (airfieldType) {
        case AirfieldType.MILITARY_PAVED:
            return 'assets/icons/airfields/airfield_military_paved.png';
        case AirfieldType.MILITARY_UNPAVED:
            return 'assets/icons/airfields/airfield_military_unpaved.png';
        case AirfieldType.CIVIL_PAVED:
            return 'assets/icons/airfields/airfield_civil_paved.png';
        case AirfieldType.CIVIL_UNPAVED:
            return 'assets/icons/airfields/airfield_civil_unpaved.png';
        case AirfieldType.MILITARY_CIVIL_PAVED:
            return 'assets/icons/airfields/airfield_military_civil_paved.png';
        case AirfieldType.MILITARY_CIVIL_UNPAVED:
            return 'assets/icons/airfields/airfield_military_civil_unpaved.png';
        case AirfieldType.ABANDONED:
            return 'assets/icons/airfields/airfield_abandoned.png';
        case AirfieldType.PRIVATE:
            return 'assets/icons/airfields/airfield_private.png';
        default:
            return 'assets/icons/airfields/airfield_civil_unpaved.png';
    }
}
