import { writeFile, unlink, readFile } from 'fs/promises';
import path from 'path';
import docxConverter from 'docx-pdf';
import formidable from 'formidable';

export default defineEventHandler(async (event) => {
  try {
    // Parse the uploaded file
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(event.node.req);

    const { file } = files;
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    const tempDir = path.join('/tmp', uploadedFile.newFilename) + ".docx"; // Temporary file path

    // Move file to temp directory
    await writeFile(tempDir, await readFile(uploadedFile.filepath));

    const outputPdf = tempDir.replace('.docx', '.pdf'); // Set output PDF path

    // Convert DOCX to PDF
    return new Promise((resolve, reject) => {
      docxConverter(tempDir, outputPdf, async function(error, result) {
        if(error) {
          return reject(error)
        }

        // Return the PDF file
        const pdfData = await readFile(outputPdf);
        resolve(send(event, pdfData, 'application/pdf'));

        // Clean up temporary files
        await unlink(tempDir);
        await unlink(outputPdf);
      });
    });

  } catch (error) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'File conversion failed', data: error }));
  }
});

