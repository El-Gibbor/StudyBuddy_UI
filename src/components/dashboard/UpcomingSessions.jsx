import React, { useState } from 'react';
import { Calendar, Clock, Video, User, MapPin, ChevronRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useMySessionsQuery } from '../../queries';

const UpcomingSessions = ({ compact = false }) => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState('list');

  // Query for upcoming sessions
  const { data: sessionsData, isLoading: loading, error } = useMySessionsQuery({
    status: 'PENDING,CONFIRMED,IN_PROGRESS',
    limit: compact ? 3 : 10
  });


  // Process the API response to combine asBuddy and asLearner sessions
  const sessions = React.useMemo(() => {
    if (!sessionsData?.data || !Array.isArray(sessionsData.data) || !user?.id) return [];
    
    // Map sessions and determine user role based on current user context
    return sessionsData.data.map(session => {
      // Determine if current user is the buddy (helper) or learner
      const isHelper = session.buddyId === user.id;
      const isLearner = session.learnerId === user.id;
      
      return {
        id: session.id,
        title: `${session.module}: ${session.topic}`,
        type: isHelper ? 'helper' : 'learner',
        peerName: isHelper ? session.learner?.name : session.buddy?.name,
        peerImage: (isHelper ? session.learner?.avatarUrl : session.buddy?.avatarUrl) || 
                  `https://ui-avatars.com/api/?name=${encodeURIComponent((isHelper ? session.learner?.name : session.buddy?.name) || 'U')}&background=3B82F6&color=fff`,
        date: session.date,
        duration: 60, // Default duration since it's not in API response
        meetingLink: session.meetingLink,
        status: session.status,
        module: session.module,
        topic: session.topic,
        calendarEventUrl: session.calendarEventUrl,
        createdAt: session.createdAt
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [sessionsData]);


  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading sessions</h3>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSessionTypeColor = (type) => {
    return type === 'helper' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getSessionTypeLabel = (type) => {
    return type === 'helper' ? 'Helping' : 'Learning';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {compact ? 'Upcoming Sessions' : 'My Sessions'}
        </h2>
        {!compact && (
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'list'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:text-navy hover:bg-gray-100'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setSelectedView('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'calendar'
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:text-navy hover:bg-gray-100'
              }`}
            >
              Calendar
            </button>
          </div>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
          <p className="text-gray-600 mb-4">Book a session with a peer to get started!</p>
          <button className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-light transition-colors">
            Find Peers
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.slice(0, compact ? 3 : sessions.length).map((session) => (
            <div
              key={session.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeColor(session.type)}`}>
                      {getSessionTypeLabel(session.type)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{session.peerName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(session.date)} ({session.duration}min)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img
                      src={session.peerImage}
                      alt={session.peerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {session.meetingLink ? (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <Video className="w-4 h-4" />
                            <span>Join Meeting</span>
                          </a>
                        ) : (
                          <button className="flex items-center space-x-1 text-gray-400 text-sm font-medium cursor-not-allowed">
                            <Video className="w-4 h-4" />
                            <span>Meeting Link Pending</span>
                          </button>
                        )}
                        <span className="text-gray-300">•</span>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          Reschedule
                        </button>
                        <span className="text-gray-300">•</span>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}

          {compact && sessions.length > 3 && (
            <button className="w-full text-center py-3 text-navy hover:text-navy-light font-medium">
              View all sessions ({sessions.length})
            </button>
          )}
        </div>
      )}

      {selectedView === 'calendar' && !compact && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center text-gray-600">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Calendar view will be implemented here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
