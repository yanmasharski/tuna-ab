import * as admin from "firebase-admin";
import { UserProfile } from "./UserProfile";
import { CreateJSONString, CreateSerializableObject } from "./JsonUtil";
import * as logger from "firebase-functions/logger";

export class UserState {
  public t: string | null;
  public s: string[] | null;
  public a: number;

  private _userProfile: UserProfile | null = null;
  private _docId: string;
  private _db: admin.database.Database;

  constructor(
    db: admin.database.Database,
    docId: string,
    obj: any | null = null,
    activeTest: string | null = null,
    activeSegments: string[] | null = null,
    lastAuthTime: number | null = null
  ) {
    this._docId = docId;
    this._db = db;
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

  async GetUserProfile(): Promise<UserProfile> {
    if (this._userProfile !== null) {
      return Promise.resolve(this._userProfile);
    }

    let refUserProfile = this._db.ref("pr").child(this._docId);
    const snapshotUserProfile = await refUserProfile.once("value");
    let userProfileString = snapshotUserProfile.val();
    logger.info("this._userProfile" + userProfileString);
    if (!userProfileString) {
      this._userProfile = new UserProfile(null);
      refUserProfile = this._db.ref("pr").child(this._docId);
      await refUserProfile.set(this._userProfile.ToJSONString()).catch((e) => {
        if (e !== null) {
          logger.error(e as Error);
        }
      });
      logger.info("refUserProfile.set:" + this._docId);
    } else {
      this._userProfile = new UserProfile(JSON.parse(userProfileString));
      logger.info("UserProfile.parse:" + this._userProfile.geo);
    }

    return Promise.resolve(this._userProfile);
  }

  public ToJSONString(): string {
    return CreateJSONString(this);
  }

  public ToSerializable(): any {
    return CreateSerializableObject(this);
  }
}
