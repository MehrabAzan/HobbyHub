const STORAGE_KEY = 'gamehub_user_id'

export function GetUserId() {
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export function FormatUserId(id) {
  if (!id) return 'anonymous'
  return id.slice(0, 8)
}
