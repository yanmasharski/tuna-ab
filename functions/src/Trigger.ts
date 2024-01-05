import { UserState } from "./UserState";

export class Trigger {
  constructor(
    public eventType: EventType,
    public event?: string,
    public revenue?: number,
    public progress?: number,
    public geoLocation?: string
  ) {}

  public Fits(userProfile: UserState): boolean {
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
  Eventual = "e",
  Conditional = "c",
  Geo = "g",
}
