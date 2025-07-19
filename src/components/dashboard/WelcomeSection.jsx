import React, { useState } from 'react';
import { Edit3, Star, Calendar, Users } from 'lucide-react';

const WelcomeSection = ({ user }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Mock stats for now
  const stats = {
    sessionsCompleted: '--',
    helpedStudents: '--',
    upcomingThisWeek: '--'
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Extract user name
  const getUserName = () => {
    if (!user) return 'Student';

    // I had to handle this according to the user obj structure
    if (user.fullname?.name) {
      return user.fullname.name.split(' ')[0];
    }

    return 'Student';
  };

  // Get full name for display
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="relative">
            <img
              src={getProfileImage()}
              alt={getFullName()}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            {user?.emailVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center" title="Email Verified">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {getUserName()}!
            </h1>
            <p className="text-gray-600">
              {user.fullname?.major} {`• ${user.fullname?.studyYear}`}
            </p>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
            {user.fullname?.bio && (
              <p className="text-sm text-gray-500 mt-1 max-w-md">
                {user.fullname?.bio}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {user.fullname?.schoolName || 'African Leadership University'}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${user.fullname?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
            {user.fullname?.status || 'INACTIVE'}
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.sessionsCompleted}</div>
          <div className="text-sm text-gray-600">Sessions Completed</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2">
            <Star className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.helpedStudents}</div>
          <div className="text-sm text-gray-600">Students Helped</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-2">
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.upcomingThisWeek}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>

        {/* Skills count */}
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
            <Star className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{user.fullname?.skills?.length}</div>
          <div className="text-sm text-gray-600">Modules I can Offer Help</div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowEditProfile(false)}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Profile Details</h3>
                  <img
                    src={getProfileImage()}
                    alt={getFullName()}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={getFullName()}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                      <input
                        type="text"
                        value={user?.major || 'Not specified'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {user?.emailVerified ? 'Verified' : 'Not Verified'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Study Year</label>
                      <input
                        type="text"
                        value={user?.studyYear || 'Not specified'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={user?.role || 'STUDENT'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                    <div className="flex items-center space-x-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user?.status || 'INACTIVE'}
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user?.phoneVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        Phone: {user?.phoneVerified ? 'Verified' : 'Not Verified'}
                      </div>
                    </div>
                  </div>

                  {user?.skills && user.skills.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
                    <p>Last updated: {new Date(user?.updatedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 text-sm font-medium">📝 Profile Editing</p>
                    <p className="text-blue-600 text-sm mt-1">Full profile editing functionality will be implemented soon. You'll be able to update your bio, skills, and other details.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
