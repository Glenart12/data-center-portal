import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { getSession } from '@auth0/nextjs-auth0';

const SITES_FILE_KEY = 'sites/sites-list.json';

// Helper function to get sites from Vercel Blob
async function getSitesFromBlob() {
  console.log('[getSitesFromBlob] Starting to fetch sites from blob...');
  console.log('[getSitesFromBlob] SITES_FILE_KEY:', SITES_FILE_KEY);
  console.log('[getSitesFromBlob] BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

  try {
    // First, try to list all blobs to check if file exists
    console.log('[getSitesFromBlob] Listing blobs with prefix:', SITES_FILE_KEY);
    const { blobs } = await list({ prefix: SITES_FILE_KEY });
    console.log('[getSitesFromBlob] Found blobs:', blobs.length);

    if (blobs.length === 0) {
      console.log('[getSitesFromBlob] No sites file found, initializing with empty array');
      // Initialize with empty array if file doesn't exist
      await saveSitesToBlob([]);
      return [];
    }

    // Get the first matching blob
    const siteBlob = blobs[0];
    console.log('[getSitesFromBlob] Found sites blob:', siteBlob.url);

    // Fetch the sites list
    console.log('[getSitesFromBlob] Fetching sites from URL...');
    const response = await fetch(siteBlob.url);

    if (!response.ok) {
      console.error('[getSitesFromBlob] Failed to fetch sites, status:', response.status);
      throw new Error(`Failed to fetch sites: ${response.status}`);
    }

    const sites = await response.json();
    console.log('[getSitesFromBlob] Successfully fetched sites, count:', sites.length);
    return sites;
  } catch (error) {
    console.error('[getSitesFromBlob] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // If there's an error, try to initialize with empty array
    if (error.message && error.message.includes('404')) {
      console.log('[getSitesFromBlob] File not found, creating new empty sites file');
      await saveSitesToBlob([]);
      return [];
    }

    // For other errors, return empty array but log the issue
    console.error('[getSitesFromBlob] Returning empty array due to error');
    return [];
  }
}

// Helper function to save sites to Vercel Blob
async function saveSitesToBlob(sites) {
  console.log('[saveSitesToBlob] Attempting to save sites, count:', sites.length);
  console.log('[saveSitesToBlob] BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

  try {
    const sitesJson = JSON.stringify(sites, null, 2);
    console.log('[saveSitesToBlob] JSON string length:', sitesJson.length);

    const blob = await put(SITES_FILE_KEY, sitesJson, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false, // Keep the exact filename
      allowOverwrite: true // Add this to allow updating existing file
    });

    console.log('[saveSitesToBlob] Successfully saved sites to blob:', blob.url);
    return blob;
  } catch (error) {
    console.error('[saveSitesToBlob] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
}

// GET all sites
export async function GET(request) {
  console.log('[GET /api/sites] Request received');

  try {
    console.log('[GET /api/sites] Calling getSitesFromBlob...');
    const sites = await getSitesFromBlob();

    console.log('[GET /api/sites] Successfully retrieved sites, count:', sites.length);

    return NextResponse.json({
      success: true,
      sites: sites
    });
  } catch (error) {
    console.error('[GET /api/sites] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch sites',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST new site
export async function POST(request) {
  console.log('[POST /api/sites] Request received');

  try {
    console.log('[POST /api/sites] Parsing request body...');
    const body = await request.json();
    const { name } = body;
    console.log('[POST /api/sites] Site name:', name);

    if (!name || !name.trim()) {
      console.log('[POST /api/sites] Site name is empty or invalid');
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      );
    }

    // Try to get current user session, but don't fail if it's not available
    let userEmail = 'anonymous';
    try {
      console.log('[POST /api/sites] Attempting to get Auth0 session...');
      const session = await getSession(request, NextResponse);
      if (session?.user?.email) {
        userEmail = session.user.email;
        console.log('[POST /api/sites] User email from session:', userEmail);
      } else {
        console.log('[POST /api/sites] No user email in session, using anonymous');
      }
    } catch (sessionError) {
      console.error('[POST /api/sites] Error getting session (non-fatal):', sessionError.message);
      console.log('[POST /api/sites] Continuing with anonymous user');
    }

    // Get existing sites
    console.log('[POST /api/sites] Getting existing sites...');
    const sites = await getSitesFromBlob();
    console.log('[POST /api/sites] Current sites count:', sites.length);

    // Check for duplicate names
    const duplicateSite = sites.find(
      site => site.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicateSite) {
      console.log('[POST /api/sites] Duplicate site name found:', duplicateSite.name);
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
    console.log('[POST /api/sites] Created new site object:', newSite);

    // Add to sites array
    const updatedSites = [...sites, newSite];
    console.log('[POST /api/sites] Total sites after adding:', updatedSites.length);

    // Save to blob
    console.log('[POST /api/sites] Saving updated sites to blob...');
    await saveSitesToBlob(updatedSites);

    console.log('[POST /api/sites] Site created successfully');
    return NextResponse.json({
      success: true,
      site: newSite,
      message: 'Site created successfully'
    });
  } catch (error) {
    console.error('[POST /api/sites] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return NextResponse.json(
      {
        error: 'Failed to create site',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE site
export async function DELETE(request) {
  console.log('[DELETE /api/sites] Request received');

  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('id');
    console.log('[DELETE /api/sites] Site ID to delete:', siteId);

    if (!siteId) {
      console.log('[DELETE /api/sites] No site ID provided');
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    // Get existing sites
    console.log('[DELETE /api/sites] Getting existing sites...');
    const sites = await getSitesFromBlob();
    console.log('[DELETE /api/sites] Current sites count:', sites.length);

    // Filter out the site to delete
    const updatedSites = sites.filter(site => site.id !== siteId);
    console.log('[DELETE /api/sites] Sites after filtering:', updatedSites.length);

    if (sites.length === updatedSites.length) {
      console.log('[DELETE /api/sites] Site not found with ID:', siteId);
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    // Save updated sites to blob
    console.log('[DELETE /api/sites] Saving updated sites to blob...');
    await saveSitesToBlob(updatedSites);

    console.log('[DELETE /api/sites] Site deleted successfully');
    return NextResponse.json({
      success: true,
      message: 'Site deleted successfully'
    });
  } catch (error) {
    console.error('[DELETE /api/sites] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return NextResponse.json(
      {
        error: 'Failed to delete site',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}