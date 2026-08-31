/** A URL-ish id from a label, unique against the ids already in `categories`. */
export function slugId(label, categories) {
  const base =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'category'
  const taken = new Set(categories.map((c) => c.id))
  let id = base
  let n = 2
  while (taken.has(id)) id = `${base}-${n++}`
  return id
}
