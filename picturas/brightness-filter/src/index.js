import {createFilterHandler, schemaValidation} from "@picturas/filter-helper";
import sharp from "sharp";

const brightnessSchema = schemaValidation.object({
    brightness: schemaValidation.number().min(0).default(1),
});
async function brightnessHandler(imageBuffer, params) {
    const {brightness} = params;

    return await sharp(imageBuffer)
        .modulate({brightness: brightness})
        .toBuffer();
}

createFilterHandler("brightness", brightnessSchema, brightnessHandler);

