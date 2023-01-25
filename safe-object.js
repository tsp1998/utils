const object1 = {
  name: 'shubham',
  'role.type': 'admin',
  address: {
    road: 'main',
    area: {
      landmark: 'abc',
      a: {
        b: 'c'
      }
    }
  }
}

const object2 = {
  name: 'shubham',
  'role.type': 'admin',
  address: {
    road: 'main',
    area: {
      landmark: 'abc',
      a: JSON.stringify({
        b: 'c'
      })
    }
  }
}

// type propPattern = 'success' | 'success.data' | 'success.optionalData'

const selectProp = (object, propPattern = '') => {
  if (!object || !propPattern) {
    return
  }
  
  if (object[propPattern]) {
    return object[propPattern]
  }

  /* strategy 2 working */
  let match;
  let remainingPropPattern = ''
  let foundSomething = false
  do {
    match = propPattern.match(/(.*)\.(.*)/)
    if (match) {
      propPattern = match[1]
      remainingPropPattern = `${match[2]}.${remainingPropPattern}`
      if (object[propPattern]) {
        if (!remainingPropPattern) {
          return object[propPattern]
        } else {
          foundSomething = true
          break
        }
      }
    }
  } while (match);

  if (foundSomething) {
    remainingPropPattern = remainingPropPattern.slice(0, -1)
    // console.log(`propPattern`, propPattern)
    // console.log(`remainingPropPattern`, remainingPropPattern)
    let newObject = object[propPattern];
    try {
      newObject = JSON.parse(newObject)
    } catch (error) {}
    return selectProp(newObject, remainingPropPattern)
  }
  /* strategy 2 working */

  /* strategy 1 not working */
  // const props = propPattern.split('.')
  // for (let i = 0; i < props.length; i++) {
  //   try {
  //     object = object[props[i]]
  //     if (typeof object === 'string') {
  //       try {
  //         object = JSON.parse(object)
  //       } catch (error) { }
  //     }
  //   } catch (error) {
  //     console.log(`error`, error.message)
  //     return
  //   }
  // }
  // return object
  /* strategy 1 not working */
}

const insertObject = (object) => {
  const newObject = {}
  for (const key in object) {
    if (typeof object[key] === 'object') {
      for (const key2 in object[key]) {
        newObject[`${key}.${key2}`] = object[key][key2]
      }
    } else {
      newObject[key] = object[key]
    }
  }
  return newObject
}

console.log(selectProp(object1, 'name'))
console.log(selectProp(object1, 'role.type'))
console.log(selectProp(object1, 'address.area.landmark'))
console.log(selectProp(object1, 'address.area.a'))
console.log(selectProp(object1, 'address.area.a.b'))
console.log(selectProp(object1, 'name'))

console.log(selectProp(object2, 'role.type'))
console.log(selectProp(object2, 'address.area.landmark'))
console.log(selectProp(object2, 'address.area.a'))
console.log(selectProp(object2, 'address.area.a.b'))

console.log(selectProp(insertObject(object1), 'role.type'))
console.log(selectProp(insertObject(object1), 'address.area.landmark'))
console.log(selectProp(insertObject(object1), 'address.area.a'))
console.log(selectProp(insertObject(object1), 'address.area.a.b'))