import uniqid from "uniqid";

export function generateTransactionId(): string {
  return uniqid("tx");
}

export function generatePassword(): string {
  let pass = "";
  const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 10; i++) {
    const char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}

export function getObjectIdFromDate(date: Date): string {
  const objectId = Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
  return objectId;
}

export function getDateFromObjectId(objectId: string): Date {
  const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
  return new Date(timestamp);
}

export function isCollectionEmpty(collectionName: string | null | undefined): boolean {
  return !collectionName || collectionName.length === 0;
}

export function isDateValid(date: Date | null | undefined): boolean {
  return date instanceof Date && !isNaN(date.valueOf());
}

export function findJsonInJsonArray<T>(list: { [key: string]: T }[], value: T, keyToSearch: string): boolean {
  for (const element of list) {
    if (element[keyToSearch] === value) {
      return true;
    }
  }
  return false;
}

export function addJson<T>(obj: Record<string, T>, key: string, value: T): Record<string, T> {
  obj[key] = value;
  return obj;
}

export function getImageFormat(buffer: Buffer) {
  // Define known image format signatures
  const formatSignatures = [
    { signature: [0xff, 0xd8, 0xff], format: "jpeg" },
    { signature: [0x89, 0x50, 0x4e, 0x47], format: "png" },
    { signature: [0x47, 0x49, 0x46], format: "gif" },
    // Add more format signatures as needed
  ];

  // Compare the first few bytes of the buffer with known signatures
  for (const { signature, format } of formatSignatures) {
    if (signature.every((value, index) => value === buffer[index])) {
      return format;
    }
  }
}
