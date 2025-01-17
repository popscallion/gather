# gather-code

Quick CLI tool to gather code snippets for prompting LLMs.

## Installation

```bash
npm install gather-code
```

## Usage

### CLI

```bash
# Gather TypeScript files into a new file
gather --output output.ts src/**/*.ts

# Let gather auto-name the output based on content
gather src/**/*.ts

# Gather mixed file types
gather --output combined.ts src/**/*.{ts,js,svelte}
```

### Module

```typescript
import { gatherFiles } from "gather-code";

// Gather files with default options
await gatherFiles(["src/**/*.ts"]);

// Gather with custom options
await gatherFiles(["src/**/*.ts"], "output.ts", {
  commentPrefix: "/**",
  fileSeparation: 3,
  outputDir: "generated",
});
```

## Options

- `outputDir`: Directory to output gathered files to (default: "generated")
- `commentPrefix`: Custom comment prefix for file headers (default: "//")
- `fileSeparation`: Number of newlines between files (default: 2)
- `createOutputDir`: Whether to create output directory if it doesn't exist (default: true)

## File Type Priority

When mixing file types, the output extension is determined by priority:

1. TypeScript (.ts)
2. JavaScript (.js)
3. Svelte (.svelte)
4. GLSL (.glsl)
5. Vertex Shader (.vert)
6. Fragment Shader (.frag)

If no known extensions are found, defaults to .txt.

## License

MIT
