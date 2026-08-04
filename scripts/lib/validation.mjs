export class ValidationReport {
  #errors = [];
  #warnings = [];

  error(code, message, details = undefined) { this.#errors.push({ code, message, details }); }
  warn(code, message, details = undefined) { this.#warnings.push({ code, message, details }); }
  assert(condition, code, message, details = undefined) { if (!condition) this.error(code, message, details); }

  get errors() { return [...this.#errors]; }
  get warnings() { return [...this.#warnings]; }
  get ok() { return this.#errors.length === 0; }

  finish(label) {
    for (const warning of this.#warnings) console.warn(`WARN ${warning.code}: ${warning.message}`);
    if (!this.ok) {
      for (const error of this.#errors) console.error(`ERROR ${error.code}: ${error.message}`);
      throw new Error(`${label} failed with ${this.#errors.length} error(s)`);
    }
    console.log(`${label}: passed${this.#warnings.length ? ` with ${this.#warnings.length} warning(s)` : ""}`);
  }
}
