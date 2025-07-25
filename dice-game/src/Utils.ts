export class Utils {
  static isEmpty(value: string | undefined): boolean {
    return value === undefined || value.trim() === "";
  }
}
