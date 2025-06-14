# Vendor-Customer Status Synchronization

## Overview
This document explains how service request statuses are synchronized between vendors and customers in the marketplace platform.

## Status Mapping

### Vendor Side → Customer Side

| Vendor Status | Customer Status | Description |
|---------------|-----------------|-------------|
| `new` | `pending` | Customer submitted request, vendor hasn't viewed yet |
| `viewed` | `pending` | Vendor has seen the request but hasn't responded |
| `quoted` | `quoted` | Vendor sent a quote, customer needs to review |
| `accepted` | `confirmed` | Customer accepted the quote, work can begin |
| `in_progress` | `in_progress` | Vendor is actively working on the service |
| `completed` | `completed` | Work is finished, payment due |
| `declined` | `cancelled` | Vendor declined the request |

## Workflow Process

### 1. Customer Submits Request
- **Customer sees**: "Submitted" → "Pending"
- **Vendor sees**: "New"
- **Action needed**: Vendor should review and respond

### 2. Vendor Reviews Request
- **Vendor action**: Click "Mark as Viewed"
- **Customer sees**: "Pending" (no change)
- **Vendor sees**: "Viewed"
- **Next step**: Send quote or decline

### 3. Vendor Sends Quote
- **Vendor action**: Click "Send Quote" with pricing details
- **Customer sees**: "Quoted" with quote details
- **Vendor sees**: "Quoted" with sent date
- **Next step**: Wait for customer response

### 4. Customer Accepts Quote
- **Customer action**: Accept quote in their portal
- **Customer sees**: "Confirmed" 
- **Vendor sees**: "Accepted" with acceptance date
- **Next step**: Vendor can start work

### 5. Vendor Starts Work
- **Vendor action**: Click "Start Work"
- **Customer sees**: "In Progress"
- **Vendor sees**: "In Progress" with start date
- **Next step**: Complete the work

### 6. Vendor Completes Work
- **Vendor action**: Click "Mark Complete"
- **Customer sees**: "Completed"
- **Vendor sees**: "Completed" with completion date
- **Next step**: Customer payment and review

## Key Features

### Automatic Timestamping
- Quote sent date
- Quote accepted date
- Work started date
- Work completed date

### Status Visibility
- Vendors see both their status and what customers see
- Clear workflow progression
- Historical tracking of status changes

### Communication Integration
- Chat directly from request cards
- Phone call integration
- Status updates notify both parties

## Implementation Notes

### Status Updates
```typescript
const handleStatusUpdate = (requestId: string, newStatus: string) => {
  // Updates both vendor and customer status
  // Adds appropriate timestamps
  // Sends notifications
};
```

### Quote Management
```typescript
const handleSendQuote = () => {
  // Creates quote with pricing
  // Updates status to "quoted"
  // Notifies customer
  // Tracks quote sent date
};
```

This system ensures both vendors and customers always know the current status of service requests while maintaining clear communication and workflow progression.
