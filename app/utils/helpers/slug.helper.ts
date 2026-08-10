const ALPHANUMERIC = 'abcdefghijklmnopqrstuvwxyz0123456789'

export const generateRandomString = (length = 5) =>
  Array.from({ length }, () => ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)]).join(
    ''
  )
