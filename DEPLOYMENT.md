# Deployment Guide

## Render.com Deployment

### 1. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `parvekelasitus-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Starter ($7/month) or higher

### 2. Environment Variables

Add these in Render dashboard → Environment:

```
PORT=3000
GEMINI_API_KEY=your-gemini-api-key
GCS_PROJECT_ID=your-gcp-project-id
GCS_BUCKET_NAME=parvekelasitus-images
GCS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GCS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@yourdomain.fi
BREVO_SENDER_NAME=Lumon SmartProtect
NOTIFICATION_EMAIL=totte.blomqvist@duran.fi
ALLOWED_ORIGINS=https://asiakas.fi,https://www.asiakas.fi
```

**Note**: For `GCS_PRIVATE_KEY`, use the escaped format with `\n` for newlines.

---

## Google Cloud Storage Setup

### 1. Create Project & Bucket

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Navigate to Cloud Storage → Buckets
4. Click "Create Bucket"
   - **Name**: `parvekelasitus-images`
   - **Location**: Choose region (e.g., `europe-north1` for Finland)
   - **Storage class**: Standard
   - **Access control**: Fine-grained

### 2. Make Bucket Public

1. Select your bucket
2. Go to "Permissions" tab
3. Click "Grant Access"
4. Add principal: `allUsers`
5. Role: `Storage Object Viewer`

### 3. Create Service Account

1. Go to IAM & Admin → Service Accounts
2. Click "Create Service Account"
   - **Name**: `parvekelasitus-backend`
   - **Role**: Storage Object Admin
3. Click on created account → Keys → Add Key → Create new key
4. Select JSON format
5. Download the JSON file

### 4. Extract Credentials

From the downloaded JSON file, copy:
- `client_email` → `GCS_CLIENT_EMAIL`
- `private_key` → `GCS_PRIVATE_KEY`
- `project_id` → `GCS_PROJECT_ID`

---

## Brevo (Sendinblue) Setup

### 1. Create Account

1. Go to [Brevo](https://www.brevo.com/)
2. Sign up or log in

### 2. Verify Domain

1. Go to Settings → Senders & IP
2. Add and verify your sending domain
3. Follow DNS configuration instructions

### 3. Get API Key

1. Go to Settings → API Keys
2. Create new API key with "Full Access"
3. Copy the key to `BREVO_API_KEY`

---

## Google Gemini API Setup

### 1. Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create new key or use existing
4. Copy to `GEMINI_API_KEY`

---

## WordPress Plugin Installation

### 1. Upload Plugin

1. Download the `parvekelasitus` folder as ZIP
2. WordPress Admin → Plugins → Add New → Upload Plugin
3. Choose the ZIP file and install
4. Activate the plugin

### 2. Add Shortcode

Add to any page or post:

```
[parvekelasitus api_url="https://your-app.onrender.com/api"]
```

### 3. Add Inspiration Images (Optional)

Upload 5 images to:
`wp-content/plugins/parvekelasitus/images/inspiration/`

Name them: `building-1.jpg`, `building-2.jpg`, etc.

Or use external CDN URLs by modifying `parvekelasitus.js`.

---

## Testing

### Health Check

```bash
curl https://your-app.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

### Generate Test

```bash
curl -X POST https://your-app.onrender.com/api/generate-glazing \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "data:image/jpeg;base64,...",
    "facadeColor": "original",
    "railingMaterial": "original",
    "contactData": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+358401234567",
      "housingCompanyName": "Test Company",
      "housingCompanyAddress": "Test St 1",
      "housingCompanyCity": "Helsinki",
      "role": "resident"
    }
  }'
```

---

## Troubleshooting

### CORS Errors

Make sure `ALLOWED_ORIGINS` includes your WordPress site domain (both with and without www).

### Image Generation Fails

1. Check Gemini API key is valid
2. Check API quotas in Google AI Studio
3. Check Render logs for detailed errors

### Email Not Sending

1. Verify Brevo API key
2. Check sender domain is verified
3. Check Render logs for email errors

### Storage Upload Fails

1. Verify GCS credentials
2. Check bucket permissions
3. Ensure service account has Storage Object Admin role
