const donationClaimedEmail = ({
  donorName,
  donationId,
  foodCategory,
  quantityKg,
  ngoName,
}) => ({
  subject: `Your donation ${donationId} has been claimed — HelpingHands Kitchen`,

  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      
      <div style="background: #16a34a; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">
          HelpingHands Kitchen
        </h1>

        <p style="color: #dcfce7; margin: 4px 0 0;">
          Food Rescue Network
        </p>
      </div>

      <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px;">
        
        <h2 style="color: #111827;">
          Great news, ${donorName}! 🎉
        </h2>

        <p style="color: #6b7280;">
          Your donation has been claimed by an NGO.
        </p>

        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          
          <p style="margin: 0 0 8px;">
            <strong>Donation ID:</strong>
            ${donationId}
          </p>

          <p style="margin: 0 0 8px;">
            <strong>Food Category:</strong>
            ${foodCategory}
          </p>

          <p style="margin: 0 0 8px;">
            <strong>Quantity:</strong>
            ${quantityKg} KG
          </p>

          <p style="margin: 0;">
            <strong>Claimed by:</strong>
            ${ngoName}
          </p>

        </div>

        <p style="color: #6b7280;">
          They will coordinate pickup shortly.
          Thank you for making a difference!
        </p>

        <p style="color: #16a34a; font-weight: bold;">
          — Team HelpingHands Kitchen
        </p>

      </div>
    </div>
  `,
});

module.exports = {
  donationClaimedEmail,
};
