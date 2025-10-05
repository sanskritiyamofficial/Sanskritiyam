import React from "react";
import {
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

const JapHistory = ({ history, onClearHistory }) => {
  if (!history || history.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
          🕉️ Recent Jap History
        </h2>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-6xl mb-4">🕉️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Jap History Yet
          </h3>
          <p className="text-gray-500">
            Complete your first jap to see your spiritual journey here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-700 flex items-center gap-2">
          🕉️ Recent Jap History
        </h2>
        <button
          onClick={onClearHistory}
          className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {history.map((session, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-orange-700">
                    {session.mantra}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-orange-400" />
                    <span>
                      {session.name} ({session.gotra})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-400" />
                    <span>{session.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhone className="text-orange-400" />
                    <span>{session.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-orange-600">
                      {session.totalJap} Japs
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <FaClock className="text-orange-400" />
                  <span>{session.time}</span>
                </div>
                {session.duration && (
                  <div className="text-xs text-gray-400">
                    Duration: {Math.floor(session.duration / 60)}:
                    {(session.duration % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar for this session */}
            <div className="mt-4">
              <div className="w-full bg-orange-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                Session Completed
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Total Sessions:{" "}
          <span className="font-semibold text-orange-600">
            {history.length}
          </span>
        </p>
      </div>
    </div>
  );
};

export default JapHistory;
