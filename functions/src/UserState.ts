import * as admin from "firebase-admin";
import { UserProfile } from "./UserProfile";
import { CreateJSONString } from "./JsonUtil";

export class UserState {
  public t: string | null;
  public s: string[] | null;
  public a: number;

  private _userProfile: UserProfile | null = null;

  constructor(
    obj: any | null = null,
    activeTest: string | null = null,
    activeSegments: string[] | null = null,
    lastAuthTime: number | null = null
  ) {
    if (obj) {
      this.t = obj.t;
      this.s = obj.s;
      this.a = obj.a;
    } else {
      this.t = activeTest;
      this.s = activeSegments;
      this.a = lastAuthTime as number;
    }

    if (this.t === undefined) {
      this.t = null;
    }
    if (this.s === undefined) {
      this.s = null;
    }
  }

  GetActiveTest(): string | null {
    return this.t;
  }

  SetActiveTest(value: string | null) {
    this.t = value;
  }

  GetActiveSegments(): string[] | null {
    return this.s;
  }

  SetActiveSegments(value: string[] | null) {
    this.s = value;
  }

  GetLastAuthTime(): number | null {
    return this.a;
  }

  SetLastAuthTime(value: number) {
    this.a = value;
  }

  GetAuthExpired(): boolean {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    return now - this.a > oneHour;
  }

  async GetUserProfile(
    docId: string,
    db: admin.database.Database
  ): Promise<UserProfile> {
    if (this._userProfile !== null) {
      return Promise.resolve(this._userProfile);
    }

    const refUserProfile = db.ref(`profiles/${docId}`);
    const snapshotUserProfile = await refUserProfile.once("value");
    this._userProfile = snapshotUserProfile.val() as UserProfile;
    if (this._userProfile === null) {
      this._userProfile = new UserProfile(null);
      await refUserProfile.set(this._userProfile);
    } else {
      this._userProfile = new UserProfile(this._userProfile);
    }

    return Promise.resolve(this._userProfile);
  }

  public ToJSONString(): string {
    return CreateJSONString(this);
  }
}
