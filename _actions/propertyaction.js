"use server";

import propertyModel from '../models/property_Model';
import connectDB from '../config/database';

export async function getproperty() {
    try {
        await connectDB();
        const data = await propertyModel.find();
        return { data };
    } catch (error) {
        console.error("Error fetching properties:", error);
        return { error: "Failed to fetch properties" };
    }
}

export async function createProperty(propertyData) {
    try {
        await connectDB();
        const newProperty = new propertyModel(propertyData);
        await newProperty.save();
        return { message: "Property created successfully", property: newProperty };
    } catch (error) {
        console.error("Error creating property:", error);
        return { error: "Failed to create property" };
    }
}

export async function getPropertyById(id) {
    try {
      await connectDB();
      const property = await propertyModel.findById(id);
      if (!property) {
        return { error: "Property not found" };
      }
      return { property };
    } catch (error) {
      console.error("Error fetching property:", error);
      return { error: "Failed to fetch property" };
    }
  }