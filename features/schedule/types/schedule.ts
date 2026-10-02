// schedule/types/schedule.ts

export interface Vehicle {
  id: number;
  seat_layout_id: number | null;
  driver_id: number | null;
  name: string;
  code: string | null;
  plate_number: string | null;
  seat: number;
  type: string;
  is_active: number;
}

export interface ScheduleItem {
  id: number;
  transport_route_id: number;
  vehicle_id: number;
  schedule_type: string;
  schedule_time: string;
  is_popular: number;
  total_seat: number | null;
  available_seats: number;
  vehicle: Vehicle;
}

export interface RouteStop {
  id: number;
  stop_order: number;
  city: {
    id: number;
    name: string;
    description?: string;
  };
}

export interface ScheduleRouteData {
  id: number;
  name: string;
  product_id: number;
  description: string;
  price: number;
  is_active: number;
  latitude: string;
  longitude: string;
  route_stops?: RouteStop[];
  schedules: ScheduleItem[];
}

export interface ScheduleResponse {
  success: boolean;
  server_time: string;
  active_type: string;
  current_date: string;
  data: ScheduleRouteData;
}
