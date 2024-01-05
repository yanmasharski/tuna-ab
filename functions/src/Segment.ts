import { Trigger } from "./Trigger";
import { UserProfile } from "./UserProfile";

export class Segment {
  public id: string;
  public triggers: Trigger[];
  constructor(
    obj: any | null,
    id: string | null = null,
    triggers: Trigger[] | null = null
  ) {
    if (obj) {
      this.id = obj.id;
      this.triggers = [];
      (obj.triggers as Trigger[]).forEach((t) => {
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
