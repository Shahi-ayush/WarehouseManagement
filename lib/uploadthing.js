// lib/uploadthing.js (MUST be correct for JavaScript)

import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";

// IMPORTANT: Import the actual router object from your core file.
// **Verify this path is correct** based on where your 'core.js' file is.
import { ourFileRouter } from "@/app/api/uploadthing/core"; 

// Pass the router object to the generator functions.
export const UploadButton = generateUploadButton({ router: ourFileRouter });
export const UploadDropzone = generateUploadDropzone({ router: ourFileRouter });