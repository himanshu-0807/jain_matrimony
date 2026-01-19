import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onConfirm, onCancel, loading }) => {
    const [utrNumber, setUtrNumber] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!utrNumber.trim()) {
            setError('Please enter the UTR number');
            return;
        }
        if (utrNumber.length < 10) {
            setError('Please enter a valid UTR number (min 10 characters)');
            return;
        }
        onConfirm(utrNumber);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden flex flex-col shadow-2xl border border-gold-light animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-saffron to-gold-dark p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Registration Fee: ₹100</h2>
                    <p className="text-sm opacity-90 mt-1">Scan QR code and enter UTR to verify your payment</p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* QR Code Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative group p-4 bg-white rounded-2xl shadow-xl border border-gray-100">
                            <img
                                src="/Users/stylecheck/.gemini/antigravity/brain/0c68c5d1-c31b-4fa6-a47c-43d6d0717a71/payment_qr_code_1768846063506.png"
                                alt="Payment QR Code"
                                className="w-56 h-56 object-contain rounded-lg"
                            />
                            <div className="absolute inset-0 border-2 border-dashed border-gold/20 rounded-2xl pointer-events-none"></div>
                        </div>

                        {/* Mobile-only UPI Intent Button */}
                        <div className="w-full mt-6 sm:hidden">
                            <a
                                href="upi://pay?pa=8432080703@axl&pn=Jain%20Matrimony&am=100&cu=INR&tn=Registration%20Fee"
                                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                            >
                                <span>📲</span> Open UPI App
                            </a>
                        </div>

                        <p className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-center">
                            Scan with any UPI App <br /> <span className="text-[10px] normal-case font-medium">(or use button above on mobile)</span>
                        </p>
                    </div>

                    {/* UTR Input Section */}
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                UTR / Transaction ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={utrNumber}
                                onChange={(e) => {
                                    setUtrNumber(e.target.value.toUpperCase());
                                    setError('');
                                }}
                                className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 focus:bg-white text-lg font-mono ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-saffron'}`}
                                placeholder="ENTER 12-DIGIT UTR NUMBER"
                                maxLength={25}
                                disabled={loading}
                            />
                            {error && (
                                <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                                    <span className="text-base">⚠️</span> {error}
                                </p>
                            )}
                        </div>

                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 italic text-sm text-gray-700">
                            <strong>Note:</strong> Your application will only be processed after successful verification of the UTR number. Usually takes 12-24 hours.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-4 text-gray-600 font-bold hover:bg-gray-100 rounded-2xl transition-all duration-200"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !utrNumber}
                        className="flex-[2] px-4 py-4 bg-gradient-to-r from-saffron to-gold-dark text-white rounded-2xl font-bold shadow-lg shadow-saffron/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </>
                        ) : (
                            'Confirm & Submit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
