# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Run the emulator

With flutter installed, run the following command to start the emulator:
```bash
flutter emulators --launch [emulator_id]
```

Example:
```bash
flutter emulators --launch Pixel_4_XL_API_34
```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Cloudinary Setup

This application uses Cloudinary for image uploads. Follow these steps to configure your Cloudinary account:

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/)
2. Go to your Dashboard to get your Cloud Name, API Key, and API Secret
3. Create an upload preset:
   - Go to Settings > Upload
   - Scroll down to "Upload presets" and click "Add upload preset"
   - Set the preset name to "hachiko_uploads" (or update the code to match your preferred name)
   - Configure your preset settings (optional):
     - Set "Mode" to "Signed" for more security
     - Enable auto-tagging, moderation, or other features as needed
     - Configure transformation options as needed
   - Save the preset

4. Update your environment variables:
   ```
   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   EXPO_PUBLIC_CLOUDINARY_API_KEY=your_api_key
   EXPO_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
   ```

### Using the Image Uploader

The application includes a reusable `ImageUploader` component:

```jsx
import ImageUploader from '../components/ImageUploader';

// In your component:
<ImageUploader 
  onImageUploaded={(imageData) => console.log(imageData)}
  folder="your_folder_name"
  width={300}
  height={300}
  placeholder="Tap to upload an image"
/>
```

You can also access the Cloudinary utilities directly using the `useCloudinary` hook:

```jsx
import { useCloudinary } from '../hooks/useCloudinary';

// In your component:
const { 
  pickAndUploadImage, 
  takePhotoAndUpload, 
  getImage, 
  removeImage,
  isUploading,
  uploadProgress,
  uploadError
} = useCloudinary();

// Use these functions to manage images
```

A full example is available at `/app/cloudinary-example.tsx`

# Clerk Webhook Integration

This repository contains a webhook handler for Clerk authentication service. The webhook allows your application to receive real-time notifications when authentication-related events occur, such as user creation, user updates, or user deletion.

## Setup Instructions

### 1. Install Required Dependency

```bash
npm install svix --save
```

### 2. Environment Variables

Add the following environment variable to your project:

```
CLERK_WEBHOOK_SECRET=your_webhook_signing_secret_from_clerk_dashboard
```

You can get the webhook signing secret from the Clerk Dashboard when you create a new webhook endpoint.

### 3. Set up Webhook Endpoint in Clerk Dashboard

1. Go to the Clerk Dashboard for your application
2. Navigate to the "Webhooks" section
3. Click "Add Endpoint"
4. Enter your webhook URL (e.g., `https://your-app.com/webhook`)
5. Select the events you want to subscribe to (e.g., user.created, user.updated, etc.)
6. Save the webhook configuration
7. Copy the Signing Secret and add it to your environment variables as `CLERK_WEBHOOK_SECRET`

### 4. Testing Locally

To test the webhook locally, you'll need to use a service like ngrok to create a public URL that forwards to your local server:

1. Install ngrok: `npm install -g ngrok`
2. Start your application locally
3. In a separate terminal, run: `ngrok http 8081` (or whatever port your app is running on)
4. Copy the ngrok URL (e.g., `https://1234abcd.ngrok.io`)
5. Update your webhook URL in the Clerk Dashboard to the ngrok URL (e.g., `https://1234abcd.ngrok.io/webhook`)
6. Send a test webhook from the Clerk Dashboard

### 5. Implementation Details

The webhook handler is implemented in `app/webhook+api.ts`. It verifies the webhook signature using the Svix library and processes different event types.

## Supported Events

The webhook handler currently supports the following events:

- `user.created`: Triggered when a new user is created
- `user.updated`: Triggered when a user's information is updated
- `user.deleted`: Triggered when a user is deleted
- `session.created`: Triggered when a user creates a new session
- `session.ended`: Triggered when a user's session ends

## Customizing the Webhook Handler

To customize the webhook handler, edit the `app/webhook+api.ts` file. You can add custom logic in the event handlers for each event type:

```typescript
switch (type) {
  case 'user.created': {
    // Your custom logic here
    // e.g., create a user in your database
    break;
  }
  // ... other event types
}
```

## Security Considerations

- The webhook handler verifies the signature of each request to ensure it's coming from Clerk.
- Make sure to keep your webhook secret secure and never commit it to your repository.
- Consider using environment variables for all sensitive configuration.