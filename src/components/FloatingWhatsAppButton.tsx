const WHATSAPP_NUMBER = "256753414058";

export default function FloatingWhatsAppButton() {
  return (
    <a
      className="whatsapp-fab"
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <span className="whatsapp-fab__badge" aria-hidden="true">
        WA
      </span>
      <span className="whatsapp-fab__label">WhatsApp</span>
    </a>
  );
}