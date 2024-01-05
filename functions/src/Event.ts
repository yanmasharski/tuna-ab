export class Event {
  public id: number;
  public time: number;
  public value: number;

  constructor(id: number, time: number, value: number) {
    this.id = id;
    this.time = time;
    this.value = value;
  }
}
