// ABOUTME: API route for receiving and processing analytics events
// ABOUTME: Handles both single events and batched event submissions

import { NextRequest, NextResponse } from 'next/server';
import { trackEvent, trackEvents } from '@/features/analytics/actions/track-event';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle both single events and batched events
    if (body.events && Array.isArray(body.events)) {
      // Batch event tracking
      const result = await trackEvents(body.events);
      
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          eventsTracked: result.eventsTracked 
        });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else {
      // Single event tracking
      const { eventType, eventData, sessionId, path, timestamp } = body;
      const userAgent = request.headers.get('user-agent') || '';

      if (!eventType || !sessionId) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const result = await trackEvent({
        eventType,
        eventData: eventData || {},
        sessionId,
        path: path || '/',
        userAgent,
        timestamp,
      });

      if (result.success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}