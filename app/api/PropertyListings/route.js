import { NextResponse } from 'next/server';
import { getproperty, getProperty, createProperty } from '../../../_actions/propertyaction';

export async function GET(request) {
  try {
    const { id } = request.nextUrl.searchParams;

    if (id) {
      const property = await getProperty(id);
      return NextResponse.json(property);
    } else {
      const properties = await getproperty();
      return NextResponse.json(properties);
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const propertyData = await request.json();
    const createdProperty = await createProperty(propertyData);
    return NextResponse.json(createdProperty, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}


