export class Route {
    constructor(
      public id: string,
      public routeId: number,
      public planetOrigin: string,
      public planetDestination: string,
      public distance: number
    ) {}
  
    static createFromJSON(json: string): Route {
      if (typeof json === 'string') {
        const route = JSON.parse(json);
        return new Route(
          null,
          parseInt(route['Route Id'], 10),
          route['Planet Origin'],
          route['Planet Destination'],
          parseFloat(route['Distance(Light Years)'])
        );
      }
    }
  }
  