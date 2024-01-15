import { UserProfile } from "../../UserProfile";
import { Trigger, EventType } from "./Trigger";

// Successor class for a specific type of event
export class SpecificEventTrigger extends Trigger {
  // Additional properties or methods specific to the SpecificEventTrigger
  public specificProperty: string;

  constructor(
    obj: Trigger | null,
    eventType: EventType | null = null,
    event: number | null = null,
    ads: number | null = null,
    iap: number | null = null,
    progress: number | null = null,
    geoLocation: string | null = null,
    specificProperty: string | null = null
  ) {
    // Call the parent constructor
    super(obj, eventType, event, ads, iap, progress, geoLocation);
    // Initialize SpecificEventTrigger properties
    this.specificProperty = specificProperty as string;
  }

  // Override or add new methods
  public Fits(userProfile: UserProfile): boolean {
    // You can call the superclass method if needed
    const baseFits = super.Fits(userProfile);
    // Add additional logic for SpecificEventTrigger
    // ...

    return baseFits && this.additionalCondition();
  }

  private additionalCondition(): boolean {
    // Additional condition logic specific to SpecificEventTrigger
    // ...
    return true;
  }
}
