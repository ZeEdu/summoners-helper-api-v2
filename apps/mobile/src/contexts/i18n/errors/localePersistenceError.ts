export default class LocalePersistenceError extends Error {
  constructor() {
    super('Failed to persist locale')
    this.name = 'LocalPersistenceError'
  }
}