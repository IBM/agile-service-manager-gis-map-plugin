export default function addUrlParams(url, propsArray, paramName) {
    let updateUrl = url;
    if (url && propsArray && Array.isArray(propsArray) && paramName) {
        propsArray.forEach( prop => {
            updateUrl += '&' + paramName + '=' + prop
        });
    }
    return updateUrl;
}