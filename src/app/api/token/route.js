import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const POST = async (request) => {
  try {
    const { userId } = await request.json();

    if (!apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: "API key or secret not configured" }),
        { status: 500 }
      );
    }

    const streamClient = new StreamClient(apiKey, apiSecret);

    const newUser = {
      id: userId,
      role: "admin",
      name: userId,
    };

    await streamClient.upsertUsers([newUser]);

    const now = Math.floor(Date.now() / 1000);

    const validity = 60 * 60 * 24; // 1 hour

    const token = streamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: validity,
      issued_at: now,
    });

    return new Response(JSON.stringify({ token }));
  } catch (error) {
    console.error("Error generating token:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }));
  }
};
