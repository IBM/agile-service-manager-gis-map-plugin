export const severityRank = {
    unknown: 0,
    clear: 1,
    indeterminate: 2,
    information: 3,
    warning: 4,
    minor: 5,
    major: 6,
    critical: 7
};

export const severityColors = {
    critical: '#da1e28',
    major: '#fc991e',
    minor: '#fdd13a',
    warning: '#408BFC',
    indeterminate: '#4F2196',
    information: '#054ADA'
};

export function propertySortHighToLow(propertyName, rankMap) {
    if (rankMap) {
        return function(a, b) {
            if (rankMap[a[propertyName]] > rankMap[b[propertyName]]) {
                return -1;
            }
            if (rankMap[a[propertyName]] < rankMap[b[propertyName]]) {
                return 1;
            }
            return 0;
        };
    }
    return function(a, b) {
        if (a[propertyName] > b[propertyName]) {
            return -1;
        }
        if (a[propertyName] < b[propertyName]) {
            return 1;
        }
        return 0;
    };
}

export function propertySortLowToHigh(propertyName, rankMap) {
    if (rankMap) {
        return function(a, b) {
            if (rankMap[a[propertyName]] < rankMap[b[propertyName]]) {
                return -1;
            }
            if (rankMap[a[propertyName]] > rankMap[b[propertyName]]) {
                return 1;
            }
            return 0;
        };
    }
    return function(a, b) {
        if (a[propertyName] < b[propertyName]) {
            return -1;
        }
        if (a[propertyName] > b[propertyName]) {
            return 1;
        }
        return 0;
    };
}