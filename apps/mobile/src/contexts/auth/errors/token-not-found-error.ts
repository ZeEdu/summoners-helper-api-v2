export default class TokenNotFoundError extends Error {
  constructor() {
    super('Failed to retrieve tokens')
    this.name = 'TokenNotFoundError'
  }
}