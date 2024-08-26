"use client";
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

const Header = () => {
    const path = usePathname();
    const { user, isSignedIn } = useUser();
    const { cart } = useCart(); // Get cart from context

    useEffect(() => {
        console.log(path);
    }, [path]);

    return (
        <div className='p-6 px-10 flex justify-between shadow-sm fixed top-0 w-full z-10 bg-white'>
            <div className='flex gap-12 items-center'>
                <Image src={'/logo.svg'} width={40} height={40} alt='logo' />
                <ul className='hidden md:flex gap-10'>
                    <Link href={'/'}><li className={`font-semibold text-sm ${path === '/' ? 'text-[#7F57F1]' : 'text-black'}`}>Home</li></Link>
                </ul>
            </div>
            <div className='flex items-center gap-6'>
                {isSignedIn ? (
                    <>
                        <UserButton />
                        <Link href="/cart">
                            <div className="relative">
                                <ShoppingCart className='text-[#7F57F1] hover:text-[#7f57f1e6]' />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                        {cart.length}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </>
                ) : (
                    <Link href='/sign-in'>
                        <Button>
                            Sign In
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
