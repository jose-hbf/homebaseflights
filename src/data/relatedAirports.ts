export interface RelatedAirport {
  code: string
  city: string
}

export interface RelatedAirportsGroup {
  title: string
  airports: RelatedAirport[]
}

export interface AirportRelations {
  [key: string]: RelatedAirportsGroup[]
}

export const relatedAirports: AirportRelations = {
  JFK: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'EWR', city: 'Newark' },
        { code: 'BOS', city: 'Boston' },
        { code: 'MIA', city: 'Miami' },
        { code: 'ATL', city: 'Atlanta' },
      ],
    },
    {
      title: 'Nearby international',
      airports: [
        { code: 'YYZ', city: 'Toronto' },
        { code: 'LHR', city: 'London' },
      ],
    },
  ],
  LAX: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'SFO', city: 'San Francisco' },
        { code: 'SEA', city: 'Seattle' },
        { code: 'DEN', city: 'Denver' },
      ],
    },
    {
      title: 'Major international hubs',
      airports: [
        { code: 'SYD', city: 'Sydney' },
        { code: 'DXB', city: 'Dubai' },
      ],
    },
  ],
  LHR: [
    {
      title: 'Nearby in Europe',
      airports: [
        { code: 'CDG', city: 'Paris' },
        { code: 'AMS', city: 'Amsterdam' },
        { code: 'FRA', city: 'Frankfurt' },
      ],
    },
    {
      title: 'Major international hubs',
      airports: [
        { code: 'JFK', city: 'New York' },
        { code: 'DXB', city: 'Dubai' },
      ],
    },
  ],
  DXB: [
    {
      title: 'Major international hubs',
      airports: [
        { code: 'LHR', city: 'London' },
        { code: 'FRA', city: 'Frankfurt' },
        { code: 'CDG', city: 'Paris' },
        { code: 'SYD', city: 'Sydney' },
      ],
    },
  ],
  ORD: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'JFK', city: 'New York' },
        { code: 'LAX', city: 'Los Angeles' },
        { code: 'ATL', city: 'Atlanta' },
        { code: 'DEN', city: 'Denver' },
      ],
    },
    {
      title: 'Nearby international',
      airports: [
        { code: 'YYZ', city: 'Toronto' },
      ],
    },
  ],
  CDG: [
    {
      title: 'Nearby in Europe',
      airports: [
        { code: 'LHR', city: 'London' },
        { code: 'AMS', city: 'Amsterdam' },
        { code: 'FRA', city: 'Frankfurt' },
        { code: 'BCN', city: 'Barcelona' },
      ],
    },
  ],
  FRA: [
    {
      title: 'Other German airports',
      airports: [
        { code: 'MUC', city: 'Munich' },
      ],
    },
    {
      title: 'Nearby in Europe',
      airports: [
        { code: 'AMS', city: 'Amsterdam' },
        { code: 'CDG', city: 'Paris' },
        { code: 'LHR', city: 'London' },
      ],
    },
  ],
  SFO: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'LAX', city: 'Los Angeles' },
        { code: 'SEA', city: 'Seattle' },
        { code: 'DEN', city: 'Denver' },
      ],
    },
    {
      title: 'Major international hubs',
      airports: [
        { code: 'SYD', city: 'Sydney' },
        { code: 'YYZ', city: 'Toronto' },
      ],
    },
  ],
  AMS: [
    {
      title: 'Nearby in Europe',
      airports: [
        { code: 'LHR', city: 'London' },
        { code: 'CDG', city: 'Paris' },
        { code: 'FRA', city: 'Frankfurt' },
        { code: 'MUC', city: 'Munich' },
      ],
    },
  ],
  MAD: [
    {
      title: 'Other Spanish airports',
      airports: [
        { code: 'BCN', city: 'Barcelona' },
      ],
    },
    {
      title: 'Nearby in Europe',
      airports: [
        { code: 'CDG', city: 'Paris' },
        { code: 'LHR', city: 'London' },
        { code: 'FRA', city: 'Frankfurt' },
      ],
    },
  ],
  BCN: [
    {
      title: 'Other Spanish airports',
      airports: [
        { code: 'MAD', city: 'Madrid' },
      ],
    },
    {
      title: 'Nearby in Europe',
      airports: [
        { code: 'CDG', city: 'Paris' },
        { code: 'AMS', city: 'Amsterdam' },
        { code: 'FRA', city: 'Frankfurt' },
      ],
    },
  ],
  BOS: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'JFK', city: 'New York' },
        { code: 'EWR', city: 'Newark' },
        { code: 'MIA', city: 'Miami' },
        { code: 'ATL', city: 'Atlanta' },
      ],
    },
    {
      title: 'Nearby international',
      airports: [
        { code: 'YYZ', city: 'Toronto' },
      ],
    },
  ],
  MIA: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'ATL', city: 'Atlanta' },
        { code: 'JFK', city: 'New York' },
        { code: 'EWR', city: 'Newark' },
        { code: 'BOS', city: 'Boston' },
      ],
    },
  ],
  EWR: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'JFK', city: 'New York' },
        { code: 'BOS', city: 'Boston' },
        { code: 'ATL', city: 'Atlanta' },
        { code: 'MIA', city: 'Miami' },
      ],
    },
    {
      title: 'Nearby international',
      airports: [
        { code: 'YYZ', city: 'Toronto' },
      ],
    },
  ],
  ATL: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'MIA', city: 'Miami' },
        { code: 'JFK', city: 'New York' },
        { code: 'ORD', city: 'Chicago' },
        { code: 'DEN', city: 'Denver' },
      ],
    },
  ],
  MUC: [
    {
      title: 'Other German airports',
      airports: [
        { code: 'FRA', city: 'Frankfurt' },
      ],
    },
    {
      title: 'Nearby in Europe',
      airports: [
        { code: 'AMS', city: 'Amsterdam' },
        { code: 'CDG', city: 'Paris' },
        { code: 'LHR', city: 'London' },
      ],
    },
  ],
  SEA: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'SFO', city: 'San Francisco' },
        { code: 'LAX', city: 'Los Angeles' },
        { code: 'DEN', city: 'Denver' },
      ],
    },
    {
      title: 'Nearby international',
      airports: [
        { code: 'YYZ', city: 'Toronto' },
      ],
    },
  ],
  DEN: [
    {
      title: 'Other US airports',
      airports: [
        { code: 'LAX', city: 'Los Angeles' },
        { code: 'SFO', city: 'San Francisco' },
        { code: 'ORD', city: 'Chicago' },
        { code: 'SEA', city: 'Seattle' },
      ],
    },
  ],
  SYD: [
    {
      title: 'Major international hubs',
      airports: [
        { code: 'DXB', city: 'Dubai' },
        { code: 'LAX', city: 'Los Angeles' },
        { code: 'SFO', city: 'San Francisco' },
        { code: 'LHR', city: 'London' },
      ],
    },
  ],
  YYZ: [
    {
      title: 'Nearby US airports',
      airports: [
        { code: 'JFK', city: 'New York' },
        { code: 'BOS', city: 'Boston' },
        { code: 'ORD', city: 'Chicago' },
        { code: 'EWR', city: 'Newark' },
      ],
    },
    {
      title: 'Major international hubs',
      airports: [
        { code: 'LHR', city: 'London' },
      ],
    },
  ],
}

export function getRelatedAirports(code: string): RelatedAirportsGroup[] | null {
  return relatedAirports[code.toUpperCase()] || null
}
