export function CreateJSONString(obj: any): string {
  return JSON.stringify(CreateSerializableObject(obj));
}

export function CreateSerializableObject(obj: any): any {
  const filteredObject = { ...obj }; // Create a shallow copy of the object

  // Exclude private fields
  for (const key in filteredObject) {
    if (filteredObject.hasOwnProperty(key) && key.startsWith("_")) {
      delete filteredObject[key];
    }
  }

  return filteredObject;
}
