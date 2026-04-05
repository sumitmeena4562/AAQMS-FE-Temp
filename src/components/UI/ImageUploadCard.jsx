import React, { useRef, useState } from 'react';
import { ImagePlus, X, UploadCloud, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUploadCard = ({ label, value, onUpload, error, onBlur, disabled }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onUpload(url, file);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
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
        <motion.button
          type="button"
          onClick={handleClick}
          onBlur={onBlur}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          className={`w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md cursor-pointer ${
            error 
              ? 'border-red-500 bg-red-50/10' 
              : isDragging 
                ? 'border-primary bg-primary/10 ring-4 ring-primary/10' 
                : 'border-border-main bg-base/30 hover:bg-white hover:border-primary/40'
          }`}
        >
          <AnimatePresence mode="wait">
            {value ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full"
              >
                <img src={value} alt={label || "Profile"} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-100 opacity-0" />
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-1 text-green-500"
              >
                <CheckCircle2 size={32} strokeWidth={2} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Added!</span>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <div className={`${error ? 'text-red-400' : isDragging ? 'text-primary' : 'text-gray/60'} mb-1`}>
                  {isDragging ? <UploadCloud size={28} /> : <ImagePlus size={28} strokeWidth={1.5} />}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${error ? 'text-red-400' : 'text-gray/60'}`}>
                  {isDragging ? 'Drop it!' : 'Upload'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpload('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 text-gray hover:text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-md backdrop-blur-sm"
          >
            <X size={14} strokeWidth={3} />
          </motion.button>
        )}
      </div>
      {error && (
        <motion.span 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-[10px] text-red-500 mt-1.5 font-bold uppercase tracking-tight text-center"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};

export default ImageUploadCard;
