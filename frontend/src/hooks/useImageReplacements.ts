import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useImageReplacements = () => {
  useEffect(() => {
    let replacementMap: Map<string, string> | null = null;

    const loadReplacementsFromDB = async () => {
      try {
        // Add timeout - if it takes more than 5 seconds, skip it
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Image replacements load timeout")), 5000)
        );

        const queryPromise = supabase
          .from("image_replacements")
          .select("original_src, replacement_url");

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

        if (error) {
          console.warn("Failed to load image replacements:", error);
          return new Map();
        }

        if (!data || data.length === 0) {
          return new Map();
        }

        return new Map(data.map((r) => [r.original_src, r.replacement_url]));
      } catch (err) {
        console.warn("Image replacements skipped (non-critical):", (err as Error).message);
        return new Map();
      }
    };

    const applyReplacements = () => {
      if (!replacementMap) return;

      const images = document.querySelectorAll("img");
      let applied = 0;

      images.forEach((img) => {
        const replacement = replacementMap!.get(img.src);
        if (replacement && img.src !== replacement) {
          img.src = replacement;
          applied++;
        }
      });

      if (applied > 0) {
        console.log(`Applied ${applied} image replacements`);
      }
    };

    const init = async () => {
      replacementMap = await loadReplacementsFromDB();
      if (replacementMap && replacementMap.size > 0) {
        applyReplacements();

        // Watch for new images added to DOM
        const observer = new MutationObserver(() => {
          applyReplacements();
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        return () => observer.disconnect();
      }
    };

    init();
  }, []);
};
