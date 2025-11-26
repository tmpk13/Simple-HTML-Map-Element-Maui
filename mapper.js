class Mapper {
    constructor(lat=0, long=0, zoom=0, marker_list=[]) {
        this.lat = lat;
        this.long = long;
        this.zoom = zoom;
        this.map;
        this.marker_list = marker_list;
    }
    draw_map() {
        this.map = L.map('map').setView([this.lat, this.long], this.zoom);
        var layer = new L.TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        this.map.addLayer(layer);
    }
    add_marker(lat, long) {
        var mark = new L.Marker([lat, long]);
        mark.addTo(this.map);
    }
    draw_marker_list(marker_list) {
        for (let i = 0; i < marker_list.length; i++) {
            var mark;
            
            if ( Array.isArray(marker_list[i]) ) {
                mark = new L.Marker([marker_list[i][0], marker_list[i][1]]);
                console.log(`Marker added at: ${marker_list[i]}`);
            }
            else {
                mark = new L.Marker([marker_list[i].lat, marker_list[i].long]);
                console.log(`Marker added at: ${marker_list[i]}`);
            }

            mark.addTo(this.map);
        }
    }
    draw_from_json(json_string) {
        var map_conf = JSON.parse(json_string);

        this.lat = map_conf.position.lat;
        this.long = map_conf.position.long;
        this.zoom = map_conf.position.zoom;

        this.draw_map();
        this.draw_marker_list(map_conf.markers);
    }
}

/* Basic Usage:

var map = new Mapper();
var json = `
{
    "position": {
        "lat": <map-lat>, 
        "long": <map-long>, 
        "zoom": <map-zoom>
    },
    "markers": [
        [<marker-lat>, <marker-long>],
        {"lat": "<marker-lat>", "long": "<marker-long>"}
    ]
}
`;

map.draw_from_json(json);

*/
