#!/usr/bin/env node
import { gatherFiles } from './index.js';

const args = process.argv.slice(2);
let outputPath: string | undefined;
let inputFiles: string[];

// Parse arguments
if (args.length === 0) {
  console.error(`
Usage: gather [output-path] <input-file-1> [input-file-2] ...

Examples:
  # Gather components into a new file
  gather components.ts src/lib/components/*.svelte

  # Let gather auto-name the output based on content
  gather src/utils/animate.ts src/components/Molecule.svelte

  # Gather shaders with explicit output
  gather shaders.glsl src/shaders/*.{vert,frag}

  # Gather with auto-generated name (will be placed in generated/ directory)
  gather src/**/*.ts
  `);
  process.exit(1);
}

// First argument could be output path or first input file
if (args.length === 1) {
  inputFiles = [args[0]];
} else {
  // Check if first arg looks like an output path (contains path separators or dots)
  if (args[0].includes('/') || args[0].includes('\\') || args[0].includes('.')) {
    outputPath = args[0];
    inputFiles = args.slice(1);
  } else {
    inputFiles = args;
  }
}

// Execute concatenation
try {
  const result = await gatherFiles(inputFiles, outputPath);
  console.log(`Successfully gathered ${inputFiles.length} files to ${result}`);
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
