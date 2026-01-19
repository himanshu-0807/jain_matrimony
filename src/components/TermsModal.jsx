import React, { useState } from 'react';

const TermsModal = ({ isOpen, onConfirm, onCancel }) => {
    const [agreed, setAgreed] = useState(false);
    const [lang, setLang] = useState('en'); // 'en' for English, 'mr' for Marathi

    if (!isOpen) return null;

    const content = {
        mr: {
            topGreeting: "🙏 सर्वंना सादर जय जिनेंद्र 🙏",
            rules: [
                "या वेबसाइट वर प्रकाशित माहिती उमेदवाराने/पालकाने दिलेल्या माहितीवर आधारित आहे.",
                "विवाह जुळवताना उमेदवाराच्या माहितीबद्दल संपूर्ण चौकशी स्वतः करून घ्यावी.",
                "उमेदवारांच्या माहितीबद्दल काही समस्या निर्माण झाल्यास आम्ही जबाबदार राहणार नाहि.",
                "सदर वेबसाइट चा उद्देश जास्तीत जास्त मुला मुलींचे बायोडेटा एकत्र आणून विवाह जुळण्यास मदत व्हावी हा आहे ."
            ],
            bottomGreeting: "🙏 जय जिनेंद्र 🙏",
            checkbox: "मी वरील सर्व अटी आणि शर्ती वाचल्या आहेत आणि मला त्या मान्य आहेत.",
            checkboxSub: "(I have read and agree to all the terms and conditions.)",
            btnCancel: "Cancel",
            btnAgree: "Agree & Continue"
        },
        en: {
            topGreeting: "🙏 Jai Jinendra to All 🙏",
            rules: [
                "The information published on this website is based on the details provided by the candidate or parent.",
                "Please conduct a thorough independent inquiry regarding the candidate's information while considering a match.",
                "In case of any issues regarding candidate information, we will not be held responsible.",
                "This website aims to bring together biodata of as many candidates as possible to facilitate finding a match."
            ],
            bottomGreeting: "🙏 Jai Jinendra 🙏",
            checkbox: "I have read and agree to all the terms and conditions.",
            checkboxSub: "",
            btnCancel: "Cancel",
            btnAgree: "Agree & Continue"
        }
    };

    const t = content[lang];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gold-light animate-in fade-in zoom-in duration-300">

                {/* Language Toggle */}
                <div className="flex justify-end p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex bg-gray-200 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setLang('mr')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === 'mr' ? 'bg-white text-saffron shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            मराठी
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-white text-saffron shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            English
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto text-gray-700 space-y-6 leading-relaxed">
                    <p className="text-lg font-bold text-center text-saffron">{t.topGreeting}</p>
                    <div className="space-y-4">
                        {t.rules.map((rule, index) => {
                            const numerals = ['१', '२', '३', '४'];
                            return (
                                <div key={index} className="flex gap-3">
                                    <span className="font-bold text-saffron min-w-[20px]">
                                        {lang === 'mr' ? numerals[index] + '.' : (index + 1) + '.'}
                                    </span>
                                    <p>{rule}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-6 border-t border-gray-100 text-center">
                        <p className="text-2xl font-black text-saffron">{t.bottomGreeting}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer group mb-6">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-md peer-checked:bg-saffron peer-checked:border-saffron transition-all duration-200 text-white flex items-center justify-center">
                                <svg className="w-4 h-4 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-saffron transition-colors">
                            {t.checkbox}
                            {t.checkboxSub && (
                                <>
                                    <br />
                                    <span className="text-xs text-gray-500">{t.checkboxSub}</span>
                                </>
                            )}
                        </span>
                    </label>

                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200"
                        >
                            {t.btnCancel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={!agreed}
                            className="flex-[2] px-4 py-3 bg-gradient-to-r from-saffron to-gold-dark text-white rounded-xl font-bold shadow-lg shadow-saffron/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 transition-all duration-200"
                        >
                            {t.btnAgree}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
