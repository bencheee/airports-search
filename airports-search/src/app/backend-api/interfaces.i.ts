export interface AllAirportsResponse {
  data: AirportDetails[];
}

export interface SingleAirportResponse {
  data: AirportDetails;
}

export interface AirportDetails {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: {
      href: string;
      methods: string[];
  };
  timeZoneOffset: string;
  iataCode: string;
  geoCode: {
      latitude: number;
      longitude: number;
  };
  address: {
      cityName: string;
      cityCode: string;
      countryName: string;
      countryCode: string;
      regionCode: string;
  };
  analytics?: {
      travelers: {
          score: number;
      };
  };
  customLabel?: string;
  topTen?: boolean;
}

export interface TopAirport {
  id: string;
  detailedName: string;
  count: number;
}