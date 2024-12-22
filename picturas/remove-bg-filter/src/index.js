import { createFilterHandler, schemaValidation } from "@picturas/filter-helper";
import { rembg } from "@remove-background-ai/rembg.js";
import { readFileSync } from "fs";
import process from "process";
import dotenv from "dotenv";

dotenv.config();
const removeBgSchema = schemaValidation.object({});

async function removeBgHandler(imageBuffer, _) {
  const apiKey = process.env.API_KEY;

  const {outputImagePath, cleanup} = await rembg({
    apiKey: apiKey,
    inputImage: imageBuffer, 
  })

  const buffer = readFileSync(outputImagePath);
  cleanup();

  console.log('Background removed and saved');
  return buffer;
}

createFilterHandler("remove-bg", removeBgSchema, removeBgHandler);
