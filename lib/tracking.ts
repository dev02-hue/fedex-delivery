/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/tracking.ts
"use server";

import { supabase } from "./supabaseClient";

export interface TrackingPackage {
  current_location: any;
  destination: any;
  last_location: any;
  id: string;
  tracking_number: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  service_type: string;
  recipient_name: string;
  recipient_address: string;
  sender_name: string;
  sender_address: string;
  weight?: string;
  dimensions?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: string;
  package_id: string;
  status: string;
  description: string;
  location: string;
  event_timestamp: string;
  created_at: string;
}

export interface TrackingDetails {
  package: TrackingPackage;
  events: TrackingEvent[];
}

export interface CreatePackageData {
  tracking_number: string;
  service_type: string;
  recipient_name: string;
  recipient_address: string;
  sender_name: string;
  sender_address: string;
  weight?: string;
  dimensions?: string;
  estimated_delivery?: string;
  initial_status?: TrackingPackage['status'];
}

export interface UpdatePackageData {
  tracking_number?: string;
  status?: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  service_type?: string;
  recipient_name?: string;
  recipient_address?: string;
  sender_name?: string;
  sender_address?: string;
  weight?: string;
  dimensions?: string;
  estimated_delivery?: string;
}

// Get tracking details by tracking number
export async function getTrackingDetails(trackingNumber: string): Promise<{
  trackingDetails?: TrackingDetails;
  error?: string;
}> {
  try {
    console.log(`[getTrackingDetails] Fetching details for: ${trackingNumber}`);

    // Get package details
    const { data: packageData, error: packageError } = await supabase
      .from("tracking_packages")
      .select("*")
      .eq("tracking_number", trackingNumber)
      .single();

    if (packageError) {
      console.error("[getTrackingDetails] Error fetching package:", packageError);
      return { error: "Tracking number not found" };
    }

    if (!packageData) {
      return { error: "Tracking number not found" };
    }

    // Get tracking events
    const { data: eventsData, error: eventsError } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("package_id", packageData.id)
      .order("event_timestamp", { ascending: false });

    if (eventsError) {
      console.error("[getTrackingDetails] Error fetching events:", eventsError);
      return { error: "Failed to fetch tracking events" };
    }

    const trackingDetails: TrackingDetails = {
      package: packageData as TrackingPackage,
      events: (eventsData || []) as TrackingEvent[]
    };

    console.log(`[getTrackingDetails] Success! Found package with ${trackingDetails.events.length} events`);
    return { trackingDetails };
  } catch (err) {
    console.error("[getTrackingDetails] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Create new package with initial event
export async function createPackage(packageData: CreatePackageData): Promise<{
  package?: TrackingPackage;
  error?: string;
}> {
  try {
    console.log("[createPackage] Creating new package:", packageData.tracking_number);

    // Check if tracking number already exists
    const { data: existingPackage } = await supabase
      .from("tracking_packages")
      .select("tracking_number")
      .eq("tracking_number", packageData.tracking_number)
      .single();

    if (existingPackage) {
      return { error: "Tracking number already exists" };
    }

    const packageToCreate = {
      tracking_number: packageData.tracking_number,
      status: packageData.initial_status || 'pending',
      service_type: packageData.service_type,
      recipient_name: packageData.recipient_name,
      recipient_address: packageData.recipient_address,
      sender_name: packageData.sender_name,
      sender_address: packageData.sender_address,
      weight: packageData.weight,
      dimensions: packageData.dimensions,
      estimated_delivery: packageData.estimated_delivery,
    };

    const { data, error } = await supabase
      .from("tracking_packages")
      .insert([packageToCreate])
      .select()
      .single();

    if (error) {
      console.error("[createPackage] Error creating package:", error);
      return { error: "Failed to create package" };
    }

    // Create initial tracking event
    const initialEvent = {
      package_id: data.id,
      status: packageData.initial_status || 'pending',
      description: getStatusDescription(packageData.initial_status || 'pending'),
      location: packageData.sender_address.split(',')[0] || 'Origin Facility',
      event_timestamp: new Date().toISOString(),
    };

    await supabase
      .from("tracking_events")
      .insert([initialEvent]);

    console.log("[createPackage] Package created successfully:", data.id);
    return { package: data as TrackingPackage };
  } catch (err) {
    console.error("[createPackage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Update package - can update all fields except id
export async function updatePackage(
  trackingNumber: string, 
  updates: UpdatePackageData
): Promise<{
  package?: TrackingPackage;
  error?: string;
}> {
  try {
    console.log(`[updatePackage] Updating package: ${trackingNumber}`, updates);

    // Check if tracking number is being updated and if it already exists
    if (updates.tracking_number && updates.tracking_number !== trackingNumber) {
      const { data: existingPackage } = await supabase
        .from("tracking_packages")
        .select("tracking_number")
        .eq("tracking_number", updates.tracking_number)
        .single();

      if (existingPackage) {
        return { error: "Tracking number already exists" };
      }
    }

    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Remove any undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from("tracking_packages")
      .update(updateData)
      .eq("tracking_number", trackingNumber)
      .select()
      .single();

    if (error) {
      console.error("[updatePackage] Error updating package:", error);
      return { error: "Failed to update package" };
    }

    console.log("[updatePackage] Package updated successfully");
    return { package: data as TrackingPackage };
  } catch (err) {
    console.error("[updatePackage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Update package status and add tracking event
export async function updatePackageStatus(
  trackingNumber: string,
  status: TrackingPackage['status'],
  description?: string,
  location?: string
): Promise<{
  package?: TrackingPackage;
  event?: TrackingEvent;
  error?: string;
}> {
  try {
    console.log(`[updatePackageStatus] Updating status for: ${trackingNumber} to ${status}`);

    // First get the package
    const { data: packageData, error: packageError } = await supabase
      .from("tracking_packages")
      .select("id, status")
      .eq("tracking_number", trackingNumber)
      .single();

    if (packageError || !packageData) {
      return { error: "Package not found" };
    }

    // Update package status
    const { data: updatedPackage, error: updateError } = await supabase
      .from("tracking_packages")
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq("tracking_number", trackingNumber)
      .select()
      .single();

    if (updateError) {
      console.error("[updatePackageStatus] Error updating package status:", updateError);
      return { error: "Failed to update package status" };
    }

    // Add tracking event
    const eventDescription = description || getStatusDescription(status);
    const eventLocation = location || getDefaultLocation(status, packageData);

    const { data: eventData, error: eventError } = await supabase
      .from("tracking_events")
      .insert([{
        package_id: packageData.id,
        status: status,
        description: eventDescription,
        location: eventLocation,
        event_timestamp: new Date().toISOString(),
      }])
      .select()
      .single();

    if (eventError) {
      console.error("[updatePackageStatus] Error adding tracking event:", eventError);
      // Still return success for package update even if event creation fails
      return { 
        package: updatedPackage as TrackingPackage,
        error: "Package updated but failed to create tracking event" 
      };
    }

    console.log("[updatePackageStatus] Package status updated successfully");
    return { 
      package: updatedPackage as TrackingPackage,
      event: eventData as TrackingEvent
    };
  } catch (err) {
    console.error("[updatePackageStatus] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Delete package
export async function deletePackage(trackingNumber: string): Promise<{
  success?: boolean;
  error?: string;
}> {
  try {
    console.log(`[deletePackage] Deleting package: ${trackingNumber}`);

    const { error } = await supabase
      .from("tracking_packages")
      .delete()
      .eq("tracking_number", trackingNumber);

    if (error) {
      console.error("[deletePackage] Error deleting package:", error);
      return { error: "Failed to delete package" };
    }

    console.log("[deletePackage] Package deleted successfully");
    return { success: true };
  } catch (err) {
    console.error("[deletePackage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Add tracking event
export async function addTrackingEvent(
  trackingNumber: string,
  eventData: Omit<TrackingEvent, 'id' | 'package_id' | 'created_at'>
): Promise<{
  event?: TrackingEvent;
  error?: string;
}> {
  try {
    console.log(`[addTrackingEvent] Adding event for: ${trackingNumber}`);

    // First get the package ID and current status
    const { data: packageData, error: packageError } = await supabase
      .from("tracking_packages")
      .select("id, status")
      .eq("tracking_number", trackingNumber)
      .single();

    if (packageError || !packageData) {
      return { error: "Package not found" };
    }

    const { data, error } = await supabase
      .from("tracking_events")
      .insert([{
        ...eventData,
        package_id: packageData.id
      }])
      .select()
      .single();

    if (error) {
      console.error("[addTrackingEvent] Error adding event:", error);
      return { error: "Failed to add tracking event" };
    }

    // Update package status if it's different
    if (eventData.status !== packageData.status) {
      await supabase
        .from("tracking_packages")
        .update({ status: eventData.status })
        .eq("id", packageData.id);
    }

    console.log("[addTrackingEvent] Event added successfully");
    return { event: data as TrackingEvent };
  } catch (err) {
    console.error("[addTrackingEvent] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Get all packages (for admin view)
export async function getAllPackages(): Promise<{
  packages?: TrackingPackage[];
  error?: string;
}> {
  try {
    console.log("[getAllPackages] Fetching all packages");

    const { data, error } = await supabase
      .from("tracking_packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getAllPackages] Error fetching packages:", error);
      return { error: "Failed to fetch packages" };
    }

    console.log(`[getAllPackages] Found ${data?.length || 0} packages`);
    return { packages: data as TrackingPackage[] };
  } catch (err) {
    console.error("[getAllPackages] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Get package by ID
export async function getPackageById(id: string): Promise<{
  package?: TrackingPackage;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("tracking_packages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[getPackageById] Error fetching package:", error);
      return { error: "Package not found" };
    }

    return { package: data as TrackingPackage };
  } catch (err) {
    console.error("[getPackageById] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Helper function to get status description
function getStatusDescription(status: TrackingPackage['status']): string {
  const descriptions = {
    pending: 'Shipment information received',
    picked_up: 'Package picked up by carrier',
    in_transit: 'Package in transit',
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
    exception: 'Delivery exception'
  };
  return descriptions[status];
}

// Helper function to get default location based on status
function getDefaultLocation(status: TrackingPackage['status'], packageData: any): string {
  const locations = {
    pending: packageData.sender_address?.split(',')[0] || 'Origin Facility',
    picked_up: packageData.sender_address?.split(',')[0] || 'Pickup Location',
    in_transit: 'Distribution Center',
    out_for_delivery: packageData.recipient_address?.split(',')[0] || 'Local Facility',
    delivered: packageData.recipient_address?.split(',')[0] || 'Destination',
    exception: 'Processing Facility'
  };
  return locations[status];
}