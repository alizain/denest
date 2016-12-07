export const el = document

export function dispatch(name) {
  const event = new window.Event(name)
  el.dispatchEvent(event)
}
