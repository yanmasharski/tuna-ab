import { UserProfile } from "../../UserProfile";

export class Trigger {
  public eventType: EventType;
  public event: number;
  public ads: number;
  public iap: number;
  public progress: number;
  public geoLocation: string;
  constructor(
    obj: Trigger | null,
    eventType: EventType | null = null,
    event: number | null = null,
    ads: number | null = null,
    iap: number | null = null,
    progress: number | null = null,
    geoLocation: string | null = null
  ) {
    if (obj) {
      this.eventType = obj.eventType;
      this.event = obj.event;
      this.ads = obj.ads;
      this.iap = obj.iap;
      this.progress = obj.progress;
      this.geoLocation = obj.geoLocation;
    } else {
      this.eventType = eventType as EventType;
      this.event = event as number;
      this.ads = ads as number;
      this.iap = iap as number;
      this.progress = progress as number;
      this.geoLocation = geoLocation as string;
    }
  }

  // TODO create successor classes
  public Fits(userProfile: UserProfile): boolean {
    switch (this.eventType) {
      case EventType.Eventual:
        if (userProfile.events.find((e) => e.id == this.event) !== null) {
          return true;
        }
        break;

      case EventType.Conditional:
        let fits = true;
        if (this.ads !== -1) {
          fits &&= userProfile.ads >= this.ads;
        }

        if (this.iap !== -1) {
          fits &&= userProfile.iap >= this.iap;
        }

        if (this.progress !== -1) {
          fits &&= userProfile.progress >= this.progress;
        }

        return fits;

        break;

      case EventType.Geo:
        return this.geoLocation == userProfile.geo;
        break;
    }
    return false;
  }
}

export enum EventType {
  Unknown = 0,
  Eventual = 1,
  Conditional = 2,
  Geo = 3,
}
