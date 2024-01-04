import { Trigger } from "./Trigger";
import { UserState } from "./UserState";

export class Segment {
  constructor(public id: string, public triggers: Trigger[]) {}

  public Fits(userProfile: UserState): boolean {
    for (let trigger of this.triggers) {
      if (!trigger.Fits(userProfile)) {
        return false;
      }
    }
    return true;
  }
}
