export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function valueExist(value) {
  if (value === '' || value === undefined || value === null || isNaN(value)) {
    return false
  } else {
    return true
  }
}
