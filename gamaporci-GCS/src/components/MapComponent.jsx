import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import AddMarker from "./AddMarker";

const MapComponent = ({
  coordinates = { lat: -7.773648529865574, lng: 110.37838175455724 },
  markers,
  onMarkersUpdate,
  selectedMission,
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [map, setMap] = useState(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Create map instance
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        minZoom: 4,
        maxZoom: 18,
      }).setView([coordinates.lat, coordinates.lng], 13);

      // Add zoom control
      L.control
        .zoom({
          position: "topright",
        })
        .addTo(mapInstance.current);

      // OPTION 1: Menggunakan Mapbox dengan access token yang valid
      const MAPBOX_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN"; // Ganti dengan token Anda
      // L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`, {
      //   attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
      //   maxZoom: 18,
      //   tileSize: 512,
      //   zoomOffset: -1,
      // }).addTo(mapInstance.current);

      // OPTION 2: Menggunakan Google Satellite (alternatif)
      // L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
      //   maxZoom: 20,
      //   subdomains: ["mt0", "mt1", "mt2", "mt3"],
      //   attribution: "© Google",
      // }).addTo(mapInstance.current);

      // OPTION 3: Menggunakan ESRI World Imagery (gratis)
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 25,
        }
      ).addTo(mapInstance.current);

      setMap(mapInstance.current);
    } else if (mapInstance.current) {
      mapInstance.current.setView([coordinates.lat, coordinates.lng], 13);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coordinates]);
  // Update map view ONLY when selected mission changes
  useEffect(() => {
    if (selectedMission && mapInstance.current) {
      if (selectedMission.coord?.[0]) {
        mapInstance.current.setView(selectedMission.coord[0], 13);
      }
    }
  }, [selectedMission]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        {map && (
          <AddMarker
            map={map}
            markers={markers}
            onMarkersUpdate={onMarkersUpdate}
            selectedMission={selectedMission}
          />
        )}
      </div>

      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-600">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
