import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface TrackingCode {
  id: string;
  code: string;
  apply_to_all_pages: boolean;
  specific_pages: string[] | null;
}

export const useTrackingCodes = () => {
  const location = useLocation();

  useEffect(() => {
    const loadTrackingCodes = async () => {
      try {
        const { data, error } = await supabase
          .from("tracking_codes")
          .select("id, code, apply_to_all_pages, specific_pages")
          .eq("enabled", true);

        if (error) throw error;

        // Remove any previously injected tracking codes
        document.querySelectorAll('[data-tracking-code]').forEach(el => el.remove());

        // Inject applicable tracking codes
        data?.forEach((trackingCode: TrackingCode) => {
          const shouldInject = trackingCode.apply_to_all_pages || 
            trackingCode.specific_pages?.some(page => {
              // Handle dynamic routes (e.g., /articles/:slug)
              const pattern = page.replace(/:[^/]+/g, '[^/]+');
              const regex = new RegExp(`^${pattern}$`);
              return regex.test(location.pathname);
            });

          if (shouldInject) {
            // Create a container div for the script
            const container = document.createElement('div');
            container.setAttribute('data-tracking-code', trackingCode.id);
            container.innerHTML = trackingCode.code;

            // Execute scripts by recreating them
            const scripts = container.querySelectorAll('script');
            scripts.forEach(oldScript => {
              const newScript = document.createElement('script');
              Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
              });
              if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
              }
              oldScript.parentNode?.replaceChild(newScript, oldScript);
            });

            // Append to head
            document.head.appendChild(container);
          }
        });
      } catch (error) {
        // Silently ignore when tracking codes backend table is empty or unconfigured
      }
    };

    loadTrackingCodes();
  }, [location.pathname]);
};
