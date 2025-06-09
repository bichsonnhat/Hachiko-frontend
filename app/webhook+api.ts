import { ProductFromAPI } from '@/constants/app.interface';
import apiService from '@/constants/config/axiosConfig';
import { IUser } from '@/constants/interface/user.interface';
import { Webhook } from 'svix';

// Function to get the Clerk webhook secret from environment variables
const getWebhookSecret = (): string => {
  const secret = process.env.EXPO_PUBLIC_CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error('EXPO_PUBLIC_CLERK_WEBHOOK_SECRET is not defined in environment variables');
    throw new Error('EXPO_PUBLIC_CLERK_WEBHOOK_SECRET is not defined');
  }
  return secret;
};

export async function POST(request: Request) {
  try {
    // Get the Clerk webhook secret
    const webhookSecret = getWebhookSecret();

    // Get the headers
    const svix_id = request.headers.get('svix-id');
    const svix_timestamp = request.headers.get('svix-timestamp');
    const svix_signature = request.headers.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return new Response('Missing svix headers', { status: 400 });
    }

    // Get the body
    const payload = await request.text();

    // Create a new Svix webhook instance with your secret
    const wh = new Webhook(webhookSecret);

    // Verify the webhook
    let evt: any;
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error verifying webhook', { status: 400 });
    }

    // Get the event type and data
    const { type } = evt;
    const eventData = evt.data;
    
    console.log(`Webhook received: ${type}`);

    // Handle the different events
    switch (type) {
      case 'user.created': {
        // Handle user creation
        console.log('User created:', eventData.id);
        
        try {
          // Extract relevant user data from eventData
          const userData = {
            id: eventData.id,
            email: eventData.email_addresses?.[0]?.email_address,
            firstName: eventData.first_name,
            lastName: eventData.last_name,
            isAdmin: false,
            phoneNumber: eventData.phone_numbers?.[0]?.phone_numbers,
          };
          const response = await apiService.post<IUser>(
            "/users",
            userData
          );
          
          console.log('User successfully synchronized with backend:', response.data);
        } catch (error) {
          console.error('Error syncing user to backend:', error);
          // Note: We don't return an error response here to ensure Clerk marks the webhook as successful
          // and doesn't retry, but we log the error for debugging
        }
        
        break;
      }
      case 'user.updated': {
        // Handle user update
        console.log('User updated:', eventData.id);
        // TODO: Add your logic for user update, like updating an entry in your database
        break;
      }
      case 'user.deleted': {
        // Handle user deletion
        console.log('User deleted:', eventData.id);
        // TODO: Add your logic for user deletion, like deleting an entry in your database
        break;
      }
      case 'session.created': {
        // Handle session creation
        console.log('Session created:', eventData.id);
        // TODO: Add your logic for session creation
        break;
      }
      case 'session.ended': {
        // Handle session end
        console.log('Session ended:', eventData.id);
        // TODO: Add your logic for session end
        break;
      }
      default:
        console.log(`Unhandled event type: ${type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new Response(JSON.stringify({ success: true, message: 'Webhook received' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error processing webhook' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 