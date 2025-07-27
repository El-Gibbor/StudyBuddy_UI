import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Ticket,
  Star,
  Flag
} from 'lucide-react';
import { useTicketByIdQuery, useTicketCommentsQuery } from '../../queries';
import { useAddTicketCommentMutation, useClaimTicketMutation, useUpdateTicketMutation } from '../../mutations';
import { useAuth } from '../auth/AuthContext';

const TicketDetails = ({ ticketId, onBack }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showActions, setShowActions] = useState(false);

  // Queries
  const { data: ticketData, isLoading: ticketLoading, error: ticketError } = useTicketByIdQuery(ticketId);
  const { data: commentsData, isLoading: commentsLoading } = useTicketCommentsQuery(ticketId);

  // Mutations
  const addCommentMutation = useAddTicketCommentMutation();
  const claimTicketMutation = useClaimTicketMutation();
  const updateTicketMutation = useUpdateTicketMutation();

  const ticket = ticketData?.data;
  const comments = commentsData?.data || [];

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addCommentMutation.mutateAsync({
        id: ticketId,
        commentData: { content: commentText.trim() }
      });
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleClaimTicket = async () => {
    try {
      await claimTicketMutation.mutateAsync(ticketId);
    } catch (error) {
      console.error('Failed to claim ticket:', error);
      alert('Failed to claim ticket. Please try again.');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateTicketMutation.mutateAsync({
        id: ticketId,
        updateData: { status: newStatus }
      });
      setShowActions(false);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      alert('Failed to update ticket status. Please try again.');
    }
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const canClaimTicket = ticket && ticket.status?.toLowerCase() === 'open' && ticket.creator?.id !== user?.id;
  const canUpdateStatus = ticket && (ticket.creator?.id === user?.id || ticket.claimedBy?.id === user?.id);
  const isTicketClosed = ticket && ['resolved', 'closed'].includes(ticket.status?.toLowerCase());

  if (ticketLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (ticketError || !ticket) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading ticket</h3>
          <p className="text-red-600 mb-4">
            {ticketError?.message || 'Ticket not found'}
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Tickets</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {canClaimTicket && (
              <button
                onClick={handleClaimTicket}
                disabled={claimTicketMutation.isPending}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Star className="w-4 h-4" />
                <span>{claimTicketMutation.isPending ? 'Claiming...' : 'Claim Ticket'}</span>
              </button>
            )}
            
            {canUpdateStatus && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  <Flag className="w-4 h-4" />
                  <span>Actions</span>
                </button>
                
                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      {ticket.status?.toLowerCase() === 'open' && (
                        <button
                          onClick={() => handleUpdateStatus('IN_PROGRESS')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mark as In Progress
                        </button>
                      )}
                      {['claimed', 'in_progress'].includes(ticket.status?.toLowerCase()) && (
                        <button
                          onClick={() => handleUpdateStatus('RESOLVED')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mark as Resolved
                        </button>
                      )}
                      {ticket.status?.toLowerCase() !== 'closed' && (
                        <button
                          onClick={() => handleUpdateStatus('CLOSED')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Close Ticket
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.topic}</h1>
            <p className="text-lg text-gray-600 mb-4">{ticket.module}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
                <span className="capitalize">{ticket.status?.replace('_', ' ')}</span>
              </div>
              
              {ticket.priority && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} Priority
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Created by {ticket.creator?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              {ticket.claimedBy && (
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Claimed by {ticket.claimedBy.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {/* Comments */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
        </div>

        {/* Comments List */}
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'U')}&background=3B82F6&color=fff`}
                    alt={comment.author?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{comment.author?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{formatRelativeTime(comment.createdAt)}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap ml-11">{comment.content}</p>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No comments yet. Be the first to respond!</p>
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        {!isTicketClosed && (
          <form onSubmit={handleAddComment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your thoughts, ask questions, or provide solutions..."
                required
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={addCommentMutation.isPending || !commentText.trim()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>
        )}

        {isTicketClosed && (
          <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
            <p>This ticket is closed. Comments are no longer allowed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
