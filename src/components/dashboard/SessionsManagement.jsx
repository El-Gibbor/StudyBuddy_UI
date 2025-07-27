import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Play, 
  Star,
  Filter,
  Search,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useMySessionsQuery } from '../../queries';
import { 
  useConfirmSessionMutation, 
  useRejectSessionMutation, 
  useStartSessionMutation,
  useCompleteSessionMutation,
  useCancelSessionMutation 
} from '../../mutations';

const SessionsManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    feedback: '',
    helpful: true
  });

  // Query parameters based on filters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    ...(searchTerm.trim() && { search: searchTerm.trim() }),
    ...(statusFilter && statusFilter !== 'all' && { status: statusFilter }),
    ...(activeTab !== 'all' && { type: activeTab })
  };

  const { data: sessionsData, isLoading, error } = useMySessionsQuery(queryParams);

  // Extract pagination metadata
  const pagination = sessionsData?.meta?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  };

  // Mutations
  const confirmSessionMutation = useConfirmSessionMutation();
  const rejectSessionMutation = useRejectSessionMutation();
  const startSessionMutation = useStartSessionMutation();
  const completeSessionMutation = useCompleteSessionMutation();
  const cancelSessionMutation = useCancelSessionMutation();

  // Extract sessions from API response and transform to include userRole
  const sessions = React.useMemo(() => {
    if (!sessionsData?.data || !user?.id) return [];
    
    return sessionsData.data.map(session => {
      // Determine user role based on current user ID
      const userRole = session.buddyId === user.id ? 'helper' : 'learner';
      
      return {
        ...session,
        userRole,
        // Map the API fields to what the component expects
        scheduledDateTime: session.date,
        duration: 60, // Default duration, adjust as needed
        description: `${session.module} - ${session.topic}`,
        helper: session.buddy,
        learner: session.learner,
        // Convert status to lowercase to match component expectations
        status: session.status.toLowerCase()
      };
    });
  }, [sessionsData, user?.id]);

  const tabs = [
    { id: 'all', label: 'All Sessions', count: sessions.length },
    { id: 'helping', label: 'Helping Others', count: sessions.filter(s => s.userRole === 'helper').length },
    { id: 'learning', label: 'Learning', count: sessions.filter(s => s.userRole === 'learner').length },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pagination.totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < pagination.totalPages - 1) {
      rangeWithDots.push('...', pagination.totalPages);
    } else {
      rangeWithDots.push(pagination.totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  };

  const handleConfirmSession = async (sessionId) => {
    try {
      await confirmSessionMutation.mutateAsync(sessionId);
    } catch (error) {
      console.error('Failed to confirm session:', error);
      alert('Failed to confirm session. Please try again.');
    }
  };

  const handleRejectSession = async (sessionId) => {
    try {
      await rejectSessionMutation.mutateAsync(sessionId);
    } catch (error) {
      console.error('Failed to reject session:', error);
      alert('Failed to reject session. Please try again.');
    }
  };

  const handleStartSession = async (sessionId) => {
    try {
      await startSessionMutation.mutateAsync(sessionId);
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start session. Please try again.');
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      try {
        await cancelSessionMutation.mutateAsync(sessionId);
      } catch (error) {
        console.error('Failed to cancel session:', error);
        alert('Failed to cancel session. Please try again.');
      }
    }
  };

  const handleCompleteSession = (session) => {
    setSelectedSession(session);
    setFeedbackForm({
      rating: 5,
      feedback: '',
      helpful: true
    });
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    try {
      await completeSessionMutation.mutateAsync({
        id: selectedSession.id,
        feedbackData: {
          rating: feedbackForm.rating,
          feedback: feedbackForm.feedback.trim() || undefined,
          helpful: feedbackForm.helpful
        }
      });
      
      setShowFeedbackModal(false);
      setSelectedSession(null);
      setFeedbackForm({ rating: 5, feedback: '', helpful: true });
    } catch (error) {
      console.error('Failed to complete session:', error);
      alert('Failed to complete session. Please try again.');
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSessionActions = (session) => {
    const { status, userRole } = session;
    const actions = [];

    if (status === 'pending' && userRole === 'helper') {
      actions.push(
        <button
          key="confirm"
          onClick={() => handleConfirmSession(session.id)}
          disabled={confirmSessionMutation.isPending}
          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Accept</span>
        </button>,
        <button
          key="reject"
          onClick={() => handleRejectSession(session.id)}
          disabled={rejectSessionMutation.isPending}
          className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" />
          <span>Decline</span>
        </button>
      );
    }

    if (status === 'confirmed') {
      actions.push(
        <button
          key="start"
          onClick={() => handleStartSession(session.id)}
          disabled={startSessionMutation.isPending}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          <span>Start</span>
        </button>
      );
    }

    if (status === 'in_progress') {
      actions.push(
        <button
          key="complete"
          onClick={() => handleCompleteSession(session)}
          disabled={completeSessionMutation.isPending}
          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Complete</span>
        </button>
      );
    }

    if (['pending', 'confirmed'].includes(status)) {
      actions.push(
        <button
          key="cancel"
          onClick={() => handleCancelSession(session.id)}
          disabled={cancelSessionMutation.isPending}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      );
    }

    return actions;
  };

  // Filter sessions based on active tab
  const filteredSessions = sessions.filter(session => {
    if (activeTab === 'helping') return session.userRole === 'helper';
    if (activeTab === 'learning') return session.userRole === 'learner';
    return true;
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Sessions</h2>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600">
            {activeTab === 'all' 
              ? "You don't have any sessions yet." 
              : `No ${activeTab} sessions found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const dateTime = formatDateTime(session.scheduledDateTime);
            const actions = getSessionActions(session);
            
            return (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{session.module} - {session.topic}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.userRole === 'helper' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.userRole === 'helper' ? 'Helping' : 'Learning'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>
                          {session.userRole === 'helper' ? session.learner?.name : session.helper?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{dateTime.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{dateTime.time} ({session.duration}min)</span>
                      </div>
                      {session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Join Meeting</span>
                        </a>
                      )}
                    </div>
                    
                    {session.description && session.description !== `${session.module} - ${session.topic}` && (
                      <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {actions}
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filteredSessions.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} sessions
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border border-blue-600'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === pagination.totalPages}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowFeedbackModal(false)}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitFeedback}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Session & Provide Feedback</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How would you rate this session?
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setFeedbackForm(prev => ({ ...prev, rating }))}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                rating <= feedbackForm.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback (Optional)
                      </label>
                      <textarea
                        value={feedbackForm.feedback}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedback: e.target.value }))}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Share your experience..."
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={feedbackForm.helpful}
                          onChange={(e) => setFeedbackForm(prev => ({ ...prev, helpful: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">This session was helpful</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={completeSessionMutation.isPending}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {completeSessionMutation.isPending ? 'Completing...' : 'Complete Session'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsManagement;
