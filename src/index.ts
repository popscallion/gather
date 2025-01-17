import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { GatherOptions } from './types.js';
import { determineOutputExtension, generateTimestamp } from './utils.js';

const DEFAULT_OPTIONS: Required<GatherOptions> = {
  outputDir: 'generated',
  commentPrefix: '//',
  fileSeparation: 2,
  createOutputDir: true
};

export async function gatherFiles(
  inputFiles: string[],
  outputPath?: string,
  options: GatherOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (!inputFiles.length) {
    throw new Error('No input files provided');
  }

  // Handle output path
  let finalOutputPath = outputPath;
  if (!finalOutputPath) {
    const ext = determineOutputExtension(inputFiles);
    const timestamp = generateTimestamp();
    finalOutputPath = `${opts.outputDir}/gathered-${timestamp}${ext}`;
  }

  // Convert to absolute paths
  const absoluteInputPaths = inputFiles.map(f => resolve(process.cwd(), f));
  const absoluteOutputPath = resolve(process.cwd(), finalOutputPath);

  // Protect against overwriting source files
  if (absoluteInputPaths.includes(absoluteOutputPath)) {
    throw new Error(`Cannot use an input file as the output destination: ${finalOutputPath}`);
  }

  // Ensure output directory exists
  const outputDir = dirname(absoluteOutputPath);
  if (opts.createOutputDir && !existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Process input files
  let gatheredContent = '';
  for (const filePath of inputFiles) {
    try {
      const absolutePath = resolve(process.cwd(), filePath);
      const content = readFileSync(absolutePath, 'utf8');

      // Add file path as comment and content with spacing
      gatheredContent += `${opts.commentPrefix} File: ${filePath}\n`;
      gatheredContent += content;
      gatheredContent += '\n'.repeat(opts.fileSeparation);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error instanceof Error ? error.message : error);
    }
  }

  // Write output
  writeFileSync(absoluteOutputPath, gatheredContent);

  return absoluteOutputPath;
}

export { GatherOptions, FileExtensionPriority } from './types.js';
export { DEFAULT_EXTENSION_PRIORITY } from './utils.js';
