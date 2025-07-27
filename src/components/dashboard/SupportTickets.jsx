import React, { useState } from 'react';
import { Ticket, User, Plus } from 'lucide-react';
import { useMyCreatedTicketsQuery, useMyClaimedTicketsQuery } from '../../queries';
import { useCreateTicketMutation } from '../../mutations';
import { 
  Card, 
  Button, 
  LoadingCard, 
  EmptyState, 
  useToast,
  Pagination 
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
  const [myTicketsPage, setMyTicketsPage] = useState(1);
  const [claimedTicketsPage, setClaimedTicketsPage] = useState(1);
  const { showSuccess, showError } = useToast();
  const ticketsPageSize = 10;

  // Queries
  const { data: myTicketsData, isLoading: myTicketsLoading } = useMyCreatedTicketsQuery({
    page: myTicketsPage,
    limit: ticketsPageSize
  });
  const { data: claimedTicketsData, isLoading: claimedTicketsLoading } = useMyClaimedTicketsQuery({
    page: claimedTicketsPage,
    limit: ticketsPageSize
  });

  // Mutations
  const createTicketMutation = useCreateTicketMutation();

  const loading = myTicketsLoading || claimedTicketsLoading;
  const myTickets = Array.isArray(myTicketsData?.data) ? myTicketsData.data : [];
  const claimedTickets = Array.isArray(claimedTicketsData?.data) ? claimedTicketsData.data : [];
  const myTicketsPagination = myTicketsData?.meta?.pagination || { page: 1, totalPages: 1, total: 0 };
  const claimedTicketsPagination = claimedTicketsData?.meta?.pagination || { page: 1, totalPages: 1, total: 0 };

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
      setMyTicketsPage(1); // Reset to first page to see new ticket
      showSuccess('Ticket created successfully!');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleMyTicketsPageChange = (page) => {
    setMyTicketsPage(page);
  };

  const handleClaimedTicketsPageChange = (page) => {
    setClaimedTicketsPage(page);
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
        
        {/* Pagination for ticket lists */}
        {!compact && (
          <Pagination
            currentPage={type === 'my' ? myTicketsPage : claimedTicketsPage}
            totalPages={type === 'my' ? myTicketsPagination.totalPages : claimedTicketsPagination.totalPages}
            totalItems={type === 'my' ? myTicketsPagination.total : claimedTicketsPagination.total}
            itemsPerPage={ticketsPageSize}
            onPageChange={type === 'my' ? handleMyTicketsPageChange : handleClaimedTicketsPageChange}
            className="mt-4"
          />
        )}
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
