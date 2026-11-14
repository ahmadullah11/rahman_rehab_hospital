"use client";

import { useState, useRef } from "react";
import { X, UploadCloud, CheckCircle2, AlertCircle, Image as ImageIcon, Loader2 } from "lucide-react";

interface UploadModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onUploadSuccess?: (newImage: any) => void;
  onUploaded?: (newImage: any) => void;
}

export default function UploadModal({ isOpen = true, onClose, onUploadSuccess, onUploaded }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Rooms");
  const [description, setDescription] = useState("");
  const [isSlider, setIsSlider] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setError("Please select an image file (JPEG, PNG, WebP)");
        return;
      }
      setFile(selected);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image to upload");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("isSlider", String(isSlider));

      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setSuccessMsg("Image uploaded successfully to ImageKit!");
      if (onUploadSuccess) onUploadSuccess(data.image);
      if (onUploaded) onUploaded(data.image);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        background: "rgba(12, 20, 16, 0.95)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: "520px",
          width: "92vw",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          padding: "clamp(1.25rem, 5vw, 2rem)",
          background: "var(--surface)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>
          Upload Center Photograph
        </h3>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          Images are securely uploaded to ImageKit and rendered in the gallery showcase.
        </p>

        {error && (
          <div
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <AlertCircle className="w-4 h-4 flex-none" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "10px",
              background: "var(--soft)",
              border: "1px solid var(--primary)",
              color: "var(--primary-strong)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <CheckCircle2 className="w-4 h-4 flex-none" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: 0, border: "none", boxShadow: "none", background: "transparent", display: "grid", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "0.3rem" }}>
              Select Photograph
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--border)",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "center",
                cursor: "pointer",
                background: "var(--bg)",
                transition: "border-color 0.2s",
              }}
            >
              {preview ? (
                <div style={{ position: "relative", width: "100%", height: "160px" }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "4px" }}>
                    Change
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <UploadCloud className="w-8 h-8 text-[var(--primary)]" />
                  <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    Click to browse or drop photograph here
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                    Supports PNG, JPG, WebP
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "0.3rem" }}>
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Modern Inpatient Suite"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "0.3rem" }}>
              Category
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Rooms">Rooms &amp; Suites</option>
              <option value="Detox">Medical Detox</option>
              <option value="Psychiatry">Psychiatry Consultation</option>
              <option value="Therapy">Counseling &amp; CBT</option>
              <option value="Environment">Healing Grounds</option>
              <option value="Wellness">Nutrition &amp; Wellness</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "0.3rem" }}>
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Brief details about this clinical environment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: "80px" }}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to ImageKit...</span>
              </>
            ) : (
              <span>Upload Picture</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
