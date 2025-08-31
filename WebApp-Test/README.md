# Smart Home AI Dashboard

A modern, responsive dashboard for controlling and monitoring a smart home system with AI voice assistant capabilities.

## Features

- **AI Voice Assistant**: Control your smart home with voice commands
- **Climate Control**: Monitor and adjust temperature settings
- **Lighting Control**: Manage lights and brightness levels across different rooms
- **Sensor Monitoring**: Real-time data for temperature, humidity, air quality, motion, and light levels
- **Device Management**: Control smart outlets and other connected devices
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between light and dark modes

## Tech Stack

- **Next.js 15**: React framework for frontend
- **FastAPI**: Python web framework for backend API
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI component library
- **Lucide React**: Icon library
- **React Hook Form**: Form validation
- **Zod**: Schema validation
- **Recharts**: Data visualization

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (package manager)
- Python 3.8+ (for FastAPI backend)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd smart-home-ai
   ```

3. Install frontend dependencies:
   ```bash
   pnpm install
   ```

4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Development

To start the frontend development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

To start the FastAPI backend server:

```bash
uvicorn main:app --reload
```

The backend will be available at [http://localhost:8000](http://localhost:8000).

### Building for Production

To create a production build of the frontend:

```bash
pnpm build
```

To start the production frontend server:

```bash
pnpm start
```

For the backend, use:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Running Tests

To run the backend tests:

```bash
pytest
```

## Project Structure

```
smart-home-ai/
├── app/                 # Next.js app directory
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   └── ...
├── components/          # UI components
│   ├── ai-voice-assistant.tsx
│   ├── climate-control.tsx
│   ├── light-controls.tsx
│   ├── sensor-card.tsx
│   └── smart-outlets.tsx
├── hooks/               # Custom React hooks
├── public/              # Static assets
├── styles/              # Global styles
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
└── ...
```

## Backend API Endpoints

The application uses a FastAPI backend for all API functionality:

### Sensor Endpoints
- `GET /api/sensors/temperature` - Get temperature reading
- `GET /api/sensors/humidity` - Get humidity reading
- `GET /api/sensors/pressure` - Get pressure reading
- `GET /api/sensors/motion` - Get motion detection status
- `GET /api/sensors/light` - Get light level reading

**Note**: The frontend uses individual sensor endpoints for better error handling and granular control, rather than a combined endpoint.

### Device Control Endpoints
- `GET /api/lights` - Get lighting status
- `POST /api/lights` - Control lighting
- `GET /api/outlets` - Get outlet status
- `GET /api/outlets/{outlet_id}` - Get specific outlet status
- `POST /api/outlets/control` - Control outlets
- `GET /api/thermostat` - Get thermostat status
- `POST /api/thermostat` - Control thermostat

## Development

### Frontend Linting

To run the frontend linter:

```bash
pnpm lint
```

### Backend Linting

To run the backend linter (if configured):

```bash
flake8 .
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.