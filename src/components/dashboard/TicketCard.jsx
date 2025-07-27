import React from 'react';
import { MessageSquare, User } from 'lucide-react';
import { Card, StatusBadge, PriorityBadge, Button } from '../ui';
import { formatDate, truncateText } from '../../utils/formatters';

const TicketCard = ({ ticket, type = 'my', onSelect, compact = false }) => {
  return (
    <Card 
      hover 
      className="cursor-pointer" 
      onClick={onSelect}
      padding={compact ? 'sm' : 'md'}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">
            {ticket.topic}
          </h3>
          <p className="text-sm text-gray-600 truncate">{ticket.module}</p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      {ticket.description && !compact && (
        <p className="text-sm text-gray-600 mb-3">
          {truncateText(ticket.description, 120)}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <span>Created {formatDate(ticket.createdAt)}</span>
          
          {ticket.priority && (
            <PriorityBadge priority={ticket.priority} />
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
        
        {!compact && (
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TicketCard;
