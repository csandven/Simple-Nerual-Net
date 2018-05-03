
/**
 * Returns a random floating point number between two given numbers
 * @param  {int} a
 * @param  {int} b
 * @return {int}
 */
export const random = (a,b) => +(Math.random() * (a - b) + b).toFixed(4)