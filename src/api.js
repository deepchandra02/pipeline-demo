// src/api.js
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
  return api.post("/convert-pdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const sectionImages = (jobId) => {
  return api.post("/section-images", { jobId });
};

export const processGpt = (jobId, formCode) => {
  return api.post("/process-gpt", { jobId, formCode });
};

export const structureJson = (jobId) => {
  return api.post("/structure-json", { jobId });
};

export const generateXml = (jobId) => {
  return api.post("/generate-xml", { jobId });
};

export const createPackage = (jobId) => {
  return api.post("/create-package", { jobId });
};

export const getDownloadUrl = (packageId) => {
  return `/api/download/${packageId}`;
};
