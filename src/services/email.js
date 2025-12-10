const SibApiV3Sdk = require('sib-api-v3-sdk');

// Initialize Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send result email with generated images
 */
async function sendResultEmail(data) {
  const {
    email,
    name,
    housingCompanyName,
    housingCompanyAddress,
    housingCompanyCity,
    phone,
    role,
    facadeColor,
    railingMaterial,
    glazingOnlyImageUrl,
    fullModificationImageUrl
  } = data;

  console.log(`[Email] Sending result email to: ${email}`);

  // Build modification details for email
  const facadeColorMap = {
    'light-gray': 'Vaaleanharmaa',
    'white': 'Valkoinen',
    'beige': 'Beige',
    'modern-brick-red': 'Moderni tiilenpunainen',
    'dark-gray': 'Tummanharmaa',
    'original': 'Alkuperäinen'
  };

  const railingMaterialMap = {
    'glass-metal': 'Lasi ja metalli',
    'wooden-slats': 'Puusäleiköt',
    'dark-metal': 'Tumma metalli',
    'original': 'Alkuperäinen'
  };

  const roleMap = {
    'board-member': 'Hallituksen jäsen',
    'property-manager': 'Isännöitsijä',
    'resident': 'Asukas',
    'other': 'Muu'
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Parvekelasitus-visualisointisi</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Lumon SmartProtect</h1>
                  <p style="color: #a8c5e2; margin: 10px 0 0 0; font-size: 14px;">Parvekelasitus-visualisointi</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1e3a5f; margin: 0 0 20px 0; font-size: 20px;">Hei ${name}!</h2>
                  <p style="color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                    Kiitos mielenkiinnostasi Lumon SmartProtect -parvekelasitusta kohtaan! Oheisena ovat visualisoinnit taloyhtiöllenne ${housingCompanyName}.
                  </p>
                  
                  <!-- Contact Details -->
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #1e3a5f; margin: 0 0 15px 0; font-size: 16px;">Yhteystiedot</h3>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr><td style="padding: 5px 0; color: #666;">Nimi:</td><td style="padding: 5px 0; color: #333;">${name}</td></tr>
                      <tr><td style="padding: 5px 0; color: #666;">Sähköposti:</td><td style="padding: 5px 0; color: #333;">${email}</td></tr>
                      <tr><td style="padding: 5px 0; color: #666;">Puhelin:</td><td style="padding: 5px 0; color: #333;">${phone}</td></tr>
                      <tr><td style="padding: 5px 0; color: #666;">Rooli:</td><td style="padding: 5px 0; color: #333;">${roleMap[role] || role}</td></tr>
                    </table>
                  </div>
                  
                  <!-- Housing Company Details -->
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #1e3a5f; margin: 0 0 15px 0; font-size: 16px;">Taloyhtiön tiedot</h3>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr><td style="padding: 5px 0; color: #666;">Nimi:</td><td style="padding: 5px 0; color: #333;">${housingCompanyName}</td></tr>
                      <tr><td style="padding: 5px 0; color: #666;">Osoite:</td><td style="padding: 5px 0; color: #333;">${housingCompanyAddress}</td></tr>
                      <tr><td style="padding: 5px 0; color: #666;">Kaupunki:</td><td style="padding: 5px 0; color: #333;">${housingCompanyCity}</td></tr>
                    </table>
                  </div>
                  
                  <!-- Modification Options -->
                  ${(facadeColor && facadeColor !== 'original') || (railingMaterial && railingMaterial !== 'original') ? `
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #1e3a5f; margin: 0 0 15px 0; font-size: 16px;">Valitut muutokset</h3>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      ${facadeColor && facadeColor !== 'original' ? `<tr><td style="padding: 5px 0; color: #666;">Julkisivun väri:</td><td style="padding: 5px 0; color: #333;">${facadeColorMap[facadeColor] || facadeColor}</td></tr>` : ''}
                      ${railingMaterial && railingMaterial !== 'original' ? `<tr><td style="padding: 5px 0; color: #666;">Kaidemateriaali:</td><td style="padding: 5px 0; color: #333;">${railingMaterialMap[railingMaterial] || railingMaterial}</td></tr>` : ''}
                    </table>
                  </div>
                  ` : ''}
                  
                  <!-- Images -->
                  <h3 style="color: #1e3a5f; margin: 20px 0 15px 0; font-size: 16px;">Visualisoinnit</h3>
                  
                  <div style="margin-bottom: 20px;">
                    <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;"><strong>Parvekelasitus:</strong></p>
                    <img src="${glazingOnlyImageUrl}" alt="Parvekelasitus-visualisointi" style="width: 100%; border-radius: 8px; border: 1px solid #e0e0e0;">
                  </div>
                  
                  ${fullModificationImageUrl ? `
                  <div style="margin-bottom: 20px;">
                    <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;"><strong>Täysi muokkaus:</strong></p>
                    <img src="${fullModificationImageUrl}" alt="Täysi muokkaus -visualisointi" style="width: 100%; border-radius: 8px; border: 1px solid #e0e0e0;">
                  </div>
                  ` : ''}
                  
                  <p style="color: #333333; line-height: 1.6; margin: 20px 0;">
                    Otamme teihin yhteyttä pian keskustellaksemme tarkemmin parvekelasitusmahdollisuuksista taloyhtiöllenne.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #666666; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Lumon SmartProtect. Kaikki oikeudet pidätetään.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const sendSmtpEmail = {
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Lumon SmartProtect',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@lumon.fi'
    },
    to: [
      { email: email, name: name }
    ],
    bcc: process.env.NOTIFICATION_EMAIL ? [
      { email: process.env.NOTIFICATION_EMAIL }
    ] : [],
    subject: `Parvekelasitus-visualisointi: ${housingCompanyName}`,
    htmlContent: htmlContent
  };

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[Email] Email sent successfully, messageId: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    throw error;
  }
}

module.exports = { sendResultEmail };
