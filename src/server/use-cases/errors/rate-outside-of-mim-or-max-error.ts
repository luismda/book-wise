export class RateOutsideOfMimOrMaxError extends Error {
  constructor() {
    super('Rate of rating is outside of min or max value.')
  }
}
