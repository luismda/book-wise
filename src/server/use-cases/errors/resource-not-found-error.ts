export class ResourceNotFoundError extends Error {
  constructor(resource: string) {
    super(`Resource not found: ${resource}`)
  }
}
