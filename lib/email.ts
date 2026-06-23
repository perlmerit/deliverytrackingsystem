import emailjs from "@emailjs/browser";

export async function sendTrackingEmail(
  customerName: string,
  customerEmail: string,
  trackingNumber: string,
  trackingStage: string,
  location: string,
) {
  return emailjs.send(
    "service_uy7zf6b",
    "template_dof59sp",
    {
      customer_name: customerName,
      customer_email: customerEmail,
      tracking_number: trackingNumber,
      tracking_stage: trackingStage,
      location: location,
    },
    "UiGEVtRuOH7efE5o_",
  );
}
