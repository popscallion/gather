#!/usr/bin/env node
import { gatherFiles } from './index.js';
import { resolve, relative } from 'path';
import fastGlob from 'fast-glob';

const HELP_TEXT = `
Usage: gather [--output output-path] [--everything] <input-file-1> [input-file-2] ...

Examples:
  # Gather components into a new file
  gather --output components.ts src/lib/components/*.svelte

  # Let gather auto-name the output based on content
  gather src/utils/animate.ts src/components/Molecule.svelte

  # Gather shaders with explicit output
  gather --output shaders.glsl src/shaders/*.{vert,frag}

  # Gather with auto-generated name (will be placed in generated/ directory)
  gather "src/**/*.ts"

  # Gather all non-hidden files in the project
  gather --everything

Options:
  --help, -h     Show this help message
  --output       Specify output file path
  --everything   Gather all non-hidden files in the project
`;

async function expandGlobs(patterns: string[]): Promise<string[]> {
  try {
    const entries = await fastGlob(patterns, { dot: true });
    return entries;
  } catch (error) {
    console.error('Error expanding glob patterns:', error instanceof Error ? error.message : error);
    return [];
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Handle help flag first
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  let outputPath: string | undefined;
  let inputPatterns: string[] = [];
  let everything = false;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output') {
      if (i + 1 < args.length) {
        outputPath = args[i + 1];
        i++; // Skip next arg since it's the output path
      } else {
        console.error('Error: --output flag requires a path');
        process.exit(1);
      }
    } else if (args[i] === '--everything') {
      everything = true;
    } else if (!args[i].startsWith('-')) {
      inputPatterns.push(args[i]);
    }
  }

  // If --everything flag is used, gather all non-hidden files
  if (everything) {
    inputPatterns = ['**/*'];
  }

  if (inputPatterns.length === 0 && !everything) {
    console.error('Error: No input files specified');
    console.log(HELP_TEXT);
    process.exit(1);
  }

  // Protect against writing to src directory
  if (outputPath) {
    const absOutputPath = resolve(process.cwd(), outputPath);
    const relOutputPath = relative(process.cwd(), absOutputPath);
    if (relOutputPath.startsWith('src/') || relOutputPath === 'src') {
      console.error('Error: Cannot write output to src directory. Please use a different output location.');
      process.exit(1);
    }
  }

  try {
    // Expand glob patterns to actual files
    const inputFiles = await expandGlobs(inputPatterns);
    
    if (inputFiles.length === 0) {
      console.error('Error: No matching files found');
      process.exit(1);
    }

    const result = await gatherFiles(inputFiles, outputPath);
    console.log(`Successfully gathered ${inputFiles.length} files to ${result}`);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
