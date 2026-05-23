import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useImageReplacements = () => {
  useEffect(() => {
    let replacementMap: Map<string, string> | null = null;

    const loadReplacementsFromDB = async () => {
      try {
        const { data, error } = await supabase
          .from("image_replacements")
          .select("original_src, replacement_url");

        if (error) {
          console.error("Failed to load image replacements:", error);
          return null;
        }

        if (!data || data.length === 0) {
          return new Map();
        }

        return new Map(data.map((r) => [r.original_src, r.replacement_url]));
      } catch (err) {
        console.error("Error loading image replacements:", err);
        return null;
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
