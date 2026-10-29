import path from "path";
import pdfPoppler from "pdf-poppler";
import fs from "fs";
import PDFLib from 'pdf-lib';
const { PDFDocument } = PDFLib;


async function getPdfPageCount(filePath) {
    try {
        // Resolve the full path to the PDF
        const absolutePath = path.resolve(filePath);
        // Read the PDF file into a buffer
        const pdfBytes = fs.readFileSync(absolutePath);
        // Load the PDF document using pdf-lib
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        // Get the total number of pages
        const pageCount = pdfDoc.getPageCount();
        return pageCount;
    } catch (error) {
        console.error('Error reading PDF:', error.message);
    }
}

async function convertPdf() {
  
  const filePath = "D:/Leisure/Books/Darth_Bane_01_Path_of_Destruction_-_Drew_Karpyshyn.pdf"

  const directoryPath = "D:/Leisure/Books/Darth_Bane_01_Path_of_Destruction_-_Drew_Karpyshyn"


  const file = path.resolve(filePath); 
  console.log("Beginning process")
  const outputDirectory = path.resolve(directoryPath); 

  let total_pages = await getPdfPageCount(filePath)
  console.log(`Number of pages: ${total_pages}`)

  for (let i = 1; i <= total_pages; i++){

    let option = {
      format: 'jpg',
      out_dir: outputDirectory,
      out_prefix: 'temp',
      page: i 
    };

    try {
      await pdfPoppler.convert(file, option);

      let files = fs.readdirSync(outputDirectory);

      let generatedFile = files.find(f => f.startsWith("temp") && f.endsWith(".jpg"));

      if (generatedFile) {
        let oldPath = path.join(outputDirectory, generatedFile);
        let newFileName = `image_${i}.jpg`;
        let newPath = path.join(outputDirectory, newFileName);

        fs.renameSync(oldPath, newPath);
        console.log(`Saved as: ${newFileName}`);
      }

      console.log(`Converted page ${i} of ${total_pages}`);
    } catch (err) {
      console.error("Conversion failed: ", err);
    }

  }
  console.log("Conversion process complete! Generator 4 now activated!")

}

convertPdf();