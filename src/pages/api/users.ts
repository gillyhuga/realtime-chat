import { NextApiRequest, NextApiResponse } from 'next';
import Ably from 'ably/promises';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ably = new Ably.Realtime.Promise(process.env.ABLY_API_KEY as string);
  const channel = ably.channels.get('chat-giltech');

  try {
    const presenceData = await channel.presence.get();
    const memberCount = presenceData.length;
    res.status(200).json({ memberCount });
  } catch (error) {
    console.error('Error fetching presence data:', error);
    res.status(500).json({ error: 'Failed to fetch presence data' });
  }
}
