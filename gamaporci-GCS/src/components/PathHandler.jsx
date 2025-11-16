import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaMapMarked } from "react-icons/fa";

const PathHandler = ({ markers = [], selectedMission, onSavePath }) => {
  // State untuk mode editing
  const [isEditing, setIsEditing] = useState(false);

  // Reset editing mode ketika mission berubah
  useEffect(() => {
    setIsEditing(false);
  }, [selectedMission]);

  // Handler untuk menyimpan path
  const handleSavePath = () => {
    try {
      if (!selectedMission) {
        alert("Please select a mission first");
        return;
      }

      // Konversi markers ke format path
      const path = markers.map((marker) => {
        const latLng = marker.getLatLng();
        return {
          lat: latLng.lat,
          lng: latLng.lng,
        };
      });

      // Save path dan reset editing mode
      onSavePath(path);
      setIsEditing(false);
      alert("Path saved successfully!");
    } catch (error) {
      console.error("Error saving path:", error);
      alert("Error saving path. Please try again.");
    }
  };

  // Handler untuk toggle mode editing
  const handleEditToggle = () => {
    if (!selectedMission) {
      alert("Please select a mission first");
      return;
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="absolute top-4 right-2 flex flex-col items-end gap-2 z-[1000] p-2 mt-36">
      {/* Edit Button */}
      <button
        onClick={handleEditToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 ${
          isEditing
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
        title={isEditing ? "Cancel editing" : "Start editing path"}
      >
        <FaEdit className="text-lg" />
        <span>{isEditing ? "Cancel Edit" : "Edit Path"}</span>
      </button>

      {/* Save Button */}
      {isEditing && (
        <button
          onClick={handleSavePath}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg transition-colors duration-200"
          title="Save current path"
        >
          <FaSave className="text-lg" />
          <span>Save Path</span>
        </button>
      )}

      {/* Mission Info Badge */}
      <div className="bg-white shadow-lg rounded-lg px-4 py-2 text-sm flex items-center gap-2">
        <FaMapMarked className="text-blue-500" />
        <div className="flex items-center gap-1">
          {selectedMission ? (
            <>
              <span className="font-medium text-gray-900">
                {selectedMission.name}
              </span>
              <span className="text-gray-500">({markers.length} points)</span>
            </>
          ) : (
            <span className="text-gray-500">No mission selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathHandler;
