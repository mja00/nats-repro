# NATS Bug Reproduction

This project reproduces connection thrashing and message duplication under and after packet loss scenarios with NATS.

## Setup

### Prerequisites
- Node.js 20+ 
- Docker and Docker Compose
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mja00/nats-repro
   cd nats-repro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Pumba**  
   Pumba is used to simulate packet loss and latency.
   Install it from [here](https://github.com/alexei-led/pumba) for your platform.

## Running the Application

```bash
docker-compose up --build
```
The container will run and a log will appear every second with the current time.

## Simulating Packet Loss

```bash
pumba -l info netem --duration 5m loss -p 75
```
This will simulate 75% packet loss for 5 minutes.

You will observe the following during the simulation:
- Messages will no longer be received after the loss starts
- Logs about disconnects and reconnects will appear

You will observe the following after the simulation:
- Connections will reconnect
- You'll see multiple message logs received for a single publish

Enabling debug logging will show that there are multiple transports logging messages and passing them to the protocol.


I've included a patch file with a potential solution to the issue. This appears to work fine, however I'm unsure if this is the best solution. It's been running in a production environment for a week with this patch and I've seen no adverse effects.