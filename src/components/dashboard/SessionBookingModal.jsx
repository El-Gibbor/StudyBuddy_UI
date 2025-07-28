import React, { useState } from 'react';
import { useCreateSessionMutation } from '../../mutations';
import { useToast } from '../ui/Toast';

const SessionBookingModal = ({
  isOpen,
  onClose,
  selectedPeer,
  onSuccess
}) => {
  const [sessionForm, setSessionForm] = useState({
    module: '',
    topic: '',
    date: '',
    meetingLink: ''
  });

  const createSessionMutation = useCreateSessionMutation();
  const { showSuccess, showError } = useToast();

  // Helper function to get available time slots for the peer
  const getAvailableTimeSlots = () => {
    if (!selectedPeer?.availability || selectedPeer.availability.length === 0) {
      return [];
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return selectedPeer.availability.map(slot => ({
      dayOfWeek: slot.dayOfWeek,
      dayName: dayNames[slot.dayOfWeek],
      startTime: slot.startTime,
      endTime: slot.endTime
    }));
  };

  // Helper function to check if a selected datetime is within available slots
  const isDateTimeAvailable = (selectedDateTime) => {
    if (!selectedDateTime || !selectedPeer?.availability) return false;

    const selectedDate = new Date(selectedDateTime);
    const selectedDayOfWeek = selectedDate.getDay();
    const selectedTime = selectedDate.toTimeString().slice(0, 5); // HH:MM format

    // Check if there's an availability slot for this day
    const availableSlot = selectedPeer.availability.find(slot =>
      slot.dayOfWeek === selectedDayOfWeek
    );

    if (!availableSlot) return false;

    // Check if the selected time is within the available time range
    return selectedTime >= availableSlot.startTime && selectedTime <= availableSlot.endTime;
  };

  const handleFormInputChange = (field, value) => {
    setSessionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSessionFormSubmit = async (e) => {
    e.preventDefault();

    if (!sessionForm.topic.trim() || !sessionForm.date || !sessionForm.module.trim()) {
      return;
    }

    // Validate that the selected datetime is within the peer's availability
    if (!isDateTimeAvailable(sessionForm.date)) {
      showError('Selected time is not within the buddy\'s available hours. Please choose a time when they are available.');
      return;
    }

    try {
      const sessionData = {
        buddyId: selectedPeer.id,
        module: sessionForm.module.trim(),
        topic: sessionForm.topic.trim(),
        date: sessionForm.date,
        ...(sessionForm.meetingLink.trim() && { meetingLink: sessionForm.meetingLink.trim() })
      };

      await createSessionMutation.mutateAsync(sessionData);

      // Reset form
      setSessionForm({
        module: '',
        topic: '',
        date: '',
        meetingLink: ''
      });

      // Close modal and show success
      onClose();

      showSuccess('Session request sent successfully!');

      // Call onSuccess callback if provided (for backwards compatibility)
      if (onSuccess) {
        onSuccess('Session request sent successfully!');
      }

    } catch (error) {
      console.error('Failed to create session:', error);

      // Extract error message from API response structure
      let errorMessage = 'Failed to send session request. Please try again.';

      if (error?.response?.data) {
        const apiError = error.response.data;

        // Handle the specific API error structure you provided
        if (apiError.status === 'error' && apiError.error?.message) {
          errorMessage = apiError.error.message;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.data?.message) {
          errorMessage = apiError.data.message;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Show error toast
      showError(errorMessage);

      // Call onSuccess callback with error if provided (for backwards compatibility)
      if (onSuccess) {
        onSuccess(errorMessage, 'error');
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setSessionForm({
      module: '',
      topic: '',
      date: '',
      meetingLink: ''
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
                  Module *
                </label>
                <input
                  type="text"
                  value={sessionForm.module}
                  onChange={(e) => handleFormInputChange('module', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Data & Decisions, Web Development, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic *
                </label>
                <input
                  type="text"
                  value={sessionForm.topic}
                  onChange={(e) => handleFormInputChange('topic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SQL Queries, React Components, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={sessionForm.date}
                  onChange={(e) => handleFormInputChange('date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${sessionForm.date && !isDateTimeAvailable(sessionForm.date)
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                    }`}
                  required
                />
                {sessionForm.date && !isDateTimeAvailable(sessionForm.date) && (
                  <p className="text-xs text-red-600 mt-1">
                    This time is not within {selectedPeer.name}'s available hours.
                  </p>
                )}

                {/* Show availability information */}
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    {selectedPeer.name}'s availability:
                  </p>
                  {getAvailableTimeSlots().length > 0 ? (
                    <div className="space-y-1">
                      {getAvailableTimeSlots().map((slot, index) => (
                        <p key={index} className="text-xs text-gray-600">
                          {slot.dayName}: {slot.startTime} - {slot.endTime}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      No availability set
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link (Optional)
                </label>
                <input
                  type="url"
                  value={sessionForm.meetingLink}
                  onChange={(e) => handleFormInputChange('meetingLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a Zoom, Google Meet, or other video conferencing link
                </p>
              </div>
            </form>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSessionFormSubmit}
              disabled={
                createSessionMutation.isPending ||
                !sessionForm.topic.trim() ||
                !sessionForm.date ||
                !sessionForm.module.trim() ||
                (sessionForm.date && !isDateTimeAvailable(sessionForm.date))
              }
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
