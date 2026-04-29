import { useEffect, useState } from "react";
import { Award, Download, Share2 } from "lucide-react";
import { getMyCertificates, type Certificate } from "../../services/api";

export default function CertificatePage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCertificates = async () => {
      try {
        const certs = await getMyCertificates();
        if (isMounted) {
          setCertificates(certs);
        }
      } catch {
        if (isMounted) {
          setCertificates([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCertificates();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = (certificate: Certificate) => {
    // In a real implementation, this would trigger a PDF download
    const link = document.createElement("a");
    link.href = certificate.certificateUrl;
    link.download = `${certificate.certificateNumber}.pdf`;
    link.click();
  };

  const handleShare = (certificate: Certificate) => {
    // In a real implementation, this would share to social media or generate a shareable link
    const text = `I just completed the "${certificate.courseTitle}" course on TUAN Academy! Certificate: ${certificate.certificateNumber}`;
    if (navigator.share) {
      navigator.share({
        title: "TUAN Academy Certificate",
        text,
      });
    } else {
      alert(text);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="card">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3">
          <Award size={24} className="text-yellow-400" />
          <div>
            <h2 className="font-display text-2xl">My Certificates</h2>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              {certificates.length} {certificates.length === 1 ? "certificate" : "certificates"} earned
            </p>
          </div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="card text-center py-12">
          <Award size={48} className="mx-auto mb-4 opacity-20" />
          <h3 className="font-semibold">No certificates yet</h3>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Complete courses to earn certificates and showcase your skills.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => (
            <div key={cert._id || cert.certificateNumber} className="card space-y-4">
              <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/5 p-4">
                <div className="text-center">
                  <Award size={32} className="mx-auto mb-2 text-yellow-400" />
                  <h3 className="font-display text-lg">{cert.courseTitle}</h3>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">Instructor: {cert.instructor}</p>
                  <p className="mt-2 font-mono text-xs text-yellow-300">{cert.certificateNumber}</p>
                </div>
              </div>

              <div className="text-sm text-[var(--text-soft)]">
                <p>
                  <span className="text-xs uppercase">Issued</span>
                  <br />
                  {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(cert)}
                  className="btn-ghost flex-1 flex items-center justify-center gap-2 text-xs"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => handleShare(cert)}
                  className="btn-ghost flex-1 flex items-center justify-center gap-2 text-xs"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
