import {ReactNode, useState} from "react";
import MapTools from "./MapTools.tsx";
import "leaflet/dist/leaflet.css";
import '../../assets/styles/styles.css'
import {MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import {Icon, divIcon, point} from "leaflet";
import pointer from "../../assets/images/place.png";
import MarkerClusterGroup from "react-leaflet-cluster";
import {Cluster} from "../../assets/types/map/Cluster.ts";
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import DayNightTerminator from "./DayNightTerminator.tsx";
import GeoJsonComp from "./GeoJsonComp.tsx";

/**
 * Map component, decides how everything will look like and what attributes they should have.
 * Here we decide the size of icons, cluster and what map is visible.
 * TODO: Toggle for dark and lightmode with baselayer
 * Source: https://tmsvr.com/react-leaflet-map-performance-issues/
 * Source: https://egghead.io/lessons/react-customize-geojson-data-markers-with-a-react-leaflet-icon-image
 * Source: https://egghead.io/lessons/react-add-a-layerscontrol-toggle-to-switch-between-tilelayer-basemaps-in-react-leaflet
 * Further docs will come soon
 * @constructor
 */
export default function MapComponent() {

    const [markers, setMarkers] = useState<{ geocode: [number, number]; popUp: ReactNode }[]>([]);

    /**
     * Icon for markers
     */
    const customIcon = new Icon ( {
        iconUrl: pointer,
        iconSize: [72, 72],
        popupAnchor: [0, -30],
        shadowUrl: markerShadow,
        shadowAnchor: [13, 28]
    })

    /**
     * Cluster for icons (to bring several markers together)
     * @param cluster
     */
    const createCustomClusterIcon = (cluster: Cluster) => {
        return divIcon({
            html:
                `<div class="clusterIcon"><div class="clusterBox">
                        ${cluster.getChildCount()}             
                 </div></div>`,
            className: "custom-marker-cluster",
            iconSize: point(66, 66, true)
        });
    };


    const { BaseLayer } = LayersControl;

    return (
        <>
            <MapTools setMarkers={setMarkers} />
            <MapContainer
                center ={[48.8566, 2.3522]}
                zoom={3}
                worldCopyJump={true}
                attributionControl={false}
                // maxBounds={L.latLngBounds(new L.LatLng(200, -210), new L.LatLng(-200, 210))}
                // maxBoundsViscosity={0.5}
                >
                <GeoJsonComp/>
                <LayersControl>
                    <BaseLayer checked name ="OSM">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </BaseLayer>
                    <BaseLayer name ="Dark">
                        <TileLayer
                            attribution='© OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                    </BaseLayer>
                </LayersControl>
                <DayNightTerminator/>
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createCustomClusterIcon}
                >
                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker.geocode} icon={customIcon}>
                            <Popup>{marker.popUp}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </>
    )
};

/*

Esri:
<TileLayer
  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
/>

Open Street Maps:
<TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

CartoDB Dark Matter: Svart-kart
<TileLayer
  attribution='© OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>'
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>

CartoDB Positron: Hvit-kart
<TileLayer
  attribution='© OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>'
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>

import './styles.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer} from "react-leaflet";

const App: React.FC = () => {
    // NASA GIBS Viirs Earth At Night 2012 kartlag
    const nasaTileLayerUrl =
        "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg";

    // Definer `time`-variabelen
    const timeValue = "default"; // Velg en gyldig dato eller bruk "default"
    const tilematrixsetValue = "GoogleMapsCompatible_Level";

    return (
        <MapContainer
            center={[0, 0]} // Senter kartet på koordinater (0, 0)
            zoom={2} // Start med zoom-nivå 2
            style={{ height: "100vh", width: "100%" }} // Fullskjerm-stil
        >
            <TileLayer
                url={nasaTileLayerUrl
                    .replace("{time}", timeValue)
                    .replace("{tilematrixset}", tilematrixsetValue)
                    .replace("{maxZoom}", "8")
                    .replace("{format}", "jpg")}
                attribution='Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.'
                bounds={[
                    [-85.0511287776, -179.999999975],
                    [85.0511287776, 179.999999975],
                ]}
                minZoom={1}
                maxZoom={8}
            />
        </MapContainer>
    );
};

export default App;

/*

Esri:
<TileLayer
  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
/>

Open Street Maps:
<TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

CartoDB Dark Matter: Svart-kart
<TileLayer
  attribution='© OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>'
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>

CartoDB Positron: Hvit-kart
<TileLayer
  attribution='© OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>'
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
/>


 */

