export function applyDateTimeNow() {
  const inputs = document.querySelectorAll(
    'input[cstmtag-datetime-now="true"]'
  )

  if (!inputs.length) return

  const now = new Date()
  const localNow = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  )

  inputs.forEach((input) => {
    // Do nothing if value already exists
    if (input.value) return

    const type = input.type

    if (type === 'datetime-local') {
      input.value = localNow.toISOString().slice(0, 16)
      return
    }

    if (type === 'date') {
      input.value = localNow.toISOString().slice(0, 10)
      return
    }

    if (type === 'datetime') {
      input.value = localNow.toISOString()
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyDateTimeNow)
} else {
  applyDateTimeNow()
}