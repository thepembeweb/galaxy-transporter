export class Planet {
    constructor(
      public id: string,
      public planetNode: string,
      public planetName: string
    ) {}
  
    static createFromJSON(json: string): Planet {
      if (typeof json === 'string') {
        const planet = JSON.parse(json);
        return new Planet(null, planet['Planet Node'], planet['Planet Name']);
      }
    }
  }
  