const express = require('express');
const router = express.Router();
const { generateImages } = require('../services/gemini');
const { uploadImage } = require('../services/storage');
const { sendResultEmail } = require('../services/email');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  try {
    const { imageBase64, facadeColor, railingMaterial, contactData } = req.body;

    // Validate required fields
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    if (!contactData || !contactData.email || !contactData.name) {
      return res.status(400).json({ success: false, error: 'Contact data is required' });
    }

    console.log(`[Generate] Starting image generation for ${contactData.email}`);
    console.log(`[Generate] Options: facade=${facadeColor}, railing=${railingMaterial}`);

    const submissionId = uuidv4();

    // Generate images with Gemini
    const { glazingOnlyImage, fullModificationImage } = await generateImages(
      imageBase64,
      facadeColor,
      railingMaterial
    );

    console.log('[Generate] Images generated successfully');

    // Upload images to Google Cloud Storage
    let glazingOnlyUrl = '';
    let fullModificationUrl = '';

    try {
      glazingOnlyUrl = await uploadImage(
        glazingOnlyImage,
        `${submissionId}-glazing-only.png`
      );
      console.log('[Generate] Glazing-only image uploaded:', glazingOnlyUrl);

      if (fullModificationImage) {
        fullModificationUrl = await uploadImage(
          fullModificationImage,
          `${submissionId}-full-modification.png`
        );
        console.log('[Generate] Full modification image uploaded:', fullModificationUrl);
      }
    } catch (uploadError) {
      console.error('[Generate] Storage upload error:', uploadError);
      // Continue with base64 images if upload fails
      glazingOnlyUrl = glazingOnlyImage;
      fullModificationUrl = fullModificationImage || '';
    }

    // Send email in background (don't await)
    sendResultEmail({
      email: contactData.email,
      name: contactData.name,
      housingCompanyName: contactData.housingCompanyName,
      housingCompanyAddress: contactData.housingCompanyAddress,
      housingCompanyCity: contactData.housingCompanyCity,
      phone: contactData.phone,
      role: contactData.role,
      facadeColor,
      railingMaterial,
      glazingOnlyImageUrl: glazingOnlyUrl,
      fullModificationImageUrl: fullModificationUrl
    }).catch(err => {
      console.error('[Generate] Email send error:', err);
    });

    console.log('[Generate] Returning response');

    return res.json({
      success: true,
      glazingOnlyImage: glazingOnlyUrl,
      fullModificationImage: fullModificationUrl
    });

  } catch (error) {
    console.error('[Generate] Error:', error);
    
    // Handle specific error types
    if (error.message?.includes('rate limit') || error.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Image generation failed',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
