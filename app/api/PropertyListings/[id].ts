import { NextApiRequest, NextApiResponse } from 'next';
import { getPropertyById } from '../../../_actions/propertyaction';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received ${req.method} request for /api/PropertyListings/${req.query.id}`);

  if (req.method === 'GET') {
    const { id } = req.query;

    if (!id) {
      console.log('Error: ID is required');
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      console.log(`Fetching property with ID: ${id}`);
      const { property, error } = await getPropertyById(id as string);

      if (error) {
        console.log(`Property not found: ${error}`);
        return res.status(404).json({ error });
      }

      console.log('Property fetched successfully:', property);
      return res.status(200).json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      return res.status(500).json({ error: "Failed to fetch property" });
    }
  } else {
    console.log(`Method ${req.method} not allowed`);
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
