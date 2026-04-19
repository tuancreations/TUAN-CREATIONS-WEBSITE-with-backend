import { FormEvent, useState } from "react";

type IntakeRoute = "support" | "partner team" | "marketplace matching" | "trust and safety";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general inquiry");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<IntakeRoute | null>(null);

  const classify = (subject: string): IntakeRoute => {
    if (subject.includes("partner")) return "partner team";
    if (subject.includes("service") || subject.includes("market")) return "marketplace matching";
    if (subject.includes("scam") || subject.includes("fraud")) return "trust and safety";
    return "support";
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const route = classify(topic.toLowerCase());
    setResult(route);
    setName("");
    setEmail("");
    setTopic("general inquiry");
    setMessage("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-4 font-display text-5xl">Talk to us about support, partnerships, and service requests.</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="card space-y-4">
          <h2 className="font-display text-2xl">Send a Message</h2>
          <label className="field-label">Name<input className="field-input" value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label className="field-label">Email<input type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="field-label">Topic
            <select className="field-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option>General Inquiry</option>
              <option>Partnership Request</option>
              <option>Service Request</option>
              <option>Scam Report</option>
            </select>
          </label>
          <label className="field-label">Message<textarea className="field-input min-h-24" value={message} onChange={(e) => setMessage(e.target.value)} required /></label>
          <button className="btn-primary" type="submit">Send Inquiry</button>
        </form>

        <div className="space-y-6">
          <div className="card">
            <h2 className="font-display text-2xl">Quick Contact</h2>
            <div className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
              <p>tuancreations.africa@gmail.com</p>
              <p>+256 753 414 058</p>
              <p>Kampala, Uganda</p>
            </div>
          </div>

          <div className="card">
            <h2 className="font-display text-2xl">Next Step</h2>
            <p className="mt-3 text-sm text-[var(--text-soft)]">
              Thank you for reaching out. We route your message to the right team so you get a faster and more relevant response.
            </p>
            <p className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 text-sm">
              {result ? `Your inquiry has been sent to: ${result}` : "Submit your message to see who will handle it."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
