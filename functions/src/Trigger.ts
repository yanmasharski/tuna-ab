import { UserProfile } from "./UserProfile";

export class Trigger {
  public eventType: EventType;
  public event: string;
  public revenue: number;
  public progress: number;
  public geoLocation: string;
  constructor(
    obj: any | null,
    eventType: EventType | null = null,
    event: string | null = null,
    revenue: number | null = null,
    progress: number | null = null,
    geoLocation: string | null = null
  ) {
    if (obj) {
      this.eventType = obj.eventType;
      this.event = obj.event;
      this.revenue = obj.revenue;
      this.progress = obj.progress;
      this.geoLocation = obj.geoLocation;
    } else {
      this.eventType = eventType as EventType;
      this.event = event as string;
      this.revenue = revenue as number;
      this.progress = progress as number;
      this.geoLocation = geoLocation as string;
    }
  }

  public Fits(userProfile: UserProfile): boolean {
    // Add your conditions here to check if the user fits the trigger
    // For example, if the trigger is based on revenue:
    // if (this.revenue && userProfile.revenue < this.revenue) {
    //   return false;
    // }
    // Add more conditions based on the other properties of the trigger
    // ...
    // If none of the conditions were met, the user fits the trigger
    return true;
  }
}

enum EventType {
  Unknown = 0,
  Eventual = 1,
  Conditional = 2,
  Geo = 3,
}
