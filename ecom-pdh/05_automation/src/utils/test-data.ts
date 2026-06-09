export class TestDataGenerator {
  static generateEmail(prefix: string = 'auto'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefix}_${timestamp}_${random}@test.com`;
  }

  static generateUsername(prefix: string = 'user'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 5);
    return `${prefix}_${timestamp}_${random}`;
  }

  static generatePhone(): string {
    const suffix = Math.floor(Math.random() * 90000000) + 10000000;
    return `09${suffix}`;
  }

  static generateTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }
}
