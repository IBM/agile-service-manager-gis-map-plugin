// Allow for an array of possible property names to be passed
// and returns the value for the first matching property.
export default function getProvidedValue(propertyNames, data) {
    let value = null;
    if (propertyNames && Array.isArray(propertyNames) && data) {
        for(let i = 0; i < propertyNames.length && value === null; i++) {
            const propName = propertyNames[i];
            if (propName && data.hasOwnProperty(propName) && data[propName] !== '' && data[propName] !== null) {
                value = data[propName];
            }
        }
    }
    return value;
}