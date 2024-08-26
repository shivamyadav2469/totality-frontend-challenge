'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { Loader, Star, Home, Boxes, Locate } from 'lucide-react'; 
import Link from 'next/link';
import CartContext from '@/context/CartContext';
import Header from '@/app/_components/Header';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  amenities: string[];
  images: string[];
}

const PropertyDetail: React.FC = () => {
  const params = useParams();
  const id = params.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, setCart } = useContext(CartContext);
  const router = useRouter(); // Hook for navigation

  const fetchProperty = async () => {
    if (!id) return;
  
    try {
      const response = await fetch(`/api/PropertyListings/${id}`);
      
      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      setProperty(data);
      
    } catch (error) {
      setError('Failed to fetch property');
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleCart = (property: Property) => {
    const updatedCart = [...cart, property];
    setCart(updatedCart); 
    toast.success('Item Added to Cart'); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
       <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin relative">
         <div className="absolute inset-0 border-4 border-t-4 border-transparent border-r-blue-600 border-solid rounded-full"></div>
       </div>
     </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (!property) {
    return <div className="text-center py-4">Property not found</div>;
  }

  return (
    <div>
      <Header />
      <main className="pt-10 pb-12 px-2 md:px-0 md:pl-20">
        <div className="mt-20 flex flex-col-reverse md:flex-row">
          <div className="flex flex-col md:w-1/2">
            <div className="max-w-md">
              <div className="pt-10">
                <h1 className="text-4xl font-bold tracking-wide">
                  {property.title}
                </h1>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-3xl">₹ {property.price}</span>
                <div className="flex items-center">
                  <div className="flex gap-2 space-x-px">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="w-5 h-5 rounded-full">
                        <Star className="text-white" fill="#FFC41F" />
                      </div>
                    ))}
                  </div>
                  <div className="pl-2 leading-none">
                    4.9/5.0 <span className="text-gray-900/40">(889)</span>
                  </div>
                </div>
              </div>
              <p className="pt-8 leading-relaxed">{property.description}</p>
              <div className="flex bg-white gap-x-5 w-full md:w-[40%] mt-5 p-4 rounded-2xl shadow-xl justify-center items-center">
                <Home />
                <p className='text-sm'>{property.bedrooms} BEDROOMS</p>
              </div>
              <h1 className="text-xl mt-5 font-bold">Amenities</h1>
              <div className="grid grid-cols-2 gap-5">
                {property.amenities.map((e, index) => (
                  <div
                    key={index}
                    className="flex bg-white gap-x-5 w-full mt-5 p-4 rounded-2xl shadow-xl justify-center items-center"
                  >
                    <Boxes />
                    <p>{e}</p>
                  </div>
                ))}
              </div>

              <div className="flex space-x-6 pt-9">
                <button
                  onClick={() => handleCart(property)}
                  className="py-4 text-sm font-bold text-white uppercase bg-[#7f57f1e6] rounded-sm px-14 hover:bg-[#7f57f1]"
                >
                  Add to cart
                </button>
                <Link
                  href="/cart"
                  className="py-4 text-sm font-bold text-white uppercase bg-[#7f57f1e6] rounded-sm px-14 hover:bg-[#7f57f1]"
                >
                  Go to Cart
                </Link>
              </div>
              <div className="flex bg-white gap-x-5 w-full mt-5 p-4 rounded-2xl shadow-xl">
                <Locate />
                <p>{property.location}</p>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col items-end md:w-1/2">
            <div className="flex flex-col gap-y-6 justify-center">
              <div className="w-[80%]">
                <img
                  className="rounded-xl"
                  src={property.images[0]}
                  width={800}
                  height={400}
                  alt={property.title}
                />
              </div>
              <div className="flex pr-0 md:pr-20 space-x-4">
                {property.images.map((img, index) => (
                  <div
                    key={index}
                    className="w-24 h-20 pl-1 flex justify-center items-center cursor-pointer"
                  >
                    <img
                      className="h-full rounded-md border-2"
                      src={img}
                      width={220}
                      height={300}
                      alt={`Property image ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer /> 
    </div>
  );
};

export default PropertyDetail;
