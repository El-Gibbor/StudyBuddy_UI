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

  // Extract user name - handle both string and object formats
  const getUserName = () => {
    if (!user) return 'Student';
    
    if (typeof user.fullname === 'string') {
      return user.fullname.split(' ')[0];
    }
    
    if (typeof user.fullname === 'object' && user.fullname) {
      return user.fullname.firstName || user.fullname.first || 'Student';
    }
    
    return user.name?.split(' ')[0] || 'Student';
  };

  // Get full name for display
  const getFullName = () => {
    if (!user) return 'Student';
    
    if (typeof user.fullname === 'string') {
      return user.fullname;
    }
    
    if (typeof user.fullname === 'object' && user.fullname) {
      const { firstName, lastName, first, last } = user.fullname;
      return `${firstName || first || ''} ${lastName || last || ''}`.trim() || 'Student';
    }
    
    return user.name || 'Student';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="relative">
            <img
              src={user?.profileImage || user?.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={getFullName()}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            {user?.emailVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Email Verified"></div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {getUserName()}!
            </h1>
            <p className="text-gray-600">
              {user?.major || 'Student'} {user?.studyYear && `• ${user.studyYear}`}
            </p>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
            {user?.bio && (
              <p className="text-sm text-gray-500 mt-1 max-w-md">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowEditProfile(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
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
            <Users className="w-4 h-4 text-purple-600" />
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Profile - {getFullName()}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input 
                      type="text" 
                      value={user?.role || 'BOTH'} 
                      disabled 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user?.emailVerified ? 'Verified' : 'Not Verified'}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Full profile editing functionality will be implemented here.</p>
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