import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaMap, FaList } from "react-icons/fa";

const SideBar = ({ latLonClick, setLatLonClick, missionClick, setMissionClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLatLonModal = () => {
    setLatLonClick(!latLonClick);
    if (missionClick) setMissionClick(false); // Close mission modal if open
  };

  const handleMissionModal = () => {
    setMissionClick(!missionClick);
    if (latLonClick) setLatLonClick(false); // Close latlon modal if open
  };

  return (
    <div className="fixed left-0 top-0 h-screen flex">
      <div
        className={`
          h-full 
          transition-all 
          duration-300 
          bg-gradient-to-b 
          from-blue-600 
          to-teal-500 
          text-white
          ${isOpen ? "w-64" : "w-20"}
          p-6
        `}
      >
        <div className="flex items-center mb-6">
          <img
            src="/src/assets/logoGama.png"
            alt="Logo"
            className="w-8 h-8 mr-3"
          />
          {isOpen && (
            <a
              href="https://gamaforce.wg.ugm.ac.id/"
              className="text-lg font-semibold"
            >
              Gamaforce
            </a>
          )}
        </div>

        <nav>
          <ul className="space-y-4">
            <li>
              <button className="flex items-center p-2 w-full rounded-md hover:bg-blue-700 transition">
                <FaUsers size={20} />
                {isOpen && (
                  <a
                    href="https://gamaforce.wg.ugm.ac.id/about-us/"
                    className="ml-3"
                  >
                    About Us
                  </a>
                )}
              </button>
            </li>

            <li>
              <button
                onClick={handleLatLonModal}
                className="flex items-center p-2 w-full rounded-md hover:bg-blue-700 transition"
              >
                <FaMap size={20} />
                {isOpen && <p className="ml-3">Set Lat & Lon</p>}
              </button>
            </li>

            <li>
              <button
                onClick={handleMissionModal}
                className="flex items-center p-2 w-full rounded-md hover:bg-blue-700 transition"
              >
                <FaList size={20} />
                {isOpen && <p className="ml-3">Missions</p>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 bg-blue-600 rounded-full p-1 text-white hover:bg-blue-700"
      >
        {isOpen ? <MdChevronLeft size={16} /> : <MdChevronRight size={16} />}
      </button>
    </div>
  );
};

export default SideBar;