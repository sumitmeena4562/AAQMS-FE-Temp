import React, { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

const ImageUploadCard = ({ label, value, onUpload, error, onBlur }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-body text-[13px] font-bold mb-2">
          {label}
        </label>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="w-full h-[120px] relative group">
        <button
          type="button"
          onClick={handleClick}
          onBlur={onBlur}
          className={`w-full h-full rounded-[var(--radius-card)] border border-dashed ${error ? 'border-red-500 bg-red-50/50' : 'border-border-main bg-base/50 hover:bg-base hover:border-blue-400'} flex flex-col items-center justify-center gap-2 transition-colors relative overflow-hidden`}
        >
          {value ? (
            <img src={value} alt={label || "Profile"} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <div className={`${error ? 'text-red-400' : 'text-gray'} mb-1`}>
                <ImagePlus size={24} strokeWidth={1.5} />
              </div>
              <span className={`text-[13px] font-medium ${error ? 'text-red-400' : 'text-gray'}`}>Upload Image</span>
            </>
        )}
        </button>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpload('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="absolute top-2 right-2 bg-card/90 hover:bg-red-500 text-body hover:text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
      {error && <span className="text-[11px] text-red-500 mt-1 font-medium text-center">{error}</span>}
    </div>
  );
};

export default ImageUploadCard;
