import { NextResponse } from 'next/server';
import { getproperty, getPropertyById, createProperty } from '../../../_actions/propertyaction';

export async function GET(request) {
  try {
    const { id } = request.nextUrl.searchParams;

    if (id) {
      const result = await getPropertyById(id);
      if (result.error) {
        return NextResponse.json(result, { status: 404 });
      }
      return NextResponse.json(result);
    } else {
      const result = await getproperty();
      if (result.error) {
        return NextResponse.json(result, { status: 500 });
      }
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json({ error: 'Failed to handle GET request' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const propertyData = await request.json();
    const result = await createProperty(propertyData);
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: 'Failed to handle POST request' }, { status: 500 });
  }
}
