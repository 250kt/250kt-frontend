import {Airfield} from "./airfield";
import {PilotAvatar} from "./pilotAvatar";

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
}
