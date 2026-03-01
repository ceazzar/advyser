import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Advyser",
    short_name: "Advyser",
    description: "Find your perfect financial or property advisor",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f2937",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
