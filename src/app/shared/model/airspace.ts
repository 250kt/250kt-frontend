export interface Airspace {
    id: number;
    name: string;
    type: string;
    part: Part[];
}

export interface Part {
    id: number;
    name: string;
    geometry: string;
}
