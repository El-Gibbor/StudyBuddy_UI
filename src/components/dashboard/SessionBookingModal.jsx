import React, { useState } from 'react';
import { useCreateSessionMutation } from '../../mutations';

const SessionBookingModal = ({ 
  isOpen, 
  onClose, 
  selectedPeer, 
  onSuccess 
}) => {
  const [sessionForm, setSessionForm] = useState({
    topic: '',
    description: '',
    scheduledDateTime: '',
    duration: 60,
    sessionType: 'online'
  });

  const createSessionMutation = useCreateSessionMutation();

  const handleFormInputChange = (field, value) => {
    setSessionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSessionFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!sessionForm.topic.trim() || !sessionForm.scheduledDateTime) {
      return;
    }

    try {
      const sessionData = {
        helperId: selectedPeer.id,
        topic: sessionForm.topic.trim(),
        description: sessionForm.description.trim() || undefined,
        scheduledDateTime: sessionForm.scheduledDateTime,
        duration: sessionForm.duration,
        sessionType: sessionForm.sessionType
      };

      await createSessionMutation.mutateAsync(sessionData);
      
      // Reset form
      setSessionForm({
        topic: '',
        description: '',
        scheduledDateTime: '',
        duration: 60,
        sessionType: 'online'
      });
      
      // Close modal and show success
      onClose();
      
      if (onSuccess) {
        onSuccess('Session request sent successfully!');
      }
      
    } catch (error) {
      console.error('Failed to create session:', error);
      if (onSuccess) {
        onSuccess('Failed to send session request. Please try again.', 'error');
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setSessionForm({
      topic: '',
      description: '',
      scheduledDateTime: '',
      duration: 60,
      sessionType: 'online'
    });
    onClose();
  };

  if (!isOpen || !selectedPeer) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={selectedPeer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPeer.name)}&background=3B82F6&color=fff`}
                alt={selectedPeer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedPeer.name}</h3>
                <p className="text-sm text-gray-600">{selectedPeer.major} • {selectedPeer.studyYear}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Fill out the details to request a study session with {selectedPeer.name}.</p>
            <form onSubmit={handleSessionFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Topic *
                </label>
                <input
                  type="text"
                  value={sessionForm.topic}
                  onChange={(e) => handleFormInputChange('topic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What do you need help with?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={sessionForm.description}
                  onChange={(e) => handleFormInputChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide more details about what you need help with..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={sessionForm.scheduledDateTime}
                    onChange={(e) => handleFormInputChange('scheduledDateTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    value={sessionForm.duration}
                    onChange={(e) => handleFormInputChange('duration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Type
                </label>
                <select
                  value={sessionForm.sessionType}
                  onChange={(e) => handleFormInputChange('sessionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="online">Online</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>
            </form>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSessionFormSubmit}
              disabled={createSessionMutation.isPending || !sessionForm.topic.trim() || !sessionForm.scheduledDateTime}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createSessionMutation.isPending ? 'Sending...' : 'Send Request'}
            </button>
            <button
              type="button"
              onClick={handleClose}
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

export default SessionBookingModal;
