export interface PollutionDataPoint {
    id?: number;
    name: string;
    lat: number;
    lon: number;
    pollutant: string;
    value: number;
    unit: string;
}