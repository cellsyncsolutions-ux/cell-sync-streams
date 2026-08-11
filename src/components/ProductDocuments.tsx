import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Trash2, Upload } from "lucide-react";

type Doc = {
  id: string;
  title: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
};

const ProductDocuments = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("product_documents")
      .select("id,title,file_path,file_size,created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setDocs(data ?? []);
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => setIsAdmin(!!data?.some((r) => r.role === "admin")));
  }, [user]);

  const openDoc = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("product-documents")
      .createSignedUrl(path, 60 * 10);
    if (error || !data?.signedUrl) {
      toast.error("Could not open document");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return;
    }
    setUploading(true);
    const path = `${productId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: upErr } = await supabase.storage
      .from("product-documents")
      .upload(path, file, { contentType: "application/pdf" });
    if (upErr) {
      setUploading(false);
      toast.error(upErr.message);
      return;
    }
    const { error: dbErr } = await supabase.from("product_documents").insert({
      product_id: productId,
      title: file.name.replace(/\.pdf$/i, "").slice(0, 120),
      file_path: path,
      file_size: file.size,
      uploaded_by: user?.id ?? null,
    });
    setUploading(false);
    if (dbErr) {
      toast.error(dbErr.message);
      return;
    }
    toast.success("Test results uploaded");
    load();
  };

  const handleDelete = async (doc: Doc) => {
    const { error } = await supabase.from("product_documents").delete().eq("id", doc.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.storage.from("product-documents").remove([doc.file_path]);
    toast.success("Document removed");
    load();
  };

  if (!isAdmin && docs.length === 0) return null;

  return (
    <div className="mt-6 rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider mb-3">Test Results &amp; COAs</h2>
      {docs.length === 0 ? (
        <p className="text-xs text-muted-foreground mb-3">No test results uploaded yet.</p>
      ) : (
        <ul className="space-y-2 mb-3">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
              <button
                onClick={() => openDoc(d.file_path)}
                className="flex items-center gap-2 text-sm text-left hover:text-primary transition-smooth"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">{d.title}</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(d)}
                  aria-label={`Delete ${d.title}`}
                  className="text-muted-foreground hover:text-destructive transition-smooth"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAdmin && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
          <Button variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading…" : "Upload PDF test results"}
          </Button>
        </>
      )}
    </div>
  );
};

export default ProductDocuments;