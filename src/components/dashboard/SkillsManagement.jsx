import { useState, useEffect } from 'react';
import { Plus, X, BookOpen, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useUserSkillsQuery } from '../../queries';
import { useUpdateSkillsMutation, useAddSkillsMutation, useRemoveSkillsMutation } from '../../mutations';

const SkillsManagement = () => {
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // React Query hooks
  const { 
    data: userSkillsData, 
    isLoading: isLoadingSkills, 
    error: skillsError,
    refetch: refetchSkills 
  } = useUserSkillsQuery();
  
  const addSkillsMutation = useAddSkillsMutation();
  const removeSkillsMutation = useRemoveSkillsMutation();
  // Get current skills from API data
  const currentSkills = userSkillsData?.data?.skills || [];

  // Handle skills error
  useEffect(() => {
    if (skillsError) {
      setError(skillsError.message || 'Failed to load skills');
    }
  }, [skillsError]);

  const addSkill = async () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !currentSkills.includes(trimmedSkill)) {
      setError('');
      setSuccess('');
      
      try {
        await addSkillsMutation.mutateAsync({ skills: [trimmedSkill] });
        setNewSkill('');
        setSuccess('Skill added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error adding skill:', error);
        setError(error.message || 'Failed to add skill');
        setTimeout(() => setError(''), 5000);
      }
    } else if (currentSkills.includes(trimmedSkill)) {
      setError('This skill is already added');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeSkill = async (skillToRemove) => {
    setError('');
    setSuccess('');

    try {
      await removeSkillsMutation.mutateAsync({ skills: [skillToRemove] });
      setSuccess('Skill removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error removing skill:', error);
      setError(error.message || 'Failed to remove skill');
      setTimeout(() => setError(''), 5000);
    }
  };


  // Show loading state
  if (isLoadingSkills) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-96"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg p-4">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Skills & Modules Management</h2>
            <p className="text-gray-600">Manage the skills and modules you can help other students with</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentSkills.length}</div>
            <div className="text-sm text-gray-600">Total Skills</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {addSkillsMutation.isPending || removeSkillsMutation.isPending ? 'Updating...' : 'Ready'}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-600 font-medium">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Add New Skill */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Add New Skill or Module</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            placeholder="e.g., Enterprise Web Development, Linux, SSH, Data Structures & Algorithm, Web Infrastructure..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            onClick={addSkill}
            disabled={!newSkill.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

     

      {/* Current Skills */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Skills & Modules</h3>

        {currentSkills.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h4>
            <p className="text-gray-600">Add your first skill to start helping other students!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-red-600 transition-colors"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManagement;
