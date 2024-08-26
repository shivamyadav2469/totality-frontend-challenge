"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import CartContext from "@/context/CartContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

interface CartItem {
  _id: number;
  title: string;
  price: number;
  images: string[];
  description: string;
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false); // Loading state

  if (!cart || cart.length === 0) {
    router.push(`/`);
    return null;
  }

  const calculateTotal = (): number => {
    return cart.reduce((total: number, item: CartItem) => {
      const validPrice = isNaN(item.price) ? 0 : item.price;
      const validQuantity = isNaN(item.quantity) ? 0 : item.quantity;
      return total + validPrice * validQuantity;
    }, 0);
  };

  const handleDecrease = (item: CartItem): void => {
    const newCart = cart
      .map((cartItem: CartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
          : cartItem
      )
      .filter((cartItem: CartItem) => cartItem.quantity > 0);

    if (newCart.length === 0) {
      router.push(`/`);
    }

    setCart(newCart);
  };

  const handleIncrease = (item: CartItem): void => {
    const newCart = cart.map((cartItem: CartItem) =>
      cartItem._id === item._id
        ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
        : cartItem
    );

    setCart(newCart);
  };

  const handleDelete = (item: CartItem): void => {
    const newCart = cart.filter(
      (cartItem: CartItem) => cartItem._id !== item._id
    );

    if (newCart.length === 0) {
      router.push(`/`);
    }

    setCart(newCart);
    toast.warning('Item removed from Cart'); 
  };

  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      // Simulate a delay or an actual request here
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/cart/payment");
    } catch (error) {
      console.error("Error during payment process", error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="mx-auto mt-[150px]">
      <div className="flex gap-8 flex-wrap">
        <div className="bg-white flex-2 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
          <ul className="flex flex-col gap-y-10">
            {cart.map((item: CartItem) => (
              <li
                key={item._id}
                className="shadow-md rounded-lg p-5 flex gap-x-5 flex-col md:flex-row"
              >
                <img
                  src={item.images[0] || "https://via.placeholder.com/150"}
                  className="rounded-2xl shadow-xl"
                  alt={item.title}
                  width={150}
                  height={150}
                />
                <div className="flex flex-col gap-y-5 w-full">
                  <span className="w-full md:w-[500px]">
                    <p className="text-xl font-bold">{item.title}</p>
                    <p>{item.description}</p>
                  </span>
                  <span className="text-xl font-bold">₹ {item.price}</span>
                  <div className="flex items-center justify-between gap-x-2">
                    <p className="text-lg text-gray-500 font-semibold">
                      Number of Nights -
                    </p>
                    <div className="flex items-center justify-center gap-x-4">
                      <button
                        className="bg-gray-100 p-5 shadow-sm w-5 h-5 flex justify-center items-center border-2 rounded-lg border-b-4 active:border-b-2 border-gray-300"
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <p className="text-lg font-semibold">
                        {item.quantity || 0}
                      </p>
                      <button
                        className="bg-gray-100 p-5 shadow-sm w-5 h-5 flex justify-center items-center border-2 rounded-lg border-b-4 active:border-b-2 border-gray-300"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(item)}
                      className="bg-rose-500 text-white px-8 p-5 shadow-sm w-5 h-5 flex justify-center items-center border-2 rounded-lg border-b-4 active:border-b-2 border-gray-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex flex-col rounded-xl justify-center items-center bg-white">
          <table className="rounded-lg border border-collapse border-gray-100 p-5">
            <h2 className="font-semibold mb-4 text-xl p-5">Order Summary</h2>
            <tbody className="p-5">
              <tr className="border-b rounded-lg border-gray-400">
                <td className="p-2">
                  <strong>Total Items:</strong>
                </td>
                <td className="p-2 text-lg font-semibold">{cart.length}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="p-2">
                  <strong>Total Amount:</strong>
                </td>
                <td className="p-2 text-lg font-semibold">
                  ₹ {calculateTotal().toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center pt-4">
                  <button
                    onClick={handleProceedToPayment}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                  >
                    Proceed to Payment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default CheckoutPage;
