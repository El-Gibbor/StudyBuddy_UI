import React, { useState } from 'react';
import { Clock, Plus, X, Save } from 'lucide-react';

const AvailabilityEditor = ({ user }) => {
  // Initialize availability from user data or default empty schedule
  const [availability, setAvailability] = useState(() => {
    if (user?.availabilities && Array.isArray(user.availabilities)) {
      // Convert API format to component format
      const schedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      };
      
      user.availabilities.forEach(slot => {
        if (slot && typeof slot === 'string') {
          const [day, timeRange] = slot.split('_');
          if (schedule[day]) {
            schedule[day].push(timeRange);
          }
        }
      });
      
      return schedule;
    }
    
    return {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };
  });

  // Initialize support areas from user data
  const [supportAreas, setSupportAreas] = useState(() => {
    if (user?.skills && Array.isArray(user.skills)) {
      return user.skills;
    }
    return [];
  });

  const [newSkill, setNewSkill] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState({ day: 'Monday', start: '', end: '' });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addTimeSlot = () => {
    if (newTimeSlot.start && newTimeSlot.end) {
      const timeSlot = `${newTimeSlot.start}-${newTimeSlot.end}`;
      setAvailability(prev => ({
        ...prev,
        [newTimeSlot.day]: [...prev[newTimeSlot.day], timeSlot]
      }));
      setNewTimeSlot({ day: 'Monday', start: '', end: '' });
    }
  };

  const removeTimeSlot = (day, slotIndex) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter((_, index) => index !== slotIndex)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !supportAreas.includes(newSkill.trim())) {
      setSupportAreas(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSupportAreas(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSave = () => {
    // Save availability and support areas
    console.log('Saving availability:', availability);
    console.log('Saving support areas:', supportAreas);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Weekly Availability */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Weekly Availability</h2>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-light transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Schedule */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Schedule</h3>
            <div className="space-y-4">
              {daysOfWeek.map(day => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{day}</h4>
                    <span className="text-sm text-gray-600">
                      {availability[day].length} slot{availability[day].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {availability[day].length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No availability set</p>
                  ) : (
                    <div className="space-y-2">
                      {availability[day].map((slot, index) => (
                        <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                          <span className="text-sm font-medium text-blue-800">{slot}</span>
                          <button
                            onClick={() => removeTimeSlot(day, index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Time Slot */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Time Slot</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <select
                    value={newTimeSlot.day}
                    onChange={(e) => setNewTimeSlot(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newTimeSlot.start}
                      onChange={(e) => setNewTimeSlot(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={newTimeSlot.end}
                      onChange={(e) => setNewTimeSlot(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={addTimeSlot}
                  disabled={!newTimeSlot.start || !newTimeSlot.end}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Time Slot</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const weekdaySlot = '9:00-17:00';
                    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                    setAvailability(prev => {
                      const updated = { ...prev };
                      weekdays.forEach(day => {
                        if (!updated[day].includes(weekdaySlot)) {
                          updated[day] = [...updated[day], weekdaySlot];
                        }
                      });
                      return updated;
                    });
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                >
                  Add Weekdays 9-5
                </button>
                <button
                  onClick={() => {
                    setAvailability({
                      Monday: [],
                      Tuesday: [],
                      Wednesday: [],
                      Thursday: [],
                      Friday: [],
                      Saturday: [],
                      Sunday: []
                    });
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Areas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Support Areas</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Skills */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills I Can Help With</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {supportAreas.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {supportAreas.length === 0 && (
              <p className="text-gray-500 italic">No skills added yet</p>
            )}
          </div>

          {/* Add New Skill */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Skill</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="e.g., Machine Learning, Database Design"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              />
              <button
                onClick={addSkill}
                disabled={!newSkill.trim()}
                className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
            
            {/* Suggested Skills */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Skills</h4>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'MongoDB', 'Machine Learning', 'UI/UX Design', 'DevOps', 'Mobile Development'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (!supportAreas.includes(skill)) {
                        setSupportAreas(prev => [...prev, skill]);
                      }
                    }}
                    disabled={supportAreas.includes(skill)}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityEditor;