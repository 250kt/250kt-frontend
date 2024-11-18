import {Airfield} from "./airfield";
import {PilotAvatar} from "./pilotAvatar";
import {Flight} from "./flight";

export interface User {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    authorities?: string[];
    tokens?: string[];
    isEmailConfirmed?: boolean;
    favoriteAirfield?: Airfield;
    avatar?: PilotAvatar;
    flights?: Flight[];
}
