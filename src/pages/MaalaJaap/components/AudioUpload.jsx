import React, { useRef } from 'react';
import { FaUpload, FaMusic, FaTimes } from 'react-icons/fa';

const AudioUpload = ({ onFileSelect, selectedFile, onClear }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      onFileSelect(file);
    } else {
      alert('Please select a valid audio file (MP3, WAV, etc.)');
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div className="mt-10 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
        <FaMusic className="text-orange-500" />
        🔊 Devotee Custom Mantra Upload (Optional)
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mpeg,audio/wav,audio/ogg"
            onChange={handleFileChange}
            className="hidden"
            id="audioUpload"
          />
          <label
            htmlFor="audioUpload"
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer transition-colors font-medium"
          >
            <FaUpload />
            Choose Audio File
          </label>
          
          {selectedFile && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              <FaTimes />
              Clear
            </button>
          )}
        </div>
        
        {selectedFile && (
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <FaMusic />
              File Selected: {selectedFile.name}
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        
        <p className="text-gray-600 text-sm">
          यदि आप अपनी आवाज़ में जाप या कोई mantra लगाना चाहें, तो यहाँ upload करें।
          <br />
          <span className="text-orange-600 font-medium">
            Supported formats: MP3, WAV, OGG
          </span>
        </p>
      </div>
    </div>
  );
};

export default AudioUpload;
