import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// don't cache the results
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    if (LIVEKIT_URL === undefined) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    if (API_KEY === undefined) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (API_SECRET === undefined) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    // Parse agent configuration from request body or environment variable
    const body = await req.json();
    const agentName: string | undefined = body?.room_config?.agents?.[0]?.agent_name || process.env.AGENT_NAME || undefined;

    // DEBUG: Log agent name information
    console.log('=== Agent Dispatch Debug ===');
    console.log('AGENT_NAME from env:', process.env.AGENT_NAME);
    console.log('agentName from body:', body?.room_config?.agents?.[0]?.agent_name);
    console.log('Final agentName being used:', agentName);
    console.log('agentName type:', typeof agentName);
    console.log('agentName length:', agentName?.length);
    if (agentName) {
      console.log('agentName JSON:', JSON.stringify(agentName));
      console.log('agentName has spaces:', agentName.includes(' '));
      console.log('agentName trimmed:', agentName.trim());
    }
    console.log('===========================');

    // Generate participant token
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;

    // Example: room1234567890
    const calledNumber = "+14632239626";
    const roomName = `room_${calledNumber}`;


    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName,
      agentName
    );

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: participantToken,
      participantName,
    };
    const headers = new Headers({
      'Cache-Control': 'no-store',
    });
    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName?: string
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  if (agentName) {
    // Trim whitespace from agent name (spaces can cause matching issues)
    const trimmedAgentName = agentName.trim();
    console.log('Setting roomConfig with agentName:', trimmedAgentName);
    console.log('Original agentName:', JSON.stringify(agentName));
    console.log('Trimmed agentName:', JSON.stringify(trimmedAgentName));
    
    at.roomConfig = new RoomConfiguration({
      agents: [{ agentName: trimmedAgentName }],
    });
    console.log('roomConfig set successfully');
  } else {
    console.log('No agentName provided - using automatic dispatch');
  }

  return at.toJwt();
}
