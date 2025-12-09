/**
 * API Route: Generate NFT Artwork
 * 
 * @devnote Enhanced algorithm encoding user Reading Profile into visual traits
 * @devnote Generates unique SVG data URL
 */

import { NextRequest, NextResponse } from "next/server";
import { ReaderProfile } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        // @devnote Accept full profile if available, fallback to simple prompt
        const body = await request.json();
        const { prompt, profile } = body; // prompt used for simple flow, profile for wizard

        // @devnote Determine seed from input
        const seedString = profile
            ? `${profile.name}-${profile.lastBook}-${profile.favoriteGenre}`
            : prompt;

        if (!seedString) {
            return NextResponse.json({ error: "Input required" }, { status: 400 });
        }

        const hash = simpleHash(seedString);
        const imageUrl = profile
            ? generateDataDrivenArt(hash, profile)
            : generatePatternUrl(hash);

        return NextResponse.json({ imageUrl }, { status: 200 });
    } catch (error) {
        console.error("[API /generate-nft] Error:", error);
        return NextResponse.json(
            { error: "Generation failed" },
            { status: 500 }
        );
    }
}

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

/**
 * @devnote Generate bespoke art based on Reading Profile
 */
function generateDataDrivenArt(hash: number, profile: ReaderProfile): string {
    // 1. GENRE determines Color Palette
    const palettes: Record<string, string[]> = {
        'Sci-Fi': ['#00f2ea', '#ff0050', '#000000'], // Cyberpunk
        'Philosophy': ['#fdfbf7', '#d4af37', '#2c3e50'], // Gold/Marble
        'Business': ['#0f172a', '#3b82f6', '#10b981'], // Corporate
        'Fiction': ['#ec4899', '#8b5cf6', '#fefce8'], // Dreamy
        'History': ['#78350f', '#d6d3d1', '#292524'], // Parchment
        'Other': ['#6366f1', '#a855f7', '#ec4899'], // Creative
    };

    const colors = palettes[profile.favoriteGenre] || palettes['Other'];

    // 2. GOAL determines Shape Primitive
    const shapes: Record<string, string> = {
        'Growth': 'circle',
        'Entertainment': 'path', // wavy lines
        'Research': 'rect', // structured blocks
        'Escape': 'polygon', // stars/triangles
    };
    const shapeType = shapes[profile.goal] || 'circle';

    // 3. PACE determines Density/Complexity
    const density = profile.pace.includes('25+') ? 50 : profile.pace.includes('13') ? 30 : 15;

    // Generate SVG Content
    let elements = '';
    for (let i = 0; i < density; i++) {
        const x = (hash * (i + 1) * 7) % 256;
        const y = (hash * (i + 1) * 11) % 256;
        const size = ((hash * (i + 1)) % 40) + 10;
        const color = colors[i % colors.length];
        const opacity = 0.3 + ((i % 5) / 10);

        if (shapeType === 'circle') {
            elements += `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" fill-opacity="${opacity}" />`;
        } else if (shapeType === 'rect') {
            elements += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}" fill-opacity="${opacity}" rx="4" />`;
        } else {
            // Triangle/Polygon for others
            elements += `<polygon points="${x},${y} ${x + size},${y + size} ${x - size},${y + size}" fill="${color}" fill-opacity="${opacity}" />`;
        }
    }

    const svg = `
    <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="background:${colors[colors.length - 1]}">
      <defs>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 10 -2" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="${colors[0]}" />
      ${elements}
      <rect width="100%" height="100%" filter="url(#noise)" opacity="0.1" />
      <text x="50%" y="90%" font-family="sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.8">
        ${profile.name.toUpperCase()}
      </text>
    </svg>
  `.trim();

    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * @devnote Legacy fallback for simple flow
 */
function generatePatternUrl(hash: number): string {
    // @devnote Generate deterministic colors from hash
    const hue1 = hash % 360;
    const hue2 = (hash * 7) % 360;
    const hue3 = (hash * 13) % 360;

    const color1 = `hsl(${hue1}, 70%, 60%)`;
    const color2 = `hsl(${hue2}, 70%, 55%)`;
    const color3 = `hsl(${hue3}, 70%, 50%)`;

    // @devnote Create unique gradient pattern SVG
    const svg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${color1};stop-opacity:1" /><stop offset="50%" style="stop-color:${color2};stop-opacity:1" /><stop offset="100%" style="stop-color:${color3};stop-opacity:1" /></linearGradient></defs><rect width="256" height="256" fill="url(#grad1)" /><circle cx="${(hash % 128) + 64}" cy="${((hash * 3) % 128) + 64}" r="${(hash % 50) + 30}" fill="rgba(255,255,255,0.2)" /><circle cx="${((hash * 5) % 128) + 64}" cy="${((hash * 7) % 128) + 64}" r="${(hash % 40) + 20}" fill="rgba(0,0,0,0.1)" /></svg>`;

    // @devnote Convert to base64 data URL
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}
