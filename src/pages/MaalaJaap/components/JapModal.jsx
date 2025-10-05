import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { FaPlay, FaPause, FaTimes, FaSave } from "react-icons/fa";

const JapModal = ({
  isOpen,
  onClose,
  mantra,
  onComplete,
  customAudioFile = null,
}) => {
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [malaRotation, setMalaRotation] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gotra: "",
    city: "",
    phone: "",
  });

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const progress = mantra ? (count / mantra.targetCount) * 100 : 0;
  const isComplete = mantra ? count >= mantra.targetCount : false;

  useEffect(() => {
    if (isOpen && mantra) {
      setCount(0);
      setElapsedTime(0);
      setMalaRotation(0);
      setShowForm(false);
      setFormData({ name: "", gotra: "", city: "", phone: "" });
      // Reset timer references but don't start automatically
      startTimeRef.current = null;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, mantra]);

  const startTimer = useCallback(() => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // If this is the first start, set the start time
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
    setMalaRotation((prev) => prev + 30);
  }, []);
  const handleClose = useCallback(() => {
    stopTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    startTimeRef.current = null;
    onClose();
  }, [onClose, stopTimer]);

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        stopTimer();
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Audio play failed:", err);
          alert("Please tap the screen to allow audio playback");
        });
        startTimer();
      }
      setIsPlaying(!isPlaying);
    }
  }, [startTimer, stopTimer, isPlaying]);

  const handleSave = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!mantra) return;

      const japData = {
        ...formData,
        mantra: mantra.name,
        totalJap: count,
        time: new Date().toLocaleString(),
        duration: elapsedTime,
      };
      onComplete(japData);
      handleClose();
    },
    [formData, mantra, count, elapsedTime, onComplete, handleClose]
  );

  const formatTime = useMemo((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const createBeads = useMemo(() => {
    const beads = [];
    const beadCount = 12;
    const centerX = 96;
    const centerY = 96;
    const radius = 72;

    for (let i = 0; i < beadCount; i++) {
      const angle = (2 * Math.PI * i) / beadCount;
      const x = centerX + radius * Math.cos(angle) - 12;
      const y = centerY + radius * Math.sin(angle) - 12;
      beads.push(
        <div
          key={i}
          className="absolute w-6 h-6 bg-cover bg-center"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            backgroundImage: "url('/assets/img/icons/rudraksh.png')",
          }}
        />
      );
    }
    return beads;
  }, []);

  if (!isOpen || !mantra) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-orange-700">
            {mantra?.name || "Mantra"}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Timer */}
        <div className="text-gray-500 text-sm mb-4 flex items-center justify-center gap-2">
          {isPlaying ? "⏱️" : "⏸️"}
          <span>{formatTime(elapsedTime)}</span>
          {!isPlaying && elapsedTime > 0 && (
            <span className="text-orange-500 text-xs">(Paused)</span>
          )}
        </div>

        {/* Mala Visualization */}
        <div className="relative w-48 h-48 mx-auto my-6">
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{ transform: `rotate(${malaRotation}deg)` }}
          >
            {createBeads()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-orange-100 rounded-full h-4 mb-4">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Count Display */}
        <p className="text-gray-600 mb-6 text-lg">
          Jap Count: <span className="font-bold text-orange-600">{count}</span>{" "}
          / {mantra?.targetCount || 0}
        </p>

        {/* Audio Controls */}
        <button
          onClick={handlePlayPause}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg mb-4 flex items-center justify-center gap-2 transition-colors"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
          {isPlaying ? "Pause Mantra" : "Play Mantra"}
        </button>

        {/* Audio Element */}
        <audio ref={audioRef} loop onEnded={() => setIsPlaying(false)}>
          <source
            src={
              customAudioFile
                ? URL.createObjectURL(customAudioFile)
                : mantra?.audioUrl
            }
            type="audio/mpeg"
          />
        </audio>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          disabled={isComplete}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg mb-4 flex items-center justify-center gap-2 transition-colors"
        >
          Jap +1
        </button>

        {/* Save Button */}
        {isComplete && !showForm && (
          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg mb-4 flex items-center justify-center gap-2 transition-colors"
          >
            <FaSave />
            Save Jap & Fill Details
          </button>
        )}

        {/* Completion Form */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Gotra"
                value={formData.gotra}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gotra: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default JapModal;
