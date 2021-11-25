export const Capitalize = (s: string): string => {
    const arr: string[] = s.split('')
    if (arr.length > 0) {
        arr[0] = arr[0].toUpperCase()
    }
    return arr.join('') as string
}

export function keysComparator(obj1: any, obj2: any, modelName: string) {
    for (let key in obj2) {
        if (!obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            throw new Error(`Property "${key}" does not exist on type ${Capitalize(modelName)}`)
        }
    }
    for (let key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            if (obj1[key].type !== typeof obj2[key]) {
                throw new Error(`Property "${key}" should be "${obj1[key].type}" type but got "${typeof obj2[key]}"`)
            }
        }
    }
}