import { pickBy, identity } from 'lodash-es'

/**
* Remove all falsey values in object.
* TODO :: empty object : {}
* https://stackoverflow.com/questions/30812765/how-to-remove-undefined-and-null-values-from-an-object-using-lodash
*/
export const omitNil = (values) => pickBy(values, identity)
