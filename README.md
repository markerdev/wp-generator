# Parvekelasitus Backend

Node.js/Express backend for balcony glazing visualization using Google Gemini AI.

## Features

- **Image Generation**: Uses Google Gemini 3 Pro for AI-powered image transformation
- **Cloud Storage**: Stores generated images in Google Cloud Storage
- **Email Notifications**: Sends result emails via Brevo (Sendinblue)
- **CORS Support**: Configurable allowed origins for security

## API Endpoints

### `POST /api/generate-glazing`

Generates balcony glazing visualization images.

**Request Body:**
```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "facadeColor": "light-gray|white|beige|modern-brick-red|dark-gray|original",
  "railingMaterial": "glass-metal|wooden-slats|dark-metal|original",
  "contactData": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "housingCompanyName": "string",
    "housingCompanyAddress": "string",
    "housingCompanyCity": "string",
    "role": "board-member|property-manager|resident|other"
  }
}
```

**Response:**
```json
{
  "success": true,
  "glazingOnlyImage": "https://storage.googleapis.com/bucket/...",
  "fullModificationImage": "https://storage.googleapis.com/bucket/..."
}
```

### `GET /api/health`

Health check endpoint.

## Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. Run: `npm start`

## Environment Variables

See `.env.example` for all required variables.

## Deployment on Render.com

See `DEPLOYMENT.md` for detailed deployment instructions.
