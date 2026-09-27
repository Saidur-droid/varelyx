# Deploy Varelyx to Google Cloud Run

Varelyx does not require Vercel or Supabase. The prototype is a single Cloud Run service. It can use Firestore for durable state and Vertex AI Gemini for evidence understanding.

## Prerequisites

- A Google Cloud project with billing enabled.
- gcloud authenticated to that project.
- Cloud Run, Cloud Build, and Vertex AI APIs enabled.
- Optional: Firestore Native mode if durable demo state is desired.

## Deploy from source

Deploy the repository source as a Cloud Run service named varelyx in asia-south1. Allow unauthenticated access for the public competition demo. Set:

- GOOGLE_GENAI_USE_VERTEXAI=true
- GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
- GOOGLE_CLOUD_LOCATION=global
- FIRESTORE_ENABLED=false

For final-demo persistence, enable Firestore Native mode and redeploy with FIRESTORE_ENABLED=true. The Cloud Run service account needs Firestore user permissions. Never commit service-account keys.

## Production verification

- /health returns ok: true.
- Reset demo.
- Analyze disruption.
- Confirm Supplier B capacity = 120.
- Prove balanced plan -> PASS.
- Try unverified aggressive plan -> BLOCK.
- Approve and dispatch balanced plan -> action objects appear and survive refresh in Firestore mode.

A live GCP deployment requires the owner's Google Cloud account, billing, IAM, and service authorization.
