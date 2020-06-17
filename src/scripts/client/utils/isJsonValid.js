export default function(jsonString) {
    try {
        JSON.parse(jsonString);
    } catch (e) {
        console.error('ERROR: Invalid JSON:- ' + jsonString);
        return false;
    }
    return true;
}
