import axios from "axios";

// Base API configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints
export const convertPdf = (formData) => {
  const startTime = Date.now();
  return api.post("/convert-pdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(response => {
    // If backend doesn't provide conversion time, calculate it on the frontend
    if (!response.data.conversionTime) {
      const endTime = Date.now();
      response.data.conversionTime = ((endTime - startTime) / 1000).toFixed(3);
    }
    return response;
  });
};

export const sectionImages = (jobId) => {
  const startTime = Date.now();
  return api.post("/section-images", { jobId }).then(response => {
    // If backend doesn't provide section time, calculate it on the frontend
    if (!response.data.sectionTime) {
      const endTime = Date.now();
      response.data.sectionTime = ((endTime - startTime) / 1000).toFixed(3);
    }
    return response;
  });
};

export const processGpt = (jobId) => {
  const startTime = Date.now();
  return api.post("/process-gpt", { jobId }).then(response => {
    // Calculate processing time if not provided
    if (!response.data.processingTime) {
      const endTime = Date.now();
      response.data.processingTime = ((endTime - startTime) / 1000).toFixed(3);
    }
    return response;
  });
};

export const structureJson = (jobId) => {
  const startTime = Date.now();
  return api.post("/structure-json", { jobId }).then(response => {
    // Calculate structuring time if not provided
    if (!response.data.structureTime) {
      const endTime = Date.now();
      response.data.structureTime = ((endTime - startTime) / 1000).toFixed(3);
    }
    return response;
  });
};

export const generateXml = (jobId) => {
  const startTime = Date.now();
  return api.post("/generate-xml", { jobId }).then(response => {
    // Calculate generation time if not provided
    if (!response.data.generationTime) {
      const endTime = Date.now();
      response.data.generationTime = ((endTime - startTime) / 1000).toFixed(3);
    }
    return response;
  });
};

export const createPackage = (jobId, xmlFilePath) => {
  const startTime = Date.now();
  return api.post("/create-package", { jobId, xmlFilePath }).then(response => {
    // Calculate packaging time if not provided
    if (!response.data.packageTime) {
      const endTime = Date.now();
      response.data.packageTime = ((endTime - startTime) / 1000).toFixed(3);
    }
    return response;
  });
};

export const getDownloadUrl = (packageId) => {
  return `/api/download/${packageId}`;
};
