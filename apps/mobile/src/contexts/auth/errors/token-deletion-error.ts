export default class TokenDeletionError extends Error {
  constructor() {
    super('Failed to delete tokens')
    this.name = 'TokenDeletionError'
  }
}