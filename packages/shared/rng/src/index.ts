export class DeterministicRng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  nextFloat(): number {
    this.state ^= this.state << 13;
    this.state ^= this.state >>> 17;
    this.state ^= this.state << 5;
    const next = this.state >>> 0;
    return next / 4294967295;
  }

  nextInt(maxExclusive: number): number {
    if (maxExclusive <= 0) {
      throw new Error("maxExclusive must be greater than zero");
    }

    return Math.floor(this.nextFloat() * maxExclusive);
  }

  snapshot(): number {
    return this.state >>> 0;
  }
}