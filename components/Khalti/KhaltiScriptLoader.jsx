"use client";
import { useEffect } from "react";

export default function KhaltiScriptLoader() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://khalti.com/static/khalti-checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}