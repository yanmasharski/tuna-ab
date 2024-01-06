import { Trigger } from "./Trigger";
import { UserProfile } from "./UserProfile";

export class Segment {
  public id: string;
  public triggers: Trigger[] = [];
  constructor(
    obj: Segment | null,
    id: string | null = null,
    triggers: Trigger[] | null = null
  ) {
    if (obj) {
      this.id = obj.id;
      let tempTriggers = obj.triggers as Trigger[];
      tempTriggers.forEach((t) => {
        this.triggers.push(new Trigger(t));
      });
    } else {
      this.id = id as string;
      this.triggers = triggers as Trigger[];
    }
  }

  public Fits(userProfile: UserProfile): boolean {
    for (let trigger of this.triggers) {
      if (!trigger.Fits(userProfile)) {
        return false;
      }
    }
    return true;
  }
}
