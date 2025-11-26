/*
* Simple leaflet wrapper using openstreetmaps
*/

class Mapper {
    constructor(lat=0, long=0, zoom=0, marker_list=[]) {
        // Inital map settings
        this.lat = lat;
        this.long = long;
        this.zoom = zoom;

        this.map = null;
        // List of markers to draw on the map
        this.marker_list = marker_list;
        // Style to use for map div element (Default: is full screen)
        this.style = `
            display: block;
            position: absolute;
            top:0;
            left: 0;
            height: 100vh;
            width: 100vw;
            margin: 0;
        `;
        // Id to give to div element for displaying the map
        this.map_display_div_id = "map-display-div-id";
        // Wether or not to create a div in html document for map 
        this.create_div = true;

        // Whether or not leaflet should be added
        this.add_leaflet = true;
        this.leaflet_js_src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        this.leaflet_css_src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        // Add dependencies
        
        this.leaf_script = this.#add_deps();
        
    }
    // Load script from src then run callback when it is loaded
    #add_deps() {
        // Add leaflet resources
        if ( this.add_leaflet ) {
            let leaflet_css = document.createElement('link');
            leaflet_css.setAttribute('rel', "stylesheet");
            leaflet_css.setAttribute('href', this.leaflet_css_src);
            document.head.prepend(leaflet_css);
        
            let leaflet_js = document.createElement('script');
            leaflet_js.setAttribute('src', this.leaflet_js_src);
            document.head.prepend(leaflet_js);
            this.leaf_script = leaflet_js;

            return leaflet_js
        }
        return document.createElement('script');
    }
    #draw_map() {
        /*
        * Draw map to HTML div element
        */
        // Create the map element in HTML document
        if ( this.create_div ) {
            let div = document.createElement('div');
            div.setAttribute('id', this.map_display_div_id);
            div.setAttribute('style', this.style);
            document.body.appendChild(div);
        }
        // Create leaflet map
        this.map = L.map(this.map_display_div_id).setView([this.lat, this.long], this.zoom);
        var layer = new L.TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        this.map.addLayer(layer);
        // If there is a list of markers avalible add them
        if ( this.marker_list.length > 0 ) 
        {
            this.add_marker_list(this.marker_list);
        }
        
    }
    draw_map() {
        this.leaf_script.onload = () => {
            this.#draw_map()
        }
    }
    draw(json_string=null)
    {
        /*
        * Draw map wrapper
        */
        if ( json_string === null ) {
            this.draw_map();
        }
        else {
            this.draw_from_json(json_string);
        }
    }
    #add_marker(lat, long) {
        /*
        * Add marker at latitude and longitude given to current map
        */
        var mark = new L.Marker([lat, long]);
        mark.addTo(this.map);
        
    }
    add_marker(lat, long) {
        /*
        * Add marker at latitude and longitude given to current map
        */
        this.leaf_script.onload = () => {
            this.#add_marker(lat, long);
        }
    }
    #add_marker_list(marker_list) {
        /*
        * Add markers to current map
        */
        for (let i = 0; i < marker_list.length; i++) {
            var mark;
            // If marker is defined as a list [lat, long]
            if ( Array.isArray(marker_list[i]) ) {
                mark = this.#add_marker(marker_list[i][0], marker_list[i][1]);
            }
            // Otherwise marker is an object {"lat":float,"long":float}
            else {
                mark = this.#add_marker(marker_list[i].lat, marker_list[i].long);
            }
            // Add marker
            mark.addTo(this.map);
        }
    }
    add_marker_list(marker_list) {
        this.leaf_script.onload = () => {
            this.add_marker_list(marker_list)
        }
    }
    #draw_from_json(json_string) {
        /*
        * Draw map from json config
        */
        // Parse json input from string
        var map_conf = JSON.parse(json_string);

        // Get inital settings from json
        this.lat = map_conf.position.lat;
        this.long = map_conf.position.long;
        this.zoom = map_conf.position.zoom;

        // Draw the map
        this.draw_map();

        // Add markers to map
        if ( map_conf.markers.length > 0 )
        {
            this.#add_marker_list(map_conf.markers);
        }
    }
    draw_from_json(json_string) {
        this.leaf_script.onload = () => {
            this.#draw_from_json(json_string);
        }
    }
}
