import React, { useState } from 'react';
import { Ticket, User, Plus } from 'lucide-react';
import { useMyCreatedTicketsQuery, useMyClaimedTicketsQuery } from '../../queries';
import { useCreateTicketMutation } from '../../mutations';
import { 
  Card, 
  Button, 
  LoadingCard, 
  EmptyState, 
  useToast 
} from '../ui';
import { getErrorMessage } from '../../utils/errorHandling';
import TicketDetails from './TicketDetails';
import TicketBrowser from './TicketBrowser';
import TicketCard from './TicketCard';
import CreateTicketModal from './CreateTicketModal';
import TicketTabs from './TicketTabs';

const SupportTickets = ({ compact = false }) => {
  const [activeTab, setActiveTab] = useState('my-tickets');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const { showSuccess, showError } = useToast();

  // Queries
  const { data: myTicketsData, isLoading: myTicketsLoading } = useMyCreatedTicketsQuery();
  const { data: claimedTicketsData, isLoading: claimedTicketsLoading } = useMyClaimedTicketsQuery();

  // Mutations
  const createTicketMutation = useCreateTicketMutation();

  const loading = myTicketsLoading || claimedTicketsLoading;
  const myTickets = Array.isArray(myTicketsData?.data) ? myTicketsData.data : [];
  const claimedTickets = Array.isArray(claimedTicketsData?.data) ? claimedTicketsData.data : [];

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
    return <LoadingCard message="Loading tickets..." />;
  }

  const handleCreateTicket = async (ticketData) => {
    try {
      await createTicketMutation.mutateAsync(ticketData);
      setShowCreateTicket(false);
      showSuccess('Ticket created successfully!');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const renderTicketList = (tickets, type) => {
    if (tickets.length === 0) {
      const emptyConfig = {
        'my': {
          icon: Ticket,
          title: 'No support tickets',
          description: 'Create your first ticket to get help from other students.',
          action: (
            <Button onClick={() => setShowCreateTicket(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          )
        },
        'claimed': {
          icon: User,
          title: 'No claimed tickets',
          description: 'Browse available tickets to help other students.'
        }
      };

      const config = emptyConfig[type] || emptyConfig.my;
      return <EmptyState {...config} />;
    }

    return (
      <div className="space-y-4">
        {tickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            type={type}
            onSelect={() => setSelectedTicketId(ticket.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
          {!compact && (
            <Button onClick={() => setShowCreateTicket(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          )}
        </div>

        {!compact && (
          <TicketTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            myTicketsCount={myTickets.length}
            claimedTicketsCount={claimedTickets.length}
          />
        )}

        {compact ? (
          // Compact view shows mixed tickets
          <div className="space-y-4">
            {myTickets.slice(0, 2).map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                type="my"
                onSelect={() => setSelectedTicketId(ticket.id)}
                compact
              />
            ))}
            {claimedTickets.slice(0, 1).map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                type="claimed"
                onSelect={() => setSelectedTicketId(ticket.id)}
                compact
              />
            ))}
            {(myTickets.length > 2 || claimedTickets.length > 1) && (
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setActiveTab('my-tickets')}
              >
                View all tickets
              </Button>
            )}
          </div>
        ) : (
          // Full view with tabs
          <>
            {activeTab === 'my-tickets' && renderTicketList(myTickets, 'my')}
            {activeTab === 'claimed-tickets' && renderTicketList(claimedTickets, 'claimed')}
            {activeTab === 'browse-tickets' && (
              <TicketBrowser onTicketSelect={setSelectedTicketId} />
            )}
          </>
        )}
      </Card>

      <CreateTicketModal
        isOpen={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        onSubmit={handleCreateTicket}
        isLoading={createTicketMutation.isPending}
      />
    </>
  );
};

export default SupportTickets;
