import { NextResponse } from 'next/server';
import { put, list, del, head } from '@vercel/blob';
import { getSession } from '@auth0/nextjs-auth0';

const SITES_FILE_KEY = 'sites/sites-list.json';

// Helper function to get sites from Vercel Blob
async function getSitesFromBlob() {
  try {
    // Check if the file exists
    const exists = await head(SITES_FILE_KEY).catch(() => null);

    if (!exists) {
      // Initialize with empty array if file doesn't exist
      await saveSitesToBlob([]);
      return [];
    }

    // Fetch the sites list
    const response = await fetch(exists.url);
    const sites = await response.json();
    return sites;
  } catch (error) {
    console.error('Error fetching sites from blob:', error);
    return [];
  }
}

// Helper function to save sites to Vercel Blob
async function saveSitesToBlob(sites) {
  try {
    const blob = await put(SITES_FILE_KEY, JSON.stringify(sites, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });
    return blob;
  } catch (error) {
    console.error('Error saving sites to blob:', error);
    throw error;
  }
}

// GET all sites
export async function GET(request) {
  try {
    const sites = await getSitesFromBlob();

    return NextResponse.json({
      success: true,
      sites: sites
    });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites', details: error.message },
      { status: 500 }
    );
  }
}

// POST new site
export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      );
    }

    // Get current user session
    const session = await getSession(request, NextResponse);
    const userEmail = session?.user?.email || 'unknown';

    // Get existing sites
    const sites = await getSitesFromBlob();

    // Check for duplicate names
    const duplicateSite = sites.find(
      site => site.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicateSite) {
      return NextResponse.json(
        { error: 'A site with this name already exists' },
        { status: 400 }
      );
    }

    // Create new site
    const newSite = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      createdBy: userEmail
    };

    // Add to sites array
    const updatedSites = [...sites, newSite];

    // Save to blob
    await saveSitesToBlob(updatedSites);

    return NextResponse.json({
      success: true,
      site: newSite,
      message: 'Site created successfully'
    });
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create site', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE site
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('id');

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    // Get existing sites
    const sites = await getSitesFromBlob();

    // Filter out the site to delete
    const updatedSites = sites.filter(site => site.id !== siteId);

    if (sites.length === updatedSites.length) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    // Save updated sites to blob
    await saveSitesToBlob(updatedSites);

    return NextResponse.json({
      success: true,
      message: 'Site deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { error: 'Failed to delete site', details: error.message },
      { status: 500 }
    );
  }
}