import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

const SITE = "https://cellssyncsolutions.com";

const AdminQRCodes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    (async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    })();
  }, [user, loading, navigate]);

  const urlFor = (id: string) => `${SITE}/product/${id}`;

  const downloadOne = (id: string, name: string) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadAll = () => {
    products.forEach((p, i) => setTimeout(() => downloadOne(p.id, p.name), i * 150));
  };

  const downloadHtml = () => {
    const cells = products
      .map((p) => {
        const canvas = canvasRefs.current[p.id];
        const dataUrl = canvas ? canvas.toDataURL("image/png") : "";
        const url = urlFor(p.id);
        return `
          <td style="border:1px solid #ccc;padding:16px;text-align:center;vertical-align:top;width:33%;">
            <img src="${dataUrl}" width="180" height="180" alt="QR code for ${p.name}" style="display:block;margin:0 auto;" />
            <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:bold;margin-top:8px;">${p.name}</div>
            <div style="font-family:Arial,sans-serif;font-size:10px;color:#555;margin-top:4px;word-break:break-all;">${url}</div>
          </td>`;
      });

    const rows: string[] = [];
    for (let i = 0; i < cells.length; i += 3) {
      rows.push(`<tr>${cells.slice(i, i + 3).join("")}${"<td style=\"border:none\"></td>".repeat(3 - cells.slice(i, i + 3).length)}</tr>`);
    }

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Product QR Codes</title></head>
<body style="font-family:Arial,sans-serif;padding:24px;">
<h1 style="font-size:22px;margin:0 0 4px;">Product QR Codes</h1>
<p style="font-size:12px;color:#555;margin:0 0 16px;">Generated ${new Date().toLocaleString()} — select all (Ctrl/Cmd+A) and copy into your document editor.</p>
<table style="border-collapse:collapse;width:100%;">${rows.join("")}</table>
</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.download = "product-qr-codes.html";
    link.href = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  const copyOne = async (id: string) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } catch {
        // Fallback: nothing
      }
    });
  };

  if (loading || isAdmin === null) {
    return <main className="min-h-screen grid place-items-center">Loading…</main>;
  }
  if (!isAdmin) {
    return (
      <main className="min-h-screen grid place-items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admins only</h1>
          <p className="text-muted-foreground mb-6">Your account doesn't have admin access.</p>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-10 print:py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Product QR Codes</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Admin-only. Download individual codes, copy them, print the sheet, or use "Download all" to save every PNG.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>Print / Save as PDF</Button>
            <Button variant="outline" onClick={downloadHtml}>Download HTML</Button>
            <Button variant="hero" onClick={downloadAll}>Download all PNGs</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 print:grid-cols-3 print:gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-border bg-card p-4 flex flex-col items-center text-center break-inside-avoid"
            >
              <div className="bg-white p-3 rounded-md">
                <QRCodeCanvas
                  value={urlFor(p.id)}
                  size={180}
                  level="M"
                  includeMargin={false}
                  ref={(el) => {
                    canvasRefs.current[p.id] = el;
                  }}
                />
              </div>
              <h2 className="mt-3 text-sm font-bold leading-tight">{p.name}</h2>
              <p className="text-[10px] text-muted-foreground break-all mt-1">{urlFor(p.id)}</p>
              <div className="flex gap-2 mt-3 print:hidden">
                <Button size="sm" variant="outline" onClick={() => copyOne(p.id)}>Copy</Button>
                <Button size="sm" variant="outline" onClick={() => downloadOne(p.id, p.name)}>PNG</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminQRCodes;