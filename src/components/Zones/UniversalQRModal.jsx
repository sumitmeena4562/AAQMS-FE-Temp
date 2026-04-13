import React from 'react';
import QRCode from 'react-qr-code';
import { X, Download, MapPin, Box, Briefcase } from 'lucide-react';

const UniversalQRModal = ({
    isOpen,
    onClose,
    title,
    tagText,
    qrValue,
    details = [],
    onDownload
}) => {
    // If not open, render absolutely nothing
    if (!isOpen) return null;

    return (
        /* The Backdrop (Dark overlay over the whole screen)
           Clicking anywhere on this div will fire onClose. */
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity"
            onClick={onClose}
        >
            {/* The Modal Box
                We use e.stopPropagation() here! Why? Because this inner box sits INSIDE the backdrop.
                If we click the white box, we don't want the click to "bubble up" to the backdrop and close the modal.
                This allows users to interact with the modal safely. */}
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
                id="qr-modal-content-area"
            >
                {/* Close 'X' Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors z-20 outline-none"
                    title="Close"
                >
                    <X size={20} />
                </button>

                {/* Header Area */}
                <div className="px-8 pt-8 pb-4 border-b border-gray-100">
                    <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">{title}</h2>
                </div>

                {/* Main Content Area (Split Left/Right) */}
                <div className="flex flex-col md:flex-row p-8 gap-8 items-stretch bg-[#F9FAFB]/50">

                    {/* Left Side: Details Card */}
                    <div className="w-full md:w-5/12 flex flex-col gap-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">

                        {/* Decorative background web/node art */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 text-gray-50 opacity-40 pointer-events-none">
                            <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M2 12h20M12 2v20M7 7l10 10M17 7L7 17" />
                            </svg>
                        </div>

                        <h3 className="text-[12px] font-bold text-gray-500 tracking-[1.5px] uppercase mb-2">
                            Details
                        </h3>

                        {/* Dynamic Details Mapping */}
                        <div className="flex flex-col gap-6 relative z-10">
                            {details.map((detail, idx) => {
                                const Icon = detail.icon;
                                return (
                                    <div key={idx} className="flex items-start gap-4">
                                        {Icon && (
                                            <div className="mt-1 text-gray-500">
                                                <Icon size={22} strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{detail.label}</span>
                                            <span className="text-[15px] font-semibold text-gray-900 mt-1 leading-tight">{detail.value}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>


                    </div>

                    {/* Right Side: QR Presentation (The "Pedestal" Look) */}
                    <div className="w-full md:w-7/12 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200/50">

                        {/* The QR Code Card (The Green Square from Figma) */}
                        <div className="bg-[#42817C] p-10 rounded-lg shadow-xl relative flex flex-col items-center transform transition-transform hover:scale-[1.02] duration-300 ring-1 ring-black/5" id="qr-download-target">

                            {/* The White Canvas Behind the Code */}
                            <div className="bg-white p-4 rounded shadow-md ring-1 ring-black/5">
                                <QRCode
                                    value={qrValue || "No Data Provided"}
                                    size={180}
                                    level="H"
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        {/* The Silver Plaque below the QR */}
                        <div className="mt-8 bg-gradient-to-b from-gray-200 to-gray-300 border border-gray-400/50 px-8 py-2.5 rounded shadow-inner text-center">
                            <span className="text-[11px] font-bold text-gray-700 tracking-[1.5px] uppercase shadow-white drop-shadow-sm">
                                {tagText}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Bar */}
                <div className="p-6 bg-white border-t border-gray-100 flex justify-center">
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 px-8 py-3.5 bg-[#316964] hover:bg-[#25524E] text-white text-[14px] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 outline-none"
                    >
                        <span>Download Zone QR</span>
                        <Download size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UniversalQRModal;
