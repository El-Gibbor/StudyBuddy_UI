import React, { useState } from 'react';
import { Modal, ModalContent, ModalFooter, Input, Textarea, Select, Button } from '../ui';

const CreateTicketModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    module: '',
    topic: '',
    description: '',
    priority: 'MEDIUM'
  });
  const [errors, setErrors] = useState({});

  const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.module.trim()) {
      newErrors.module = 'Module is required';
    }
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      module: '',
      topic: '',
      description: '',
      priority: 'MEDIUM'
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Create Support Ticket"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <div className="space-y-4">
            <Input
              label="Module"
              placeholder="e.g., Computer Science, Mathematics"
              value={formData.module}
              onChange={(e) => handleInputChange('module', e.target.value)}
              error={errors.module}
              required
            />
            
            <Input
              label="Topic"
              placeholder="Brief description of your issue"
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              error={errors.topic}
              required
            />
            
            <Textarea
              label="Description"
              placeholder="Provide detailed information about your issue..."
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={errors.description}
              required
            />
            
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              options={priorityOptions}
            />
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isLoading}
          >
            Create Ticket
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default CreateTicketModal;
