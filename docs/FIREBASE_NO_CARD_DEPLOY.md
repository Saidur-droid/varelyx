# Varelyx — no-card Firebase deployment

This is the primary competition deployment path.

You do **not** need to activate the Google Cloud Free Trial and you do **not** need to add a payment card for this path.

## 1. Create Firebase project

Go to https://console.firebase.google.com/ and choose **Create a project**.

Project name:
**Varelyx AI Builder Cup**

Keep the project on the **Spark (no-cost)** plan. Google Analytics is optional for this demo.

## 2. Add a Web app

Project settings -> Your apps -> Web -> register app.

Copy the Firebase configuration values into:
`public/firebase-config.js`

Do not paste service-account credentials or private keys.

## 3. Enable Anonymous Authentication

Firebase Console -> Build -> Authentication -> Sign-in method -> Anonymous -> Enable.

The demo uses an anonymous Firebase user so each judge/browser gets its own persisted demo session.

## 4. Create Realtime Database

Firebase Console -> Build -> Realtime Database -> Create Database.

Use locked mode. Then deploy the repository's `database.rules.json`, which only allows a signed-in anonymous user to access that user's own demo session.

Spark includes a no-cost Realtime Database allowance.

## 5. Enable Firebase AI Logic

Firebase Console -> AI Services -> AI Logic -> Get started.

When asked for a Gemini API provider, choose:

**Gemini Developer API**

Do **not** choose Agent Platform / Vertex AI for the no-card path because that path requires Blaze/billing.

Keep the project on Spark.

## 6. Configure App Check

Firebase Console -> App Check -> register the Web app -> use reCAPTCHA Enterprise.

Copy the public reCAPTCHA Enterprise site key into:
`public/firebase-config.js`

The site key is not a private secret.

For the public submission, enable the App Check enforcement required by Firebase AI Logic after verifying the deployed app works.

## 7. Deploy Hosting

Install the Firebase CLI on your computer:

    npm install -g firebase-tools

Then, from the repository folder:

    firebase login
    firebase use --add
    firebase deploy --only hosting,database

Select the Varelyx Firebase project when prompted.

Firebase will return a public URL similar to:

    https://YOUR_PROJECT_ID.web.app

## 8. Production verification

Open the public Firebase URL and verify:

1. Header says Firebase connected / Gemini ready.
2. Click **Analyze disruption with Gemini**.
3. The result box must say **LIVE GEMINI VERIFIED**.
4. Confirm supplier capacity = 120.
5. Prove balanced plan -> PASS.
6. Try unsafe proposal -> BLOCK.
7. Approve -> action objects appear.
8. Refresh the page -> persisted state/action objects remain for that anonymous session.
9. Page labels impact numbers as controlled simulation.

If step 3 does not show LIVE GEMINI VERIFIED, the final competition AI requirement is not yet verified.

## Zero-cost guardrail

Do not upgrade Firebase to Blaze for this competition path unless the user explicitly changes the no-paid-services requirement.

The current primary path is intentionally limited to Spark/free-tier-compatible Firebase services.
