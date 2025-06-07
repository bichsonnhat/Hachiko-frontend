export interface RouteResponse {
    code: string;
    routes: Route[];
    waypoints: Waypoint[];
}

export interface Route {
    geometry: string;
    legs: Leg[];
    summary: string;
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
}

export interface Leg {
    steps: any[]; // Nếu cần chi tiết hơn, bạn có thể định nghĩa interface cho mỗi step
    summary: string;
    weight: number;
    duration: number;
    distance: number;
}

export interface Waypoint {
    hint: string;
    distance: number;
    name: string;
    location: [number, number]; // [longitude, latitude]
}
