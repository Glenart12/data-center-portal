# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.3 data center operations portal built with React 19, featuring Auth0 authentication and AI-powered MOP (Method of Procedure) generation using Google's Gemini API. The application manages operational documents (MOPs, SOPs, EOPs) for data center operations.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Testing
No test scripts are currently configured. When adding tests, update this section.

## Architecture

### Authentication & Authorization
- Uses Auth0 for authentication (`@auth0/nextjs-auth0`)
- Protected routes use `withPageAuthRequired` wrapper
- Session management handled via Auth0 middleware
- Redirects unauthenticated users to login

### AI Integration
- Google Gemini 2.5 Pro (`@google/generative-ai`) for MOP generation
- Comprehensive knowledge base in `lib/mop-knowledge.js` with equipment specs, safety requirements, and procedures
- Modular AI generation via `/api/generate-mop-ai/sections/` endpoints for different MOP sections
- Uses Vercel Blob storage (`@vercel/blob`) for file management

### Application Structure
- **App Router**: Uses Next.js 13+ app directory structure
- **Pages**: Dashboard, MOP, SOP, EOP document management pages
- **API Routes**: RESTful endpoints in `app/api/` for file operations, AI generation, and authentication
- **Components**: Reusable UI components in `app/components/`

### Key Components
- `Header.js` - Navigation with user authentication state
- `MOPGenerationModal.js` - AI-powered MOP creation interface
- `DocumentPreviewModal.js` - PDF/document preview functionality
- `UploadButton.js` - File upload handling

### Data Management
- Equipment database with manufacturer specs (Trane, Carrier, York, Liebert, Caterpillar)
- Safety requirements and procedures for electrical, mechanical, and refrigerant work
- Standard tools and verification procedures
- Knowledge base integration for AI context

### File Organization
- Document storage in `/public/` subdirectories (mops/, sops/, eops/)
- Knowledge base modules in `lib/mop-knowledge/`
- API endpoints follow RESTful patterns with proper error handling

## Key Features

### MOP Generation
- AI-powered MOP creation with 11-section standardized format
- Equipment-specific procedures based on manufacturer/model
- Safety requirement integration with OSHA/NFPA compliance
- Real-time generation with progress tracking

### Document Management
- Upload, view, and delete operations for all document types
- PDF preview functionality
- File type validation and error handling
- Document counting and categorization

### User Interface
- Responsive design with glass-morphism effects
- Custom styling using inline styles (no CSS framework)
- Century Gothic font family throughout
- Professional data center branding (Glenart Group)

## Environment Configuration

Required environment variables:
- Auth0 configuration (SECRET, BASE_URL, ISSUER_BASE_URL, CLIENT_ID, CLIENT_SECRET)
- Google AI API key for Gemini integration
- Vercel Blob storage credentials

## Code Conventions

- Uses ES6+ JavaScript (no TypeScript)
- Inline styling with consistent design system
- Error handling with user-friendly messages
- Async/await patterns for API calls
- JSX with Next.js app router conventions

## API Endpoints

### Authentication
- `/api/auth/[...auth0]` - Auth0 authentication handlers

### File Operations
- `/api/files/[type]` - CRUD operations for documents (mops, sops, eops)
- `/api/upload` - File upload handling
- `/api/delete-file` - File deletion
- `/api/serve-html` - HTML document serving

### AI Generation
- `/api/generate-mop-ai` - Main MOP generation endpoint
- `/api/generate-mop-ai/sections/[section]` - Individual section generation
- `/api/generate-mop-ai/sections/compile` - Final document compilation

## Database Schema

The application uses file-based storage via Vercel Blob rather than a traditional database. Document metadata is managed through the blob storage API.

## Security Considerations

- All routes require authentication except landing page
- File upload validation and sanitization
- CORS handling for API endpoints
- Secure environment variable management
- No sensitive data in client-side code