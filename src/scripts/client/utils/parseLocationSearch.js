export default function parseLocationSearch(queryString) {
    var queryStringDecoded = decodeURIComponent(queryString);
    var urlQuery = queryStringDecoded.substr((queryStringDecoded[0] === '?' ? 1 : 0));
    var searchObject = {};
    var keyValuePairs = urlQuery.split('&');
    var i;
    var keyValuePair;

    for (i in keyValuePairs) {
        if (keyValuePairs[i] !== '') {
            keyValuePair = keyValuePairs[i].split('=');
            searchObject[keyValuePair[0]] = keyValuePair[1];
        }
    }
    return searchObject;
}