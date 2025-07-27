import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  MessageSquare, 
  Send,
  Flag
} from 'lucide-react';
import { useTicketByIdQuery, useTicketCommentsQuery } from '../../queries';
import { useAddTicketCommentMutation, useClaimTicketMutation, useUpdateTicketMutation } from '../../mutations';
import { useAuth } from '../auth/AuthContext';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Button, 
  Textarea, 
  StatusBadge, 
  PriorityBadge,
  LoadingCard,
  EmptyState,
  useToast,
  Pagination 
} from '../ui';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errorHandling';

const TicketDetails = ({ ticketId, onBack }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [commentText, setCommentText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const commentsPageSize = 10;

  // Queries
  const { data: ticketData, isLoading: ticketLoading, error: ticketError } = useTicketByIdQuery(ticketId);
  const { data: commentsData, isLoading: commentsLoading } = useTicketCommentsQuery(ticketId, {
    page: commentsPage,
    limit: commentsPageSize
  });

  // Mutations
  const addCommentMutation = useAddTicketCommentMutation();
  const claimTicketMutation = useClaimTicketMutation();
  const updateTicketMutation = useUpdateTicketMutation();

  const ticket = ticketData?.data;
  const comments = commentsData?.data || [];
  const commentsPagination = commentsData?.meta?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0
  };
  const loading = ticketLoading || commentsLoading;

  const isCreator = ticket?.createdBy?.id === user?.id;
  const isClaimedByMe = ticket?.claimedBy?.id === user?.id;
  const canClaim = ticket?.status === 'OPEN' && !isCreator;
  const canUpdateStatus = isClaimedByMe || isCreator;

  if (loading) {
    return <LoadingCard message="Loading ticket details..." />;
  }

  if (ticketError || !ticket) {
    return (
      <Card>
        <EmptyState
          title="Ticket not found"
          description="The ticket you're looking for doesn't exist or has been removed."
          action={
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          }
        />
      </Card>
    );
  }

  const handleClaimTicket = async () => {
    try {
      await claimTicketMutation.mutateAsync(ticketId);
      showSuccess('Ticket claimed successfully!');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateTicketMutation.mutateAsync({
        ticketId,
        updateData: { status: newStatus }
      });
      showSuccess(`Ticket status updated to ${newStatus.toLowerCase()}`);
      setShowActions(false);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      showError('Please enter a comment');
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        ticketId,
        commentData: { content: commentText }
      });
      setCommentText('');
      setCommentsPage(1); // Reset to first page to see new comment
      showSuccess('Comment added successfully!');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleCommentsPageChange = (page) => {
    setCommentsPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tickets
            </Button>
            
            <div className="flex items-center space-x-2">
              <StatusBadge status={ticket.status} />
              {ticket.priority && (
                <PriorityBadge priority={ticket.priority} />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {ticket.topic}
              </h1>
              <p className="text-lg text-gray-600">{ticket.module}</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Created by {ticket.createdBy?.name || 'Unknown'}</span>
              </div>
              <span>•</span>
              <span>{formatDateTime(ticket.createdAt)}</span>
              {ticket.claimedBy && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <Flag className="w-4 h-4" />
                    <span>Claimed by {ticket.claimedBy.name}</span>
                  </div>
                </>
              )}
            </div>
            
            {ticket.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-4">
              {canClaim && (
                <Button
                  onClick={handleClaimTicket}
                  isLoading={claimTicketMutation.isPending}
                  size="sm"
                >
                  Claim Ticket
                </Button>
              )}
              
              {canUpdateStatus && (
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowActions(!showActions)}
                    size="sm"
                  >
                    Update Status
                  </Button>
                  
                  {showActions && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                      {['IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(status)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          disabled={updateTicketMutation.isPending}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-lg font-semibold">
              Comments ({comments.length})
            </h2>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-4">
              <Textarea
                placeholder="Add a comment to help or ask for clarification..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
              />
              <Button
                type="submit"
                isLoading={addCommentMutation.isPending}
                disabled={!commentText.trim()}
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No comments yet"
                description="Be the first to comment on this ticket."
              />
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {comment.author.name}
                        </span>
                        {comment.author?.id === ticket.createdBy?.id && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Creator
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Comments Pagination */}
            {comments.length > 0 && (
              <Pagination
                currentPage={commentsPage}
                totalPages={commentsPagination.totalPages}
                totalItems={commentsPagination.total}
                itemsPerPage={commentsPageSize}
                onPageChange={handleCommentsPageChange}
                showInfo={false}
                size="sm"
                className="mt-4"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetails;
