
import { useState, useEffect } from "react";

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled,   setIsInstalled]   = useState(false);
  const [updateReady,   setUpdateReady]   = useState(false);

  useEffect(() => {
    
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsInstalled(mq.matches || navigator.standalone === true);
    mq.addEventListener("change", e => setIsInstalled(e.matches));

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          newSW?.addEventListener("statechange", () => {
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateReady(true);
            }
          });
        });
      });
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  const applyUpdate = () => {
    navigator.serviceWorker.ready.then(reg => reg.waiting?.postMessage({ type: "SKIP_WAITING" }));
    window.location.reload();
  };

  return { installPrompt, isInstalled, updateReady, install, applyUpdate };
}