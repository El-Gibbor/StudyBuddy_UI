import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Calendar, MessageSquare, User, Clock, Eye, X } from 'lucide-react';
import { useStudyBuddiesQuery } from '../../queries';
import SessionBookingModal from './SessionBookingModal';
import { Pagination } from '../ui';

const FindPeers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9); // 9 cards per page for 3x3 grid
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Build filter parameters for API
  const filterParams = {
    ...(searchTerm.trim() && { search: searchTerm.trim() }),
    ...(selectedModule && selectedModule !== 'All Modules' && { skill: selectedModule }),
    ...(selectedAvailability && selectedAvailability !== 'Any time' && { availability: selectedAvailability }),
    page: currentPage,
    limit: pageSize,
  };

  const {
    data: studyBuddiesData,
    isLoading,
    error
  } = useStudyBuddiesQuery(filterParams);

  // Extract peers from API response - buddies are in data.buddies
  const peers = studyBuddiesData?.data?.buddies || [];
  const totalCount = studyBuddiesData?.data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Extract unique skills/modules from all peers
  const availableSkills = useMemo(() => {
    const skillsSet = new Set();
    peers.forEach(peer => {
      if (peer.skills && Array.isArray(peer.skills)) {
        peer.skills.forEach(skill => {
          if (skill && skill.trim()) {
            skillsSet.add(skill.trim());
          }
        });
      }
    });
    return ['All Modules', ...Array.from(skillsSet).sort()];
  }, [peers]);

  // Helper function to format availability
  const formatAvailability = (availability) => {
    if (!availability || availability.length === 0) return 'No availability set';

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const firstSlot = availability[0];
    const dayName = dayNames[firstSlot.dayOfWeek];
    return `${dayName} ${firstSlot.startTime}-${firstSlot.endTime}${availability.length > 1 ? ' +more' : ''}`;
  };

  // Helper function to format all availability slots
  const formatAllAvailability = (availability) => {
    if (!availability || availability.length === 0) return [];

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return availability.map(slot => ({
      day: dayNames[slot.dayOfWeek],
      time: `${slot.startTime}-${slot.endTime}`,
      dayOfWeek: slot.dayOfWeek
    })).sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  };

  const availabilityOptions = [
    { value: 'Any time', label: 'Any time' },
    { value: 'today', label: 'Available today' },
    { value: 'tomorrow', label: 'Available tomorrow' },
    { value: 'this_week', label: 'Available this week' },
    { value: 'next_week', label: 'Available next week' },
    { value: 'weekdays', label: 'Weekdays only' },
    { value: 'weekends', label: 'Weekends only' }
  ];

  // Check if any filters are active
  const hasActiveFilters = searchTerm.trim() !== '' || 
                          (selectedModule !== '' && selectedModule !== 'All Modules') || 
                          (selectedAvailability !== '' && selectedAvailability !== 'Any time');

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedModule('');
    setSelectedAvailability('');
    setCurrentPage(1);
  };

  const handleRequestSession = (peer) => {
    setSelectedPeer(peer);
    setShowBookingModal(true);
  };

  const handleViewAvailability = (peer) => {
    setSelectedPeer(peer);
    setShowAvailabilityModal(true);
  };

  const handleChatWithPeer = (peer) => {
    // Generate Google Chat link with pre-filled message
    const message = encodeURIComponent(`Hi ${peer.name}! I found your profile on StudyBuddy and would like to connect for a study session.`);
    const googleChatUrl = `https://mail.google.com/chat/u/0/#chat/space/new?to=${encodeURIComponent(peer.email || '')}&text=${message}`;
    
    // Open Google Chat in a new tab
    window.open(googleChatUrl, '_blank', 'noopener,noreferrer');
  };

  const handleBookingSuccess = (message, type = 'success') => {
    setFeedbackMessage(message);
    if (type === 'success') {
      // Auto-clear success message after 3 seconds
      setTimeout(() => setFeedbackMessage(''), 3000);
    } else if (type === 'error') {
      // Auto-clear error message after 5 seconds
      setTimeout(() => setFeedbackMessage(''), 5000);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to first page when filters change
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'module':
        setSelectedModule(value);
        break;
      case 'availability':
        setSelectedAvailability(value);
        break;
    }
  };

  // Handle errors
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <User className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading peers</h3>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Feedback Message */}
      {feedbackMessage && (
        <div className={`mb-4 p-3 border rounded-md ${
          feedbackMessage.includes('Failed') || feedbackMessage.includes('error') || feedbackMessage.includes('not available')
            ? 'bg-red-100 border-red-300 text-red-700'
            : 'bg-green-100 border-green-300 text-green-700'
        }`}>
          {feedbackMessage}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Study Peers</h2>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          <select
            value={selectedModule}
            onChange={(e) => handleFilterChange('module', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          >
            {availableSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <select
            value={selectedAvailability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          >
            {availabilityOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Filter status and clear button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <Filter className="w-4 h-4" />
              <span>
                Filters active: 
                {searchTerm.trim() && ` Search: "${searchTerm.trim()}"`}
                {selectedModule && selectedModule !== 'All Modules' && ` • Skill: ${selectedModule}`}
                {selectedAvailability && selectedAvailability !== 'Any time' && ` • Availability: ${selectedAvailability}`}
              </span>
            </div>
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <X className="w-4 h-4" />
              <span>Clear filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Peer Cards */}
      {isLoading ? <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div> : peers.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No peers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peers.map((peer) => (
            <div
              key={peer.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={peer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(peer.name)}&background=3B82F6&color=fff`}
                  alt={peer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{peer.name}</h3>
                  <p className="text-sm text-gray-600">{peer.major} • {peer.studyYear}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {peer.completedSessions > 0 ? '4.8' : 'New'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {peer.bio || 'Available to help with various topics'}
              </p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                {peer.skills && peer.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {peer.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {peer.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{peer.skills.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 italic">No skills listed yet</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1 flex-1">
                  <Clock className="w-4 h-4" />
                  <span className="flex-1">{formatAvailability(peer.availability)}</span>
                  {peer.availability && peer.availability.length > 1 && (
                    <button
                      onClick={() => handleViewAvailability(peer)}
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View All</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequestSession(peer)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Request Session
                </button>
                <button 
                  onClick={() => handleChatWithPeer(peer)}
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  title="Chat on Google Chat"
                >
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
        className="mt-6"
      />

      {/* Session Booking Modal */}
      <SessionBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedPeer={selectedPeer}
        onSuccess={handleBookingSuccess}
      />

      {/* Availability Modal */}
      {showAvailabilityModal && selectedPeer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowAvailabilityModal(false)}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={selectedPeer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPeer.name)}&background=3B82F6&color=fff`}
                    alt={selectedPeer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedPeer.name}</h3>
                    <p className="text-sm text-gray-600">Availability Schedule</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPeer.availability && selectedPeer.availability.length > 0 ? (
                    formatAllAvailability(selectedPeer.availability).map((slot, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-900">{slot.day}</span>
                        <span className="text-gray-600">{slot.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No availability set
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    setShowAvailabilityModal(false);
                    handleRequestSession(selectedPeer);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Request Session
                </button>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default FindPeers;