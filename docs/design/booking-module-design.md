# Technical Design Record: Booking Module

Date: 2025-05-28

## Overview

This document outlines the design of the hut booking module in the Ken platform. It includes UI components, user flow, data flow, and validation logic.

## Components

### Booking_Hut

- Allows the user to:
  - Select a hut
  - Pick available dates
  - Specify the number of kids and adults

### Confirm_Booking

This is a multi-part confirmation section:

- **Confirm_Booking_Form**

  - Displays a summary of the user's booking selections
  - Allows updates to:
    - Selected date
    - Number of kids and adults

- **Special_Items**

  - Lists special items provided by Ken
  - Users can select and adjust quantities based on min/max constraints

- **Add_Services**

  - Displays available additional services
  - Users can add them to the current booking

- **Confirm_Events**
  - Allows users to view and select from available event tickets tied to the hut or timeframe

## Data Flow

1. User selects:

   - A hut
   - A date (from available dates)
   - Number of kids and adults
   - Optional special items

2. User proceeds to the **Confirm Booking** page:

   - Can modify date and guest numbers
   - Can adjust special item quantities
   - Can add event tickets
   - Can add optional services

3. User proceeds to the **Payment Page** to complete the transaction.

## Error Handling & Validation

- **Date Validation**

  - `from` date must be later than today
  - Only dates within the hut's availability range are enabled
  - `to` date must be the same or later than `from` date (minimum 1-day booking)

- **Guest Count Validation**

  - Total number of kids and adults must not exceed hut capacity

- **Special Item Validation**

  - Each item has:
    - A minimum quantity the user can add
    - A maximum quantity limit

- **Feedback**
  - Errors returned from backend are displayed via toast notifications

## Future Improvements

- Integrate payment processing.
