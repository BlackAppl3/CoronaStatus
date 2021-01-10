import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "./Map.css"


function DisplayMap({center, zoom}) {
    console.log("INSIDE", center)
    console.log("INSIDE", zoom)
    // center  = {lat: 21, lng: 105.8}
    return (
        <div className="map">
           <MapContainer className="markercluster-map" center={center} zoom={zoom}>
              <TileLayer
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
          </MapContainer>
        </div>
    )
}

export default DisplayMap
