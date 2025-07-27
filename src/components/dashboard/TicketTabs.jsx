import React from 'react';

const TicketTabs = ({ 
  activeTab, 
  onTabChange, 
  myTicketsCount = 0, 
  claimedTicketsCount = 0 
}) => {
  const tabs = [
    {
      id: 'my-tickets',
      label: `My Tickets (${myTicketsCount})`,
    },
    {
      id: 'claimed-tickets',
      label: `Tickets I've Claimed (${claimedTicketsCount})`,
    },
    {
      id: 'browse-tickets',
      label: 'Browse Available',
    },
  ];

  return (
    <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white text-navy shadow-sm'
              : 'text-gray-600 hover:text-navy'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TicketTabs;
