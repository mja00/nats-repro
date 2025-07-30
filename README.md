# NATS Bug Reproduction

This project reproduces connection thrashing and message duplication under and after packet loss scenarios with NATS.

## Setup

### Prerequisites
- Node.js 20+ 
- Docker and Docker Compose (optional, for containerized execution)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nats-repro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

### Option 1: Local Development
```bash
npm start
```

### Option 2: Docker (Recommended for consistent environment)
```bash
docker-compose up --build
```

### Option 3: Direct Node execution
```bash
node index.js
```

## What the Application Does

The application:
1. Connects to the NATS demo server (`demo.nats.io`)
2. Creates a unique subject using `nuid.next()`
3. Subscribes to that subject
4. Publishes a message every second with the current timestamp
5. Logs received messages with timestamps
6. Handles connection status changes (disconnect/reconnect)

## Configuration

The application connects to `demo.nats.io` with the following settings:
- `maxReconnectAttempts: -1` (unlimited reconnection attempts)
- `timeout: 10000` (10 second timeout)
- `pingInterval: 10000` (10 second ping interval)
- `maxPingOut: 2` (maximum ping outs before considering connection lost)

## Stopping the Application

Press `Ctrl+C` to gracefully stop the application. The app will:
1. Clear the publishing timer
2. Drain the NATS connection
3. Exit cleanly

## Troubleshooting

- Ensure you have internet connectivity to reach `demo.nats.io`
- Check that Node.js version 20+ is installed
- For Docker issues, ensure Docker and Docker Compose are properly installed
- The application will automatically reconnect if the connection is lost

## Expected Behavior

Under normal conditions, you should see:
- Connection status messages
- Regular message publishing logs
- Received message logs with timestamps

The bug reproduction focuses on connection thrashing and message duplication scenarios that may occur during network instability or packet loss.
