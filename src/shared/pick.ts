const pick = <T extends Record<string, unknown>,U extends keyof T>(obj: T, keys: U[]) =>{
  const options:Partial<T>  = {} 
  for(const key of keys){
    if(obj && Object.hasOwnProperty.call(obj, key)){
      options[key] = obj[key]
    }
  }

  return options
}

export default pick