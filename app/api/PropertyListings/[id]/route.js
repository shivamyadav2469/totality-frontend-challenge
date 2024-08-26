
import { NextResponse } from 'next/server';
import { getPropertyById } from '../../../../_actions/propertyaction';

export async function GET(request, { params }) {
  try {
    const { id } = params; // Get the dynamic id from the URL parameters

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { property, error } = await getPropertyById(id);

    if (error) {
      return NextResponse.json({ error }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}


// import {getPropertyById} from '../../../../_actions/propertyaction'

// export default async function handler(req, res) {
//   console.log(`Received ${req.method} request for /api/PropertyListings/${req.query.id}`);

//   if (req.method === 'GET') {
//     const { id } = req.query;

//     if (!id) {
//       console.log('Error: ID is required');
//       return res.status(400).json({ error: 'ID is required' });
//     }

//     try {
//       console.log(`Fetching property with ID: ${id}`);
//       const { property, error } = await getPropertyById(id);

//       if (error) {
//         console.log(`Property not found: ${error}`);
//         return res.status(404).json({ error });
//       }

//       console.log('Property fetched successfully:', property);
//       return res.status(200).json(property);
//     } catch (error) {
//       console.error("Error fetching property:", error);
//       return res.status(500).json({ error: "Failed to fetch property" });
//     }
//   } else {
//     console.log(`Method ${req.method} not allowed`);
//     res.setHeader('Allow', ['GET']);
//     return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
//   }
// }


// import { NextResponse } from 'next/server';
// import { getPropertyById } from '../../../_actions/propertyaction';

// export async function GET(request) {
//   const url = new URL(request.url);
//   const id = url.pathname.split('/').pop();

//   if (!id) {
//     return NextResponse.json({ error: 'ID is required' }, { status: 400 });
//   }

//   try {
//     const { property, error } = await getPropertyById(id);

//     if (error) {
//       return NextResponse.json({ error }, { status: 404 });
//     }

//     return NextResponse.json(property, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching property:', error);
//     return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
//   }
// }