import emailjs from "@emailjs/browser";

export async function sendTrackingEmail(
  customerName: string,
  customerEmail: string,
  trackingNumber: string,
  trackingStage: string,
  location: string,
) {
  return emailjs.send(
    "service_9c4jkhi",
    "template_afui2tu",
    {
      customer_name: customerName,
      customer_email: customerEmail,
      tracking_number: trackingNumber,
      tracking_stage: trackingStage,
      location: location,
    },
    "UiGEVtRuOH7ef50_",
  );
}
