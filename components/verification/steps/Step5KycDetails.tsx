// components/verification/steps/Step5KycDetails.tsx
'use client';

import { useState, useEffect } from 'react';

const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
  'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
  'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu',
  'Vihiga', 'Wajir', 'West Pokot'
].sort();

const OMAN_REGIONS = [
  'Ad Dakhiliyah', 'Ad Dhahirah', 'Al Batinah North', 'Al Batinah South',
  'Al Buraimi', 'Al Wusta', 'Ash Sharqiyah North', 'Ash Sharqiyah South',
  'Dhofar', 'Muscat', 'Musandam'
].sort();

interface Step5Props {
  formData: any;
  updateStep: (step: number, data?: any) => void;
  role?: string;
}

export default function Step5KycDetails({ formData, updateStep, role = 'EMPLOYEE' }: Step5Props) {
  const isEmployer = role === 'EMPLOYER';
  const regions = isEmployer ? OMAN_REGIONS : KENYA_COUNTIES;
  const regionLabel = isEmployer ? 'Region' : 'County';
  const idLabel = isEmployer ? 'National ID / Passport Number' : 'National ID Number';

  const [form, setForm] = useState({
    fullName: formData.fullName || '',
    gender: formData.gender || '',
    dateOfBirth: formData.dateOfBirth || '',
    county: formData.county || '',
    idNumber: formData.idNumber || '',
    physicalAddress: formData.physicalAddress || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOver22, setIsOver22] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (form.dateOfBirth) {
      const birthDate = new Date(form.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      setIsOver22(age > 22 || (age === 22 && m >= 0));
    }
  }, [form.dateOfBirth]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!form.county) newErrors.county = `${regionLabel} is required`;
    if (!form.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    if (!form.physicalAddress.trim()) newErrors.physicalAddress = 'Physical address is required';

    // Validate ID number format (Kenyan ID numbers are typically 8 digits)
    // For Oman/Passport, we might want less strict validation or different validation
    if (!isEmployer && form.idNumber && !/^\d{8}$/.test(form.idNumber)) {
      newErrors.idNumber = 'ID number must be 8 digits';
    }

    if (form.dateOfBirth && !isOver22) {
      newErrors.dateOfBirth = 'You must be at least 22 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep(6, form);
    } catch (error) {
      console.error('Error saving KYC details:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatIdNumber = (value: string) => {
    if (isEmployer) return value; // Allow alphanumeric for passport/Oman ID
    // Remove non-digits and limit to 8 characters for Kenyan ID
    return value.replace(/\D/g, '').slice(0, 8);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Please provide your personal details as they appear on your ID
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter your full name as per ID"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
            {errors.dateOfBirth ? (
              <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
            ) : form.dateOfBirth && !isOver22 ? (
              <p className="mt-1 text-sm text-yellow-600">
                You must be at least 22 years old to proceed
              </p>
            ) : form.dateOfBirth && isOver22 ? (
              <p className="mt-1 text-sm text-green-600">✅ Age requirement met</p>
            ) : null}
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {idLabel} *
            </label>
            <input
              type="text"
              value={form.idNumber}
              onChange={(e) => handleChange('idNumber', formatIdNumber(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${errors.idNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={isEmployer ? "e.g., 12345678 or A1234567" : "e.g., 12345678"}
              maxLength={isEmployer ? 20 : 8}
            />
            {errors.idNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
            )}
          </div>

          {/* County / Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {regionLabel} *
            </label>
            <select
              value={form.county}
              onChange={(e) => handleChange('county', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${errors.county ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Select {regionLabel}</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            {errors.county && (
              <p className="mt-1 text-sm text-red-600">{errors.county}</p>
            )}
          </div>

          {/* Physical Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Physical Address *
            </label>
            <textarea
              value={form.physicalAddress}
              onChange={(e) => handleChange('physicalAddress', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${errors.physicalAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter your current physical address"
            />
            {errors.physicalAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.physicalAddress}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => updateStep(4)}
            disabled={isSubmitting}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!isOver22 || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-32"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Continue to Payment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}