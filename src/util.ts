export const isUnset = (o: unknown): boolean =>
  typeof o === 'undefined' || o === null

export const getIndex = (inputArray: any, id: string): number => {
  if (inputArray.length > 0) {
    return inputArray.indexOf(inputArray.find((el: any) => el.id === id))
  } else {
    return -1
  }
}
