export const target = Symbol('target')

export default function (obj) {
  const map = new WeakMap()
  const p = new Proxy(obj, {
      get (targetObj, property) {
        if (property === target) {
          return targetObj
        }

        const prop = targetObj[property]
        if (typeof prop === 'function') {
          if (map.has(prop)) {
            return map.get(prop)
          } else {
            let f = function () {
              prop.apply(targetObj, arguments)
              return p
            }
            map.set(prop, f)
            return f
          }
        } else {
          return targetObj[property]
        }
      },
      apply (targetObj, thisArg, argumentList) {
        targetObj.apply(thisArg, argumentList)
        return p
      }
    })

  return p
}
