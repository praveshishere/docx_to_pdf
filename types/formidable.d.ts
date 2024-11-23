declare module "formidable" {
  import { IncomingMessage } from "http";

  interface FormidableOptions {
    multiples?: boolean;
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
    maxFields?: number;
    maxFieldsSize?: number;
  }

  interface File {
    filepath: string;
    hash: string | null;
    hashAlgorithm: boolean;
    lastModifiedDate: string;
    mimetype: string;
    newFilename: string;
    originalFilename: string;
    size: number;
  }

  type Fields = { [key: string]: string | string[] };
  type Files = { [key: string]: File | File[] };

  class IncomingForm {
    constructor(options?: FormidableOptions);

    parse(
      req: IncomingMessage,
      callback?: (err: Error | null, fields: Fields, files: Files) => void
    ): Promise<[Fields, Files]>;
  }

  export = (...args) => new IncomingForm(...args);;
}

