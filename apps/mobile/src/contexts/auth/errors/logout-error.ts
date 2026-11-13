export default class LogoutError extends Error {
  constructor() {
    super('Failed to logout')
    this.name = 'LogoutError'
  }
}