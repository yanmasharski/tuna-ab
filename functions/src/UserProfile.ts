import { Event } from "./Event";
import { CreateJSONString, CreateSerializableObject } from "./JsonUtil";

export class UserProfile {
  public events: Event[];
  public geo: string;
  public progress: number;
  public iap: number;
  public ads: number;

  constructor(
    obj: any | null,
    events: any[] | null = null,
    geo: string | null = null,
    progress: number | null = null,
    iap: number | null = null,
    ads: number | null = null
  ) {
    if (obj) {
      this.events = obj.events;
      this.geo = obj.geo;
      this.progress = obj.progress;
      this.iap = obj.iap;
      this.ads = obj.ads;
    } else {
      this.events = events as Event[];
      this.geo = geo as string;
      this.progress = progress as number;
      this.iap = iap as number;
      this.ads = ads as number;
    }

    if (events === undefined || events === null) {
      events = [];
    }
  }

  public ToJSONString(): string {
    return CreateJSONString(this);
  }

  public ToSerializable(): any {
    return CreateSerializableObject(this);
  }
}
