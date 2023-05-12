export class RateOutsideOfMimAndMaxError extends Error {
  constructor() {
    super('Rate of rating is outside of min and max value.')
  }
}
