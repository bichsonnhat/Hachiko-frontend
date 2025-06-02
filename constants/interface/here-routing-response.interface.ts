export interface HereRoutingResponse {
    routes: Route[];
}

export interface Route {
    id: string;
    sections: Section[];
}

export interface Section {
    id: string;
    type: string;
    departure: RoutePoint;
    arrival: RoutePoint;
    summary: RouteSummary;
    polyline: string;
    transport: {
        mode: string;
    };
}

export interface RoutePoint {
    time: string;
    place: {
        type: string;
        location: Coordinates;
        originalLocation: Coordinates;
    };
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface RouteSummary {
    duration: number;       // thời gian (giây)
    length: number;         // độ dài (mét)
    baseDuration: number;   // thời gian cơ bản (chưa có traffic)
}
