import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

const AddMarker = ({ map, markers, onMarkersUpdate, selectedMission }) => {
  const drawnItemsRef = useRef(null);
  const markersRef = useRef([]); // To store markers in memory
  const [isMarkerMode, setIsMarkerMode] = useState(false);
  const buttonContainerRef = useRef(null);
  const polylineRef = useRef(null);

  // Function to draw polyline between markers
  const drawPolyline = (markersList = markersRef.current) => {
    try {
      // Remove existing polylines
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
      }

      // Draw new polyline if we have at least 2 markers
      if (markersList.length >= 2) {
        const coordinates = markersList.map((marker) => marker.getLatLng());
        polylineRef.current = L.polyline(coordinates, {
          color: "#4285F4",
          weight: 4,
          opacity: 1,
        }).addTo(map);
      }
    } catch (error) {
      console.error("Error drawing polyline:", error);
    }
  };

  // Clear all layers and markers
  const clearAllLayers = () => {
    try {
      // Remove all markers from the map
      markersRef.current.forEach((marker) => {
        map.removeLayer(marker);
      });

      // Clear drawn items
      if (drawnItemsRef.current) {
        drawnItemsRef.current.clearLayers();
      }

      // Remove polyline
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
      }

      // Reset markers array
      markersRef.current = [];

      // Update parent component's markers
      onMarkersUpdate([]);
    } catch (error) {
      console.error("Error clearing layers:", error);
    }
  };

  // Load markers from selectedMission
  useEffect(() => {
    if (!map || !selectedMission) return;

    try {
      // Clear previous layers and markers before rendering new ones
      clearAllLayers();
      markersRef.current = [];

      if (selectedMission.coord && selectedMission.coord.length > 0) {
        const newMarkers = selectedMission.coord.map(([lat, lng]) => {
          const marker = L.marker([lat, lng], { draggable: true });

          marker.on("drag", () => {
            drawPolyline();
            onMarkersUpdate([...markersRef.current]);
          });

          // Add popup with coordinates
          marker.bindPopup(`Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`);

          marker.addTo(map);
          return marker;
        });

        // Update markersRef and parent component
        markersRef.current = newMarkers;
        onMarkersUpdate(newMarkers);
        drawPolyline(newMarkers);
      }
    } catch (error) {
      console.error("Error loading mission markers:", error);
    }
  }, [map, selectedMission]);

  // Initialize map layers (set up drawnItems group and polyline)
  useEffect(() => {
    if (!map) return;

    try {
      drawnItemsRef.current = new L.FeatureGroup().addTo(map);

      return () => {
        clearAllLayers();
      };
    } catch (error) {
      console.error("Error initializing map layers:", error);
    }
  }, [map]);

  // Map click handler to add markers when in marker mode
  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e) => {
      if (!isMarkerMode) return;

      // Prevent adding marker when clicking on buttons
      if (buttonContainerRef.current) {
        const rect = buttonContainerRef.current.getBoundingClientRect();
        if (
          e.originalEvent.clientX >= rect.left &&
          e.originalEvent.clientX <= rect.right &&
          e.originalEvent.clientY >= rect.top &&
          e.originalEvent.clientY <= rect.bottom
        ) {
          return;
        }
      }

      try {
        const marker = L.marker(e.latlng, {
          draggable: true,
        });

        marker.on("drag", () => {
          const newLatLng = marker.getLatLng();
          marker.setPopupContent(
            `Lat: ${newLatLng.lat.toFixed(5)}<br>Lng: ${newLatLng.lng.toFixed(
              5
            )}`
          );
          drawPolyline();
          onMarkersUpdate([...markersRef.current]);
        });

        marker.bindPopup(
          `Lat: ${e.latlng.lat.toFixed(5)}<br>Lng: ${e.latlng.lng.toFixed(5)}`
        );
        marker.addTo(map);

        markersRef.current.push(marker);
        onMarkersUpdate([...markersRef.current]);
        drawPolyline();
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, isMarkerMode]);

  const deleteMarker = (index) => {
    try {
      if (index >= 0 && index < markersRef.current.length) {
        const marker = markersRef.current[index];
        map.removeLayer(marker);
        markersRef.current = markersRef.current.filter((_, i) => i !== index);
        onMarkersUpdate([...markersRef.current]);
        drawPolyline();
      }
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  };

  const clearMarkers = (showConfirm = true) => {
    const proceedWithClear = showConfirm
      ? window.confirm("Hapus semua marker?")
      : true;
    if (proceedWithClear) {
      try {
        clearAllLayers();
        onMarkersUpdate([]); // Update parent component with empty markers array
      } catch (error) {
        console.error("Error clearing markers:", error);
      }
    }
  };

  const toggleMarkerMode = () => {
    setIsMarkerMode(!isMarkerMode);
    map.getContainer().style.cursor = !isMarkerMode ? "crosshair" : "";
  };

  // Expose deleteMarker function globally
  if (typeof window !== "undefined") {
    window.deleteMarker = deleteMarker;
  }

  return (
    <div className="absolute top-6 right-0 w-[200px] h-[150px] pointer-events-none z-[1001]">
      <div
        ref={buttonContainerRef}
        className="absolute top-[50px] right-[10px] pointer-events-auto bg-transparent"
      >
        <div className="flex flex-col gap-2 p-1">
          <button
            type="button"
            onClick={toggleMarkerMode}
            className={`px-3 py-1.5 rounded text-sm font-medium shadow-sm ${
              isMarkerMode
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {isMarkerMode ? "🚫 Stop" : "📍 Add Location"}
          </button>
          <button
            type="button"
            onClick={() => clearMarkers(true)}
            className="px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"
          >
            🗑️ Clear Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMarker;
