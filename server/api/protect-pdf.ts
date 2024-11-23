import { encrypt } from "node-qpdf2-with-qpdf";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import formidable from "formidable";

export default defineEventHandler(async (event) => {
  // Parse the uploaded file
  const form = formidable({ multiples: false });
  const [fields, files] = await form.parse(event.node.req);

  const { file } = files;
  const { password } = fields;
  const uploadedFile = Array.isArray(file) ? file[0] : file;
  const uploadPassword = Array.isArray(password) ? password[0] : password;

  const tempDir = path.join("/tmp", uploadedFile.newFilename); // Temporary file path

  // Move file to temp directory
  await writeFile(tempDir, await readFile(uploadedFile.filepath));

  const outputPdf = tempDir + ".pdf"; // Set output PDF path

  try {

    const pdf = {
      input: tempDir,
      output: outputPdf,
      password: uploadPassword,
    };

    console.log("password is ", uploadPassword)

    await encrypt(pdf);

    // Read the protected PDF and send it as base64
    const protectedPdfBuffer = await readFile(outputPdf);
    const protectedPdfBase64 = protectedPdfBuffer.toString("base64");

    // Clean up the temporary files
    unlink(tempDir);
    unlink(outputPdf);

    return {
      pdf: protectedPdfBase64,
    };

  } catch (error: any) {
    console.log("error", error);
    return sendError(event, createError({ statusCode: 500, statusMessage: 'File conversion failed', data: error }));
  }
});
