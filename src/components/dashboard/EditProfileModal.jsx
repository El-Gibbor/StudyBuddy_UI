import React, { useState } from 'react';
import { Edit3, User, BookOpen, Calendar, Mail, Phone } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const EditProfileModal = ({
  isOpen,
  onClose,
  user,
}) => {
  const { updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user.fullname?.name || '',
    major: user.fullname?.major || '',
    studyYear: user.fullname?.studyYear || '',
    bio: user.fullname?.bio || '',
    role: 'Student (Buddy/Learner)'
  });

  // Extract user name
  const getFullName = () => {
    if (!user) return 'Student';
    if (user.fullname?.name) {
      return user.fullname.name;
    }
    return 'Student';
  };

  // Get profile image with fallback
  const getProfileImage = () => {
    return user?.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName())}&background=6366f1&color=fff&size=64`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear any previous errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.major.trim()) {
        throw new Error('Major is required');
      }
      if (!formData.studyYear) {
        throw new Error('Study year is required');
      }

      await updateUserProfile({
        name: formData.name.trim(),
        major: formData.major.trim(),
        studyYear: formData.studyYear,
        bio: formData.bio.trim()
      });

      setSuccess('Profile updated successfully!');
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);

    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

          {/* Modal Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
              <img
                src={getProfileImage()}
                alt={getFullName()}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          </div>

          {/* Modal Content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 max-h-96 overflow-y-auto">
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div className=''>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-gray-500"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>

              {/* Major */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Major *
                </label>
                <input
                  type="text"
                  required
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-gray-500"
                  placeholder="Enter your major"
                  disabled={isLoading}
                />
              </div>

              {/* Study Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Study Year *
                </label>
                <select
                  required
                  value={formData.studyYear}
                  onChange={(e) => handleInputChange('studyYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-gray-500"
                  disabled={isLoading}
                >
                  <option value="">Select study year</option>
                  <option value="Year 1, Trimester 1">Year 1, Trimester 1</option>
                  <option value="Year 1, Trimester 2">Year 1, Trimester 2</option>
                  <option value="Year 1, Trimester 3">Year 1, Trimester 3</option>
                  <option value="Year 2, Trimester 1">Year 2, Trimester 1</option>
                  <option value="Year 2, Trimester 2">Year 2, Trimester 2</option>
                  <option value="Year 2, Trimester 3">Year 2, Trimester 3</option>
                  <option value="Year 3, Trimester 1">Year 3, Trimester 1</option>
                  <option value="Year 3, Trimester 2">Year 3, Trimester 2</option>
                  <option value="Year 3, Trimester 3">Year 3, Trimester 3</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 "
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-gray-500"
                  placeholder="Tell us about yourself..."
                  disabled={isLoading}
                />
              </div>

              {/* Contact Info (Read-only) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="text"
                    value={user?.phone || 'Not provided'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
