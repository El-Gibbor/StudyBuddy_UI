import React, { useState } from 'react';
import { Ticket, Clock, CheckCircle, AlertCircle, User, MessageSquare, Plus, X } from 'lucide-react';
import { useMyCreatedTicketsQuery, useMyClaimedTicketsQuery } from '../../queries';
import { useCreateTicketMutation } from '../../mutations';
import TicketDetails from './TicketDetails';
import TicketBrowser from './TicketBrowser';

const SupportTickets = ({ compact = false }) => {
  const [activeTab, setActiveTab] = useState('my-tickets');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    module: '',
    topic: '',
    description: '',
    priority: 'MEDIUM'
  });

  // Queries
  const { data: myTicketsData, isLoading: myTicketsLoading } = useMyCreatedTicketsQuery();
  const { data: claimedTicketsData, isLoading: claimedTicketsLoading } = useMyClaimedTicketsQuery();

  // Mutations
  const createTicketMutation = useCreateTicketMutation();

  const loading = myTicketsLoading || claimedTicketsLoading;
  const myTickets = myTicketsData?.data || [];
  const claimedTickets = claimedTicketsData?.data || [];

  // If a ticket is selected, show the details view
  if (selectedTicketId) {
    return (
      <TicketDetails 
        ticketId={selectedTicketId} 
        onBack={() => setSelectedTicketId(null)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'claimed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'claimed':
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Ticket className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    try {
      await createTicketMutation.mutateAsync(ticketForm);
      setShowCreateTicket(false);
      setTicketForm({
        module: '',
        topic: '',
        description: '',
        priority: 'MEDIUM'
      });
    } catch (error) {
      console.error('Failed to create ticket:', error);
      
      // Handle specific API errors
      const errorMessage = error?.response?.data?.error?.message || 
                          error?.message || 
                          'Failed to create ticket. Please try again.';
      
      if (errorMessage.includes('required') || errorMessage.includes('missing')) {
        alert('Please fill in all required fields (Module, Topic, and Description).');
      } else if (errorMessage.includes('too long') || errorMessage.includes('length')) {
        alert('One or more fields are too long. Please shorten your input and try again.');
      } else if (errorMessage.includes('duplicate')) {
        alert('You already have a similar ticket. Please check your existing tickets.');
      } else if (errorMessage.includes('permission') || errorMessage.includes('not authorized')) {
        alert('You do not have permission to create tickets. Please contact support.');
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
        alert('You have created too many tickets recently. Please wait before creating another one.');
      } else {
        alert(errorMessage);
      }
    }
  };

  const renderTicketCard = (ticket, type = 'my') => (
    <div
      key={ticket.id}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{ticket.topic}</h3>
          <p className="text-sm text-gray-600">{ticket.module}</p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
          {getStatusIcon(ticket.status)}
          <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
        </div>
      </div>

      {ticket.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Created {formatDate(ticket.createdAt)}</span>
          {ticket.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              ticket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
              ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {ticket.priority}
            </span>
          )}
          {ticket.commentsCount > 0 && (
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{ticket.commentsCount} responses</span>
            </div>
          )}
          {ticket.claimedBy && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Claimed by {ticket.claimedBy.name}</span>
            </div>
          )}
          {ticket.creator && type === 'claimed' && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>By {ticket.creator.name}</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setSelectedTicketId(ticket.id)}
          className="text-navy hover:text-navy-light font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
        {!compact && (
          <button
            onClick={() => setShowCreateTicket(true)}
            className="flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        )}
      </div>

      {!compact && (
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-tickets'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-600 hover:text-navy'
            }`}
          >
            My Tickets ({myTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('claimed-tickets')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'claimed-tickets'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-600 hover:text-navy'
            }`}
          >
            Tickets I've Claimed ({claimedTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('browse-tickets')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'browse-tickets'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-600 hover:text-navy'
            }`}
          >
            Browse Available
          </button>
        </div>
      )}

      <div className="space-y-4">
        {compact ? (
          // Compact view shows both types mixed
          <>
            {myTickets.slice(0, 2).map(ticket => renderTicketCard(ticket, 'my'))}
            {claimedTickets.slice(0, 1).map(ticket => renderTicketCard(ticket, 'claimed'))}
            {(myTickets.length > 2 || claimedTickets.length > 1) && (
              <button className="w-full text-center py-3 text-navy hover:text-navy-light font-medium">
                View all tickets
              </button>
            )}
          </>
        ) : (
          // Full view with tabs
          <>
            {activeTab === 'my-tickets' && (
              <>
                {myTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                    <p className="text-gray-600 mb-4">Create a ticket when you need help with a specific topic.</p>
                    <button
                      onClick={() => setShowCreateTicket(true)}
                      className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-light transition-colors"
                    >
                      Create Your First Ticket
                    </button>
                  </div>
                ) : (
                  myTickets.map(ticket => renderTicketCard(ticket, 'my'))
                )}
              </>
            )}

            {activeTab === 'claimed-tickets' && (
              <>
                {claimedTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No claimed tickets</h3>
                    <p className="text-gray-600">Browse available tickets to help other students.</p>
                  </div>
                ) : (
                  claimedTickets.map(ticket => renderTicketCard(ticket, 'claimed'))
                )}
              </>
            )}

            {activeTab === 'browse-tickets' && (
              <TicketBrowser onTicketSelect={setSelectedTicketId} />
            )}
          </>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowCreateTicket(false)}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateTicket}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Create Support Ticket</h3>
                    <button
                      type="button"
                      onClick={() => setShowCreateTicket(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Module <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.module}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, module: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Mathematics, Programming, Physics"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Topic <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.topic}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, topic: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Calculus derivatives, React hooks, Quantum mechanics"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe what you need help with. Be as specific as possible..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createTicketMutation.isPending}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateTicket(false)}
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

export default SupportTickets;
