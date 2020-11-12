export function addUniqueArrayValue(array, value) {
    if (array && Array.isArray(array)) {
        if(!array.includes(value)) {
            array.push(value);
        }
    }
    return array;
}

export function addUniqueArrayValues(array, values) {
    if (values && Array.isArray(values)) {
        values.forEach(value => {
            array = addUniqueArrayValue(array, value);
        })
    }
    return array;
}