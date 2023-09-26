class CustomError extends Error {
  constructor(message: string) {
    super(`Lorem "${message}" ipsum dolor.`)
    this.name = 'CustomError'
  }
}

export function foo() {
  // throw new CustomError('foo')
  // throw 123
  console.log(
    'FOosakljdsaldjsalkdjlsakdjlsakdjalskdjsalkdjlkasdjlkasjdlksadjlkasjdlksajdlkasjdlksajdlkjsalkdjaldjsalkdjlksadjlkasdjlaksdj'
  )

  try {
    foo()
  } catch (err) {
    // err is `unknown`
    const error = ensureError(err)
    console.log(error.message) // this will fail because we're not checking the `err` type
  }
}

export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value

  let stringified = '[Unable to stringify the thrown value]'
  try {
    stringified = JSON.stringify(value)
  } catch {}

  const error = new Error(`This value was thrown as is, not through an Error: ${stringified}`)
  return error
}
