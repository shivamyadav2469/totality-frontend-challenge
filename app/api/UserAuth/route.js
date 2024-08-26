// app/api/UserAuth/route.js

import { getAuth } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    const { user } = await getAuth(req);

    // Log the user data to ensure it is valid
    console.log('User data:', user);

    return new Response(JSON.stringify({ userId: user?.id }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
