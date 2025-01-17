import { extname } from 'path';
import { FileExtensionPriority } from './types.js';

export const DEFAULT_EXTENSION_PRIORITY: FileExtensionPriority = {
  '.ts': 1,    // TypeScript first
  '.js': 2,    // JavaScript second
  '.svelte': 3, // Svelte third
  '.glsl': 4,  // GLSL fourth
  '.vert': 5,  // Vertex shader
  '.frag': 6   // Fragment shader
};

export function determineOutputExtension(
  files: string[],
  priorities: FileExtensionPriority = DEFAULT_EXTENSION_PRIORITY
): string {
  const extensions = files.map((f) => extname(f).toLowerCase());
  const uniqueExts = [...new Set(extensions)];

  // If all files are the same type, use that extension
  if (uniqueExts.length === 1) return uniqueExts[0];

  // Sort by priority and pick the highest priority extension
  const sortedExts = uniqueExts.sort(
    (a, b) => (priorities[a] || 999) - (priorities[b] || 999)
  );

  return sortedExts[0] || '.txt'; // Fallback to .txt if no known extensions
}

export function generateTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
