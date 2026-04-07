import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/utils/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.warn('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    return new Response('Webhook secret missing', { status: 500 });
  }

  // Get the headers from current request
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the event
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name } = evt.data;
    
    const firstNameStr = first_name || '';
    const lastNameStr = last_name || '';
    const fullName = `${firstNameStr} ${lastNameStr}`.trim() || 'Unknown User';

    try {
      // Upsert into Supabase user_profiles
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
          user_id: id,
          full_name: fullName,
          // research_access_level uses 'Basic' by default specified in DB if not provided
          last_sync_timestamp: new Date().toISOString()
        });
        
      if (error) {
        console.error("Supabase upsert error:", error);
        return new Response('Error syncing to database', { status: 500 });
      }
      
      return NextResponse.json({ success: true });
    } catch (dbErr) {
      console.error("Database operation failed:", dbErr);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
