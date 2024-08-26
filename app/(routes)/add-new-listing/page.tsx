"use client";

import React, { useState } from 'react';

const CreatePropertyForm = () => {
    const [propertyData, setPropertyData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        bedrooms: '',
        amenities: '',
        images: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/PropertyListings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...propertyData,
                    amenities: propertyData.amenities.split(',').map(amenity => amenity.trim()),
                    images: propertyData.images.split(',').map(image => image.trim()),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create property');
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error creating property:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="title" placeholder="Title" value={propertyData.title} onChange={handleChange} />
            <input name="description" placeholder="Description" value={propertyData.description} onChange={handleChange} />
            <input name="location" placeholder="Location" value={propertyData.location} onChange={handleChange} />
            <input name="price" placeholder="Price" value={propertyData.price} onChange={handleChange} />
            <input name="bedrooms" placeholder="Bedrooms" value={propertyData.bedrooms} onChange={handleChange} />
            <input name="amenities" placeholder="Amenities (comma separated)" value={propertyData.amenities} onChange={handleChange} />
            <input name="images" placeholder="Images (comma separated URLs)" value={propertyData.images} onChange={handleChange} />
            <button type="submit">Create Property</button>
        </form>
    );
};

export default CreatePropertyForm;
