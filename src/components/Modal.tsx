import { FabricImage } from "fabric";
import { FaCloudUploadAlt, FaLink, FaTimes } from "react-icons/fa";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { useCallback, useEffect, useRef, useState } from "react";

function Modal() {
  const { contentState, setContentState } = useContextCanvas();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeModal = useCallback(() => {
    setContentState((prev) => ({ ...prev, showModal: false }));
    setPreview(null);
    setUrl("");
    setError("");
    setLoading(false);
  }, [setContentState]);

  const addImageToCanvas = async (dataUrl: string) => {
    setLoading(true);
    setError("");
    try {
      const image = await FabricImage.fromURL(dataUrl);
      const canvas = contentState.canvas;
      if (canvas) {
        const maxW = canvas.width * 0.6;
        const maxH = canvas.height * 0.6;
        if (image.width > maxW || image.height > maxH) {
          const scale = Math.min(maxW / image.width, maxH / image.height);
          image.scale(scale);
        }
        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.renderAll();
      }
      closeModal();
    } catch {
      setError("Failed to load image. Check the file or URL.");
    } finally {
      setLoading(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUrlSubmit = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    addImageToCanvas(trimmed);
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUrlSubmit();
  };

  useEffect(() => {
    if (contentState.showModal) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const id = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(id);
    }
  }, [contentState.showModal]);

  useEffect(() => {
    if (!contentState.showModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [contentState.showModal, closeModal]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed left-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl z-10 w-[440px] max-w-[90vw] transition-transform duration-300 ${
          isAnimating ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-gray-800">Import Image</h2>
          <button
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {preview ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setPreview(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={() => addImageToCanvas(preview)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-400 hover:to-pink-400 shadow-md shadow-purple-500/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Adding..." : "Add to Canvas"}
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-purple-400 bg-purple-50"
                  : "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isDragging
                    ? "bg-purple-100 text-purple-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <FaCloudUploadAlt className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {isDragging
                    ? "Drop image here"
                    : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, SVG, GIF, WEBP
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-transparent transition-all">
              <FaLink className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleUrlKeyDown}
                placeholder="Paste image URL..."
                className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              disabled={!url.trim() || loading}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-400 hover:to-pink-400 shadow-md shadow-purple-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Load"}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
