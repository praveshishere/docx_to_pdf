declare module "docx-pdf" {
  function convert(
    inputPath: string,
    outputPath: string,
    callback: (error: Error | null, result: string) => void
  ): void;

  export = convert;
}
