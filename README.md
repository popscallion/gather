# @popscallion/gather

Elegantly gather code snippets for LLM context. Perfect for preparing code examples and context for AI interactions.

## Installation

```bash
npm install @popscallion/gather
```

## Usage

### Command Line

```bash
# Gather components with explicit output
gather components.ts src/lib/components/*.svelte

# Auto-name output based on content (will be placed in generated/)
gather src/utils/animate.ts src/components/Molecule.svelte

# Gather multiple file types
gather shaders.glsl src/shaders/*.{vert,frag}

# Gather with glob patterns
gather src/**/*.ts
```

### As a Module

```typescript
import { gatherFiles } from '@popscallion/gather';

// Basic gathering
await gatherFiles([
  'src/lib/utils/animate.ts',
  'src/lib/components/Molecule.svelte'
]);

// With explicit output and options
await gatherFiles([
  'src/shaders/vertex.vert',
  'src/shaders/fragment.frag'
], 'shaders.glsl', {
  commentPrefix: '//',
  fileSeparation: 3,
  outputDir: 'custom/output'
});
```

## Options

```typescript
interface GatherOptions {
  // Directory for gathered files
  outputDir?: string;        // default: "generated"

  // Custom comment prefix for file headers
  commentPrefix?: string;    // default: "//"

  // Number of newlines between files
  fileSeparation?: number;   // default: 2

  // Whether to create output directory if it doesn't exist
  createOutputDir?: boolean; // default: true
}
```

## File Type Priority

When gathering different file types without an explicit output extension, the following priority is used:

1. TypeScript (.ts)
2. JavaScript (.js)
3. Svelte (.svelte)
4. GLSL (.glsl)
5. Vertex Shader (.vert)
6. Fragment Shader (.frag)

If all input files have the same extension, that extension will be used. Otherwise, the highest priority extension from the input files is chosen.

## Common Use Cases

1. **Preparing LLM Context**
   ```bash
   gather context.ts src/components/Feature.svelte src/utils/helpers.ts
   ```

2. **Collecting Related Components**
   ```bash
   gather animation.ts src/**/animate*.ts src/**/*Animation*.svelte
   ```

3. **Gathering Implementation Examples**
   ```bash
   gather examples.ts src/**/use*.ts src/**/*.test.ts
   ```

## License

MIT
