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
      <title>Taloyhtiönne uusittu julkisivu</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Lumon Suomi</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1e3a5f; margin: 0 0 20px 0; font-size: 20px;">Hei ${name}!</h2>
                  <p style="color: #333333; line-height: 1.6; margin: 0 0 25px 0;">
                    Kiitos mielenkiinnostasi – oheisena näet, miltä taloyhtiönne ${housingCompanyName} voisi näyttää parvekelasituksilla ja hieman suuremmalla muutoksella.
                  </p>
                  
                  <!-- Images -->
                  <div style="margin-bottom: 25px;">
                    <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
                      <strong>Parvekelasitus:</strong> 
                      <a href="${glazingOnlyImageUrl}" target="_blank" style="color: #2d5a87; text-decoration: underline;">Avaa kuva selaimessa →</a>
                    </p>
                    <img src="${glazingOnlyImageUrl}" alt="Parvekelasitus-visualisointi" style="width: 100%; border-radius: 8px; border: 1px solid #e0e0e0;">
                  </div>
                  
                  ${fullModificationImageUrl ? `
                  <div style="margin-bottom: 25px;">
                    <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
                      <strong>Täysi muokkaus:</strong>
                      <a href="${fullModificationImageUrl}" target="_blank" style="color: #2d5a87; text-decoration: underline;">Avaa kuva selaimessa →</a>
                    </p>
                    <img src="${fullModificationImageUrl}" alt="Täysi muokkaus -visualisointi" style="width: 100%; border-radius: 8px; border: 1px solid #e0e0e0;">
                  </div>
                  ` : ''}
                  
                  <!-- Benefits -->
                  <p style="color: #333333; line-height: 1.6; margin: 25px 0 15px 0;">
                    Parvekelasitus ei pelkästään lisää asumismukavuutta, vaan sillä on muitakin etuja, kuten
                  </p>
                  <ul style="color: #333333; line-height: 1.8; margin: 0 0 25px 0; padding-left: 20px;">
                    <li>Suojaa rakenteita säärasitukselta</li>
                    <li>Vähentää melua ja pölyä</li>
                    <li>Nostaa asunnon arvoa</li>
                    <li>Säästää energiaa</li>
                  </ul>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://lumon.com/fi/parvekelasitus/miksi-parvekelasitus/" 
                       target="_blank" 
                       style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 15px;">
                      Lue lisää parvekelasituksesta →
                    </a>
                  </div>
                  
                  <p style="color: #333333; line-height: 1.6; margin: 25px 0 0 0;">
                    Otamme sinuun yhteyttä pian!
                  </p>
                  
                  <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0; font-style: italic;">
                    P.S. Jaa tämä viesti ja kuvat vapaasti myös muille taloyhtiönne hallituksen jäsenille tai isännöitsijälle – yhdessä on helpompi päättää!
                  </p>
                </td>
              </tr>
              
              <!-- Compact Contact Info -->
              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <p style="color: #888888; font-size: 12px; margin: 0; line-height: 1.5;">
                    ${name} | ${housingCompanyName} | ${housingCompanyAddress}, ${housingCompanyCity} | ${phone} | ${email} | ${roleMap[role] || role}
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #666666; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Lumon Suomi
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
      name: process.env.BREVO_SENDER_NAME || 'Lumon Suomi',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@lumon.fi'
    },
    to: [
      { email: email, name: name }
    ],
    bcc: process.env.NOTIFICATION_EMAIL ? [
      { email: process.env.NOTIFICATION_EMAIL }
    ] : [],
    subject: `Taloyhtiönne uusittu julkisivu - olkaa hyvä`,
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
