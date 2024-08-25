export interface AirfieldWeather {
    airfieldCode: string;
    taf: Taf;
    metar: Metar;
}

export interface Metar {
    data: string;
    publishedAt: string;
}

export interface Taf {
    data: string;
    publishedAt: string;
}
