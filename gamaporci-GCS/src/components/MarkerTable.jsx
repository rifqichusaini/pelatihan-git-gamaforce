import React from "react";
import { FaTrash } from "react-icons/fa";

const MarkerTable = ({ markers, missionId }) => {
  const handleDelete = async (index) => {
    if (window.confirm("Hapus marker ini?")) {
      try {
        // Send DELETE request using fetch to the backend to delete the marker from the mission
        const response = await fetch(
          `http://localhost:5001/api/mission/${missionId}/marker/${index}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Successfully deleted the marker, update your frontend state accordingly
          alert("Marker deleted successfully");
          // Optionally, you may update the markers state here if you manage it locally
          // onMarkerUpdate(response.data); // Assuming this will update your markers list in the parent component
        } else {
          throw new Error("Failed to delete marker");
        }
      } catch (error) {
        console.error("Error deleting marker:", error);
        alert("Failed to delete marker.");
      }
    }
  };

  return (
    <div className="absolute bottom-2 right-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="max-h-32 overflow-y-auto">
        <table className="w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 sticky top-0 ">
            <tr>
              <th className="w-12 py-1 text-center font-medium text-gray-500">
                NO
              </th>
              <th className="py-1 px-2 text-left font-medium text-gray-500">
                LAT
              </th>
              <th className="py-1 px-2 text-left font-medium text-gray-500">
                LONG
              </th>
              <th className="w-12 py-1 text-center font-medium text-gray-500">
                DEL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {markers.map((marker, index) => {
              const latLng = marker.getLatLng();
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-1 text-center text-gray-900">
                    {index + 1}
                  </td>
                  <td className="py-1 px-2 whitespace-nowrap text-gray-500">
                    {latLng.lat.toFixed(4)}
                  </td>
                  <td className="py-1 px-2 whitespace-nowrap text-gray-500">
                    {latLng.lng.toFixed(4)}
                  </td>
                  <td className="py-1 text-center">
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete marker"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {markers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-2 py-1 text-center text-gray-500">
                  No markers yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarkerTable;
