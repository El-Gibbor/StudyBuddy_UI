import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  MessageSquare, 
  Star
} from 'lucide-react';
import { useTicketsQuery } from '../../queries';
import { useClaimTicketMutation } from '../../mutations';
import { useAuth } from '../auth/AuthContext';
import { useToast, Pagination } from '../ui';
import { getErrorMessage } from '../../utils/errorHandling';
import TicketDetails from './TicketDetails';

const TicketBrowser = ({ onTicketSelect }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const pageSize = 10;

  // Query parameters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    ...(searchTerm.trim() && { search: searchTerm.trim() }),
    ...(statusFilter && { status: statusFilter }),
    ...(priorityFilter && { priority: priorityFilter }),
    ...(moduleFilter && { module: moduleFilter })
  };

  const { data: ticketsData, isLoading, error } = useTicketsQuery(queryParams);
  const claimTicketMutation = useClaimTicketMutation();

  const tickets = ticketsData?.data?.tickets || [];
  const pagination = ticketsData?.meta?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  };

  // If a ticket is selected and we're in standalone mode, show the details view
  if (selectedTicketId && !onTicketSelect) {
    return (
      <TicketDetails 
        ticketId={selectedTicketId} 
        onBack={() => setSelectedTicketId(null)} 
      />
    );
  }

  const handleSelectTicket = (ticketId) => {
    if (onTicketSelect) {
      onTicketSelect(ticketId);
    } else {
      setSelectedTicketId(ticketId);
    }
  };

  const handleClaimTicket = async (ticketId) => {
    try {
      await claimTicketMutation.mutateAsync(ticketId);
      showSuccess('Ticket claimed successfully!');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const canClaimTicket = (ticket) => {
    return ticket.status?.toLowerCase() === 'open' && ticket.creator?.id !== user?.id;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
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
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tickets</h3>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse Tickets</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLAIMED">Claimed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
          
          <input
            type="text"
            placeholder="Filter by module..."
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-8">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{ticket.topic}</h3>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="capitalize">{ticket.status?.replace('_', ' ')}</span>
                    </div>
                    {ticket.priority && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{ticket.module}</p>
                  
                  {ticket.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>By {ticket.creator?.name || 'Unknown'}</span>
                    </div>
                    <span>Created {formatDate(ticket.createdAt)}</span>
                    {ticket.commentsCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ticket.commentsCount} responses</span>
                      </div>
                    )}
                    {ticket.claimedBy && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>Claimed by {ticket.claimedBy.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {canClaimTicket(ticket) && (
                    <button
                      onClick={() => handleClaimTicket(ticket.id)}
                      disabled={claimTicketMutation.isPending}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Star className="w-4 h-4" />
                      <span>Claim</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleSelectTicket(ticket.id)}
                    className="text-navy hover:text-navy-light font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
        className="mt-6"
      />
    </div>
  );
};

export default TicketBrowser;
