export function Log(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    console.log(`[LOG] ${String(propertyKey)} called with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`[LOG] ${String(propertyKey)} returned:`, result);
    return result;
  };
}

export function MeasureTime(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    const start = Date.now();
    try {
      return originalMethod.apply(this, args);
    } finally {
      console.log(`[TIME] ${String(propertyKey)}: ${Date.now() - start}ms`);
    }
  };
}

export function ValidateSpellPower(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    const candidate = args[0];

    if (typeof candidate === "object" && candidate !== null && "power" in candidate) {
      const power = (candidate as Record<string, unknown>)["power"];

      if (typeof power === "number" && power < 0) {
        throw new Error("Spell power cannot be negative");
      }
    }

    return originalMethod.apply(this, args);
  };
}

export function Cache(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;
  const instanceCaches = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (this: object, ...args: unknown[]): unknown {
    let cache = instanceCaches.get(this);

    if (!cache) {
      cache = new Map<string, unknown>();
      instanceCaches.set(this, cache);
    }

    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`[CACHE HIT] ${String(propertyKey)}`);
      return cache.get(key);
    }

    console.log(`[CACHE MISS] ${String(propertyKey)}`);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
