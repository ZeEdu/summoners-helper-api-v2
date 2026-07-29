type Listener = () => void;
const listeners = new Set<Listener>();

export const AuthEvents = {
  onSessionExpired: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener)
    }
  },
  emitSessionExpired: () => {
    listeners.forEach((listener) => {
      return listener()
    })
  }
}
