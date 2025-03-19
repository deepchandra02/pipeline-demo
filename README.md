Let me outline the expected outputs (response formats) for each of the API endpoints used in this application:

1. **`/api/convert-pdf`** (PDF to Images Conversion)

   ```javascript
   {
     "success": true,
     "jobId": "job_12345", // Unique identifier for tracking this processing job
     "pageCount": 3,       // Number of pages converted
     "message": "PDF successfully converted to images"
   }
   ```

2. **`/api/section-images`** (Image Sectioning)

   ```javascript
   {
     "success": true,
     "jobId": "job_12345",
     "sectionCount": 8,    // Total number of sections found across all pages
     "message": "Images successfully sectioned"
   }
   ```

3. **`/api/process-gpt`** (GPT-4o Processing)

   ```javascript
   {
     "success": true,
     "jobId": "job_12345",
     "processedSections": 8,  // Number of sections successfully processed
     "message": "All sections processed with GPT-4o"
   }
   ```

4. **`/api/structure-json`** (JSON Structuring)

   ```javascript
   {
     "success": true,
     "jobId": "job_12345",
     "json": {
       // The structured JSON data containing all processed form information
       "formCode": "ABC123",
       "sections": [
         {
           "sectionId": "section1",
           "title": "Personal Information",
           "fields": [
             {"label": "Full Name", "value": "John Doe", "confidence": 0.98},
             {"label": "Date of Birth", "value": "1980-01-01", "confidence": 0.95}
             // More fields...
           ]
         },
         // More sections...
       ],
       "metadata": {
         "processedAt": "2025-03-19T14:30:00Z",
         "totalPages": 3,
         "totalSections": 8
       }
     },
     "message": "JSON successfully structured"
   }
   ```

5. **`/api/generate-xml`** (XML Generation)

   ```javascript
   {
     "success": true,
     "jobId": "job_12345",
     "xmlPath": "/tmp/job_12345/content.xml",  // Path to the generated XML file
     "message": "XML successfully generated"
   }
   ```

6. **`/api/create-package`** (Package Creation)

   ```javascript
   {
     "success": true,
     "jobId": "job_12345",
     "packageId": "pkg_67890",  // Unique identifier for the generated package
     "message": "Package successfully created"
   }
   ```

7. **`/api/download/:packageId`** (Package Download)
   - This endpoint would return the actual file (binary data) with appropriate headers:
   ```
   Content-Type: application/zip
   Content-Disposition: attachment; filename="form_ABC123_package.zip"
   ```

For error responses, all endpoints would follow a similar format:

```javascript
{
  "success": false,
  "error": {
    "code": "ERR_PROCESSING_FAILED",
    "message": "Failed to process section 3 of page 2"
  }
}
```

These response formats provide:

1. Clear success/failure indicators
2. Job tracking identifiers to maintain state across API calls
3. Relevant counts and statistics for UI feedback
4. Detailed error information when needed
5. The actual processed data where appropriate

When implementing your Flask APIs, ensuring these consistent response formats will make it easier to integrate with the frontend and provide a smooth user experience with proper error handling and progress tracking.
