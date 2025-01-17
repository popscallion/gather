export interface GatherOptions {
  /**
   * Directory to output gathered files to
   * @default "generated"
   */
  outputDir?: string;

  /**
   * Custom comment prefix for file headers
   * @default "//"
   */
  commentPrefix?: string;

  /**
   * Number of newlines between files
   * @default 2
   */
  fileSeparation?: number;

  /**
   * Whether to create output directory if it doesn't exist
   * @default true
   */
  createOutputDir?: boolean;
}

export interface FileExtensionPriority {
  [key: string]: number;
}
