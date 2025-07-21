import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FitsAir Survey App",
    short_name: "FitsAir Survey",
    description: "Customer satisfaction survey application for FitsAir",
    start_url: "/",
    display: "standalone",
    background_color: "#081c3c",
    theme_color: "#081c3c",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
