"use client";
import { useRouter } from 'next/navigation';

export function Card({ e }) {
  const router = useRouter();

  const handleBookNow = (propertyId) => {
    router.push(`/${propertyId}`);
  };

  return (
    <div className="w-[300px] bg-white p-2 rounded-md shadow-md">
      <div className="h-[200px] overflow-hidden">
        <img
          src={e.images[0] || "https://via.placeholder.com/300x200"}
          alt={e.title}
          className="h-full w-full rounded-t-md object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-2 p-2">
        <h1 className="text-gray-800 font-bold">{e.title}</h1>
        <h1 className="text-gray-500 text-sm">{e.description}</h1>
        <h1 className="text-black font-semibold text-lg">₹ {e.price}</h1>
        <div className="flex justify-between items-center mt-2">
          <a
            className="text-blue-500"
            target="_blank"
            href={`https://www.google.com/maps/place/${e.location}`}
          >
            {e.location}
          </a>
          <button
            onClick={() => handleBookNow(e._id)}
            className="bg-blue-400 p-2 rounded-lg border-b-2 border-gray-500 active:border-b-0 hover:bg-blue-500"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
