import React from 'react';

const Step1Contact = ({ formData, onChange, errors }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Step 1: Contact Information</h3>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
            </label>
            <input
                type="email"
                value={formData.email}
                onChange={(e) => onChange('email', e.target.value)}
                className="input-field"
                placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
            </label>
            <input
                type="tel"
                value={formData.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                className="input-field"
                placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
    </div>
);

const Step2Basic = ({ formData, onChange, errors }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Step 2: Basic & Physical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.full_name} onChange={(e) => onChange('full_name', e.target.value)} className="input-field" placeholder="Enter full name" />
                {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                <select value={formData.gender} onChange={(e) => onChange('gender', e.target.value)} className="input-field">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status <span className="text-red-500">*</span></label>
                <select value={formData.marital_status} onChange={(e) => onChange('marital_status', e.target.value)} className="input-field">
                    <option value="">Select</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                </select>
                {errors.marital_status && <p className="text-red-500 text-sm mt-1">{errors.marital_status}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" value={formData.date_of_birth} onChange={(e) => onChange('date_of_birth', e.target.value)} className="input-field" />
                {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Time</label>
                <input type="time" value={formData.birth_time} onChange={(e) => onChange('birth_time', e.target.value)} className="input-field" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth City</label>
                <input type="text" value={formData.birth_city} onChange={(e) => onChange('birth_city', e.target.value)} className="input-field" placeholder="City of birth" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input type="number" value={formData.height_cm} onChange={(e) => onChange('height_cm', e.target.value)} className="input-field" placeholder="e.g. 170" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input type="number" value={formData.weight_kg} onChange={(e) => onChange('weight_kg', e.target.value)} className="input-field" placeholder="e.g. 65" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <select value={formData.blood_group} onChange={(e) => onChange('blood_group', e.target.value)} className="input-field">
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                </select>
            </div>
        </div>
    </div>
);

const Step3Religious = ({ formData, onChange, errors }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Step 3: Religious & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <input type="text" value={formData.religion} disabled className="input-field bg-gray-50 opacity-70" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                <input type="text" value={formData.caste} onChange={(e) => onChange('caste', e.target.value)} className="input-field" placeholder="e.g. Digambar" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Caste</label>
                <input type="text" value={formData.sub_caste} onChange={(e) => onChange('sub_caste', e.target.value)} className="input-field" placeholder="e.g. Visa" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gotra</label>
                <input type="text" value={formData.gotra} onChange={(e) => onChange('gotra', e.target.value)} className="input-field" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manglik</label>
                <select value={formData.manglik} onChange={(e) => onChange('manglik', e.target.value)} className="input-field">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Anshik">Anshik</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current City <span className="text-red-500">*</span></label>
                <input type="text" value={formData.city} onChange={(e) => onChange('city', e.target.value)} className="input-field" />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input type="text" value={formData.state} onChange={(e) => onChange('state', e.target.value)} className="input-field" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input type="text" value={formData.country} onChange={(e) => onChange('country', e.target.value)} className="input-field" />
            </div>
        </div>
    </div>
);

const Step4CareerFamily = ({ formData, onChange, errors }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Step 4: Career & Family</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                <input type="text" value={formData.education} onChange={(e) => onChange('education', e.target.value)} className="input-field" placeholder="e.g. BE Computer Science" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input type="text" value={formData.occupation} onChange={(e) => onChange('occupation', e.target.value)} className="input-field" placeholder="e.g. Software Engineer" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" value={formData.company_name} onChange={(e) => onChange('company_name', e.target.value)} className="input-field" placeholder="e.g. TCS / Infosys" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (Expectations)</label>
                <input type="text" value={formData.annual_income} onChange={(e) => onChange('annual_income', e.target.value)} className="input-field" placeholder="e.g. 10-15 Lakhs" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Income (Actual Amount)</label>
                <input type="number" value={formData.yearly_income} onChange={(e) => onChange('yearly_income', e.target.value)} className="input-field" placeholder="e.g. 1200000" />
            </div>

            <div className="md:col-span-2 border-t mt-4 pt-4">
                <h4 className="font-bold text-gray-700 mb-3">Family Details</h4>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                <input type="text" value={formData.father_name} onChange={(e) => onChange('father_name', e.target.value)} className="input-field" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation</label>
                <input type="text" value={formData.father_occupation} onChange={(e) => onChange('father_occupation', e.target.value)} className="input-field" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
                <input type="text" value={formData.mother_name} onChange={(e) => onChange('mother_name', e.target.value)} className="input-field" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation</label>
                <input type="text" value={formData.mother_occupation} onChange={(e) => onChange('mother_occupation', e.target.value)} className="input-field" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Siblings</label>
                <input type="number" value={formData.siblings} onChange={(e) => onChange('siblings', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Type</label>
                <select value={formData.family_type} onChange={(e) => onChange('family_type', e.target.value)} className="input-field">
                    <option value="">Select</option>
                    <option value="Nuclear">Nuclear</option>
                    <option value="Joint">Joint</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Status</label>
                <select value={formData.family_status} onChange={(e) => onChange('family_status', e.target.value)} className="input-field">
                    <option value="">Select</option>
                    <option value="Middle Class">Middle Class</option>
                    <option value="Upper Middle Class">Upper Middle Class</option>
                    <option value="Rich">Rich</option>
                    <option value="Affluent">Affluent</option>
                </select>
            </div>
        </div>
    </div>
);

const Step5Personal = ({ formData, onChange, errors }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Step 5: Personal Profile</h3>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies & Interests</label>
            <textarea value={formData.hobbies} onChange={(e) => onChange('hobbies', e.target.value)} className="input-field h-20" placeholder="Traveling, Music, Reading etc." />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
            <textarea value={formData.about_me} onChange={(e) => onChange('about_me', e.target.value)} className="input-field h-24" placeholder="Tell us more about yourself..." />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expectations</label>
            <textarea value={formData.expectations} onChange={(e) => onChange('expectations', e.target.value)} className="input-field h-24" placeholder="What are you looking for in a partner?" />
        </div>
    </div>
);

export { Step1Contact, Step2Basic, Step3Religious, Step4CareerFamily, Step5Personal };
