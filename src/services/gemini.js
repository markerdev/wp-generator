const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getGlazingOnlyPrompt, getFullModificationPrompt } = require('../prompts/glazing');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate balcony glazing visualization images using Gemini 3 Pro
 */
async function generateImages(imageBase64, facadeColor, railingMaterial) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.0-pro-image' });

  // Strip data URL prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  // Generate glazing-only image
  console.log('[Gemini] Generating glazing-only image...');
  const glazingOnlyPrompt = getGlazingOnlyPrompt();
  
  const glazingOnlyResult = await model.generateContent([
    { text: glazingOnlyPrompt },
    { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
  ]);

  const glazingOnlyResponse = glazingOnlyResult.response;
  const glazingOnlyImagePart = glazingOnlyResponse.candidates?.[0]?.content?.parts?.find(
    part => part.inlineData
  );

  if (!glazingOnlyImagePart) {
    throw new Error('No image in glazing-only response');
  }

  const glazingOnlyImage = `data:${glazingOnlyImagePart.inlineData.mimeType};base64,${glazingOnlyImagePart.inlineData.data}`;
  console.log('[Gemini] Glazing-only image generated');

  // Check if additional modifications are requested
  const hasAdditionalModifications = 
    (facadeColor && facadeColor !== 'original') || 
    (railingMaterial && railingMaterial !== 'original');

  let fullModificationImage = null;

  if (hasAdditionalModifications) {
    console.log('[Gemini] Generating full modification image...');
    const fullPrompt = getFullModificationPrompt(facadeColor, railingMaterial);

    const fullResult = await model.generateContent([
      { text: fullPrompt },
      { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
    ]);

    const fullResponse = fullResult.response;
    const fullImagePart = fullResponse.candidates?.[0]?.content?.parts?.find(
      part => part.inlineData
    );

    if (fullImagePart) {
      fullModificationImage = `data:${fullImagePart.inlineData.mimeType};base64,${fullImagePart.inlineData.data}`;
      console.log('[Gemini] Full modification image generated');
    } else {
      console.warn('[Gemini] No image in full modification response');
    }
  }

  return {
    glazingOnlyImage,
    fullModificationImage
  };
}

module.exports = { generateImages };
