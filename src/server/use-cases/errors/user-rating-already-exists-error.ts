export class UserRatingAlreadyExistsError extends Error {
  constructor() {
    super('User rating already exists to this book.')
  }
}
