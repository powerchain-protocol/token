export class InvariantError extends Error {
  readonly code: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(code: string, message: string, details?: Readonly<Record<string, unknown>>) {
    super(message);
    this.name = "InvariantError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(
  condition: unknown,
  code: string,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): asserts condition {
  if (!condition) throw new InvariantError(code, message, details);
}

export function assertNever(value: never, context = "unexpected variant"): never {
  throw new InvariantError("UNREACHABLE", context, { value });
}
