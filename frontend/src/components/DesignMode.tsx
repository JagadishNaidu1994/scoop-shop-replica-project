import { useState, useEffect, useRef } from "react";
import { X, Edit2, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const DesignMode = () => {
  const [active, setActive] = useState(false);
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [replacements, setReplacements] = useState<Map<string, string>>(new Map());
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedImgRef = useRef<HTMLImageElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    selectedImgRef.current = selectedImg;
  }, [selectedImg]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        setActive((prev) => !prev);
        setSelectedImg(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!active) return;

    const handleImageClick = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;

      if (target.tagName === "IMG") {
        setSelectedImg(target as HTMLImageElement);
      }
    };

    document.addEventListener("click", handleImageClick, true);
    return () => document.removeEventListener("click", handleImageClick, true);
  }, [active]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize if too large
          const maxDim = 800;
          if (width > maxDim || height > maxDim) {
            const ratio = Math.min(maxDim / width, maxDim / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG
          const compressed = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressed);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedImgRef.current) return;

    setSaving(true);
    setSavedMsg("");

    try {
      const originalSrc = selectedImgRef.current.src;

      // Compress image
      const compressedBase64 = await compressImage(file);

      // Save to database - try update first, then insert
      const { error: updateError } = await supabase
        .from("image_replacements")
        .update({
          replacement_url: compressedBase64,
          created_by: user?.id,
        })
        .eq("original_src", originalSrc);

      if (updateError && updateError.code !== "PGRST116") throw updateError;

      // If no rows updated, insert new record
      const { count } = await supabase
        .from("image_replacements")
        .select("id", { count: "exact", head: true })
        .eq("original_src", originalSrc);

      if (count === 0) {
        const { error: insertError } = await supabase
          .from("image_replacements")
          .insert({
            original_src: originalSrc,
            replacement_url: compressedBase64,
            created_by: user?.id,
          });

        if (insertError) throw insertError;
      }

      // Update DOM
      if (selectedImgRef.current) {
        selectedImgRef.current.src = compressedBase64;
      }
      setReplacements((prev) => {
        const newMap = new Map(prev);
        newMap.set(originalSrc, compressedBase64);
        return newMap;
      });

      setSavedMsg("✓ Saved to database!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err: any) {
      console.error("Error:", err);
      setSavedMsg(`✗ Error: ${err?.message || "Failed to save"}`);
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (!user) {
      setSavedMsg("⚠ Must be logged in to save");
      return;
    }
    fileInputRef.current?.click();
  };

  const resetImage = () => {
    if (!selectedImgRef.current) return;

    const originalSrc = Array.from(replacements.entries()).find(
      ([_, tempSrc]) => selectedImgRef.current!.src === tempSrc
    )?.[0] || selectedImgRef.current.src;

    selectedImgRef.current.src = originalSrc;
    setReplacements((prev) => {
      const newMap = new Map(prev);
      newMap.delete(originalSrc);
      return newMap;
    });
    setSelectedImg(null);
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
        title="Design Mode (Cmd+D)"
      >
        <Edit2 size={20} />
      </button>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {active && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {selectedImg && (
            <div
              className="fixed border-2 border-blue-500 bg-blue-500 bg-opacity-20 pointer-events-auto cursor-pointer"
              style={{
                left: `${selectedImg.getBoundingClientRect().left}px`,
                top: `${selectedImg.getBoundingClientRect().top}px`,
                width: `${selectedImg.getBoundingClientRect().width}px`,
                height: `${selectedImg.getBoundingClientRect().height}px`,
              }}
            />
          )}

          <div className="fixed bottom-4 left-4 right-4 max-w-md bg-white rounded-lg shadow-2xl p-4 pointer-events-auto z-50" style={{ pointerEvents: "auto" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Design Mode</h3>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  console.log("Close button clicked");
                  setActive(false);
                  setSelectedImg(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
                style={{ pointerEvents: "auto" }}
              >
                <X size={16} />
              </button>
            </div>

            {selectedImg ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-600 break-all">
                  {selectedImg.src.substring(0, 50)}...
                </p>
                <div className="flex gap-2">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      triggerFileInput();
                    }}
                    type="button"
                    disabled={saving}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ pointerEvents: "auto" }}
                  >
                    {saving && <Loader size={14} className="animate-spin" />}
                    {saving ? "Saving..." : "Replace Image"}
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      console.log("Reset button clicked");
                      resetImage();
                    }}
                    type="button"
                    className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
                    style={{ pointerEvents: "auto" }}
                  >
                    Reset
                  </button>
                </div>
                {savedMsg && (
                  <p className={`text-xs ${savedMsg.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
                    {savedMsg}
                  </p>
                )}
                {replacements.has(selectedImg.src) && !savedMsg && (
                  <p className="text-xs text-green-600">✓ Saved to backend</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-600">
                Click any image to select it. Cmd+D to toggle.
              </p>
            )}

            {replacements.size > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs font-semibold">{replacements.size} modified</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
