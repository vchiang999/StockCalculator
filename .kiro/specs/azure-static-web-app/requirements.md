# Requirements Document

## Introduction

This document outlines the requirements for a modern, clean stock price calculator website that will be hosted on Azure Static Web Apps with CI/CD through GitHub. The website will fetch US stock prices from the previous trading day's close and calculate potential price targets based on percentage gains and losses of 5%, 10%, and 15% in both directions.

## Requirements

### Requirement 1

**User Story:** As a stock trader, I want to view the previous day's closing price for US stocks, so that I can make informed trading decisions based on recent market data.

#### Acceptance Criteria

1. WHEN the website loads THEN the system SHALL display a search interface for stock symbols
2. WHEN a user enters a valid US stock symbol THEN the system SHALL fetch and display the previous trading day's closing price
3. WHEN a user enters an invalid stock symbol THEN the system SHALL display an appropriate error message
4. WHEN the market is closed THEN the system SHALL display the most recent trading day's closing price

### Requirement 2

**User Story:** As a stock trader, I want to see calculated price targets for potential gains, so that I can set profit-taking levels for my trades.

#### Acceptance Criteria

1. WHEN a stock's closing price is displayed THEN the system SHALL calculate and show price targets for +5%, +10%, and +15% gains
2. WHEN calculating price targets THEN the system SHALL round prices to two decimal places
3. WHEN displaying price targets THEN the system SHALL clearly label each percentage gain level
4. WHEN price targets are calculated THEN the system SHALL use the formula: target_price = closing_price × (1 + percentage/100)

### Requirement 3

**User Story:** As a stock trader, I want to see calculated price targets for potential losses, so that I can set stop-loss levels for risk management.

#### Acceptance Criteria

1. WHEN a stock's closing price is displayed THEN the system SHALL calculate and show price targets for -5%, -10%, and -15% losses
2. WHEN calculating loss targets THEN the system SHALL round prices to two decimal places
3. WHEN displaying loss targets THEN the system SHALL clearly label each percentage loss level
4. WHEN loss targets are calculated THEN the system SHALL use the formula: target_price = closing_price × (1 - percentage/100)

### Requirement 4

**User Story:** As a user, I want to access a clean and modern website interface, so that I can easily navigate and use the stock calculator without confusion.

#### Acceptance Criteria

1. WHEN the website loads THEN the system SHALL display a responsive design that works on desktop and mobile devices
2. WHEN viewing the interface THEN the system SHALL use a clean, modern design with clear typography and appropriate spacing
3. WHEN interacting with the website THEN the system SHALL provide intuitive navigation and user-friendly controls
4. WHEN data is loading THEN the system SHALL display appropriate loading indicators

### Requirement 5

**User Story:** As a developer, I want the website to be automatically deployed through GitHub CI/CD, so that updates can be pushed to production seamlessly.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch THEN the system SHALL automatically trigger a build and deployment process
2. WHEN the build process runs THEN the system SHALL compile and optimize the website assets
3. WHEN deployment completes successfully THEN the system SHALL make the updated website available on Azure Static Web Apps
4. IF the build or deployment fails THEN the system SHALL maintain the previous working version and notify of the failure

### Requirement 6

**User Story:** As a user, I want the stock data to be accurate and up-to-date, so that I can rely on the calculations for my trading decisions.

#### Acceptance Criteria

1. WHEN fetching stock data THEN the system SHALL use a reliable financial data API
2. WHEN displaying stock information THEN the system SHALL show the date and time of the last price update
3. WHEN the API is unavailable THEN the system SHALL display an appropriate error message
4. WHEN stock data is older than the most recent trading day THEN the system SHALL indicate the data age to the user