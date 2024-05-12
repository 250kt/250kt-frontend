import {Territory} from "./territory";

export interface Obstacle {
    id: number
    territory: Territory
    latitude: number
    longitude: number
    altitude: number
    height: number
    type: ObstacleType
    count: number
}

export enum ObstacleType {
    WIND_TURBINE = 'WIND_TURBINE',
    GROUP_OF_OBSTACLES_LIGHTED_AT_NIGHT_ABOVE_500_AGL = 'GROUP_OF_OBSTACLES_LIGHTED_AT_NIGHT_ABOVE_500_AGL',
    GROUP_OF_OBSTACLES_LIGHTED_AT_NIGHT_UNDER_500_AGL = 'GROUP_OF_OBSTACLES_LIGHTED_AT_NIGHT_UNDER_500_AGL',
    GROUP_OF_OBSTACLES_NOT_LIGHTED_AT_NIGHT_UNDER_500_AGL = 'GROUP_OF_OBSTACLES_NOT_LIGHTED_AT_NIGHT_UNDER_500_AGL',
    GROUP_OF_OBSTACLES_NOT_LIGHTED_AT_NIGHT_ABOVE_500_AGL = 'GROUP_OF_OBSTACLES_NOT_LIGHTED_AT_NIGHT_ABOVE_500_AGL',
    OBSTACLE_NOT_LIGHTED_AT_NIGHT_ABOVE_500_AGL = 'OBSTACLE_NOT_LIGHTED_AT_NIGHT_ABOVE_500_AGL',
    OBSTACLE_NOT_LIGHTED_AT_NIGHT_UNDER_500_AGL = 'OBSTACLE_NOT_LIGHTED_AT_NIGHT_UNDER_500_AGL',
    OBSTACLE_LIGHTED_AT_NIGHT_ABOVE_500_AGL = 'OBSTACLE_LIGHTED_AT_NIGHT_ABOVE_500_AGL',
    OBSTACLE_LIGHTED_AT_NIGHT_UNDER_500_AGL = 'OBSTACLE_LIGHTED_AT_NIGHT_UNDER_500_AGL'
}


export function getIconUrl(type: ObstacleType): any{
    switch (type) {
        case ObstacleType.WIND_TURBINE:
            return 'assets/icons/wind_turbine.png';
        case ObstacleType.GROUP_OF_OBSTACLES_LIGHTED_AT_NIGHT_ABOVE_500_AGL:
            return 'assets/icons/group_of_obstacles_lighted_at_night_above_500_agl.png';
        case ObstacleType.GROUP_OF_OBSTACLES_LIGHTED_AT_NIGHT_UNDER_500_AGL:
            return 'assets/icons/group_of_obstacles_lighted_at_night_under_500_agl.png';
        case ObstacleType.GROUP_OF_OBSTACLES_NOT_LIGHTED_AT_NIGHT_UNDER_500_AGL:
            return 'assets/icons/group_of_obstacles_not_lighted_at_night_under_500_agl.png';
        case ObstacleType.GROUP_OF_OBSTACLES_NOT_LIGHTED_AT_NIGHT_ABOVE_500_AGL:
            return 'assets/icons/group_of_obstacles_not_lighted_at_night_above_500_agl.png';
        case ObstacleType.OBSTACLE_NOT_LIGHTED_AT_NIGHT_ABOVE_500_AGL:
            return 'assets/icons/obstacle_not_lighted_at_night_above_500_agl.png';
        case ObstacleType.OBSTACLE_NOT_LIGHTED_AT_NIGHT_UNDER_500_AGL:
            return 'assets/icons/obstacle_not_lighted_at_night_under_500_agl.png';
        case ObstacleType.OBSTACLE_LIGHTED_AT_NIGHT_ABOVE_500_AGL:
            return 'assets/icons/obstacle_lighted_at_night_above_500_agl.png';
        case ObstacleType.OBSTACLE_LIGHTED_AT_NIGHT_UNDER_500_AGL:
            return 'assets/icons/obstacle_lighted_at_night_under_500_agl.png';
        default:
            return 'assets/icons/wind_turbine.png';
    }
}
