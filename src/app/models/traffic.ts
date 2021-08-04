export class Traffic {
    constructor(
      public id: string,
      public routeId: number,
      public planetOrigin: string,
      public planetDestination: string,
      public trafficDelay: number
    ) {}
  
    static createFromJSON(json: string): Traffic {
      if (typeof json === 'string') {
        const route = JSON.parse(json);
        return new Traffic(
          null,
          parseInt(route['Route Id'], 10),
          route['Planet Origin'],
          route['Planet Destination'],
          parseFloat(route['Traffic Delay (Light Years)'])
        );
      }
    }
  }
  