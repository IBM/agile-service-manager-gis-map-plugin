export default function findLocationType({view, location}) {
    let type = '';
    for(let i = 0; i < location.entityTypes.length && type === ''; i++) {
        if (view.markerTypes[location.entityTypes[i]]) {
            type = location.entityTypes[i];
        }
    }
    return type;
}