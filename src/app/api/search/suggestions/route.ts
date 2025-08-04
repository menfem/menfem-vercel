// ABOUTME: API route for search suggestions functionality
// ABOUTME: Returns autocomplete suggestions for search queries

import { NextRequest, NextResponse } from 'next/server';
import { getSearchSuggestions } from '@/features/search/queries/get-search-suggestions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await getSearchSuggestions(query);

    return NextResponse.json({ 
      suggestions,
      query 
    });
  } catch (error) {
    console.error('Error in search suggestions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}