import { BorderWidth, ButtonColor } from "./PolygonCard";

export interface PolygonOptionsType {
  borderWidth: BorderWidth;
  borderColor: ButtonColor;
  backgroundColor: ButtonColor;
}

export interface ChangePolygonOptions {
  id: number;
  options: google.maps.PolygonOptions;
  polygonOption: { [key: string]: BorderWidth | ButtonColor };
}

export interface PolygonType {
  id: number;
  coordinates: google.maps.LatLngLiteral[];
  prevCoordinates: google.maps.LatLngLiteral[] | [];
  polygonInstance: google.maps.Polygon | null;
  options: PolygonOptionsType;
}

export interface CircleType {
  id: number;
  radius: number;
  center: google.maps.LatLng;
  circleInstance: google.maps.Circle | null;
}

export interface DistancePolylineType {
  id: number;
  coordinates: google.maps.LatLngLiteral[];
  polylineInstance: google.maps.Polyline | null;
}

export interface UndoDataType {
  id: number;
  lat: number;
  lng: number;
}

export interface PolygonCardType {
  id: number;
  lat: number;
  lng: number;
}
