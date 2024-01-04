export class UserState {
  t: string | null;
  s: string[] | null;
  a: number;

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
}
