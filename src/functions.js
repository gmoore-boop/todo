export function deepComparision (objA, objB, visited = new WeakMap()){
  //handling nulls
  if (objA===null && objB===null) return true; 
  if (objA===null && objB!==null) return false;

  //handling undefined
  if (objA===undefined && objB===undefined) return true; 
  if (objA===undefined && objB!==undefined) return false;

  // handling NaN 
  if (Number.isNaN(objA) && Number.isNaN(objB)) return true;

  // handling date
  if (objA instanceof Date && objB instanceof Date) {
    return objA.getTime() === objB.getTime();
  }

  //handling 0 and -0
  if ( (objA===0 && objB===-0) || (objB===0 && objA===-0)) return false; 


  //handling non objects 
  if (typeof objA !== "object" || objA === null ||
      typeof objB !== "object" || objB === null) return objA===objB;

  //circular protection 
  if (visited.has(objA)) {
    return visited.get(objA) === objB;
  }
  visited.set(objA, objB);

  //handling different prototypes 
  if (Object.getPrototypeOf(objA) !== Object.getPrototypeOf(objB)) {
  return false;
  }

  //check if all the keys match 
  const keysA = Object.keys(objA); 
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA){
    if (!keysB.includes(key)) return false; 
  }

  for (const key of keysA){
    if (!deepComparision (objA[key], objB[key], visited)) return false;
  }
  return true; 
}



