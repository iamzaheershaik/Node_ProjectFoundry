/**
 * Merge class names conditionally
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format a Firestore timestamp to readable date
 */
export function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Truncate text to a given length
 */
export function truncate(text, length = 100) {
  if (!text || text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Debounce a function
 */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Format number with commas (Indian system)
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num)
}
