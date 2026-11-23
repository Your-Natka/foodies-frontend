import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  let apiOrigin = "";
  try {
    apiOrigin = new URL(env.VITE_API_URL).origin;
  } catch {
    // No API URL configured — the API cache rule is skipped.
  }

  // GET requests to the API (except auth) are served network-first,
  // falling back to the last cached response when offline.
  const apiRuntimeCaching = apiOrigin
    ? [
        {
          urlPattern: new RegExp(`^${escapeRegExp(apiOrigin)}/(?!auth/).*`),
          method: "GET",
          handler: "NetworkFirst",
          options: {
            cacheName: "foodies-api",
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 300, maxAgeSeconds: 7 * 24 * 60 * 60 },
            cacheableResponse: { statuses: [200] },
          },
        },
      ]
    : [];

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "prompt",
        includeAssets: ["favicon-foodies.svg", "apple-touch-icon-180x180.png"],
        manifest: {
          name: "Foodies — recipes to cook and share",
          short_name: "Foodies",
          description: "Discover, save and cook recipes — even offline.",
          lang: "en",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#050505",
          icons: [
            { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          shortcuts: [
            { name: "Shopping list", url: "/shopping-list" },
            { name: "Add recipe", url: "/recipe/add" },
          ],
        },
        workbox: {
          // App shell only; the large category images are cached on demand.
          globPatterns: ["**/*.{js,css,html,svg,ico}", "*.png"],
          navigateFallback: "/index.html",
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            ...apiRuntimeCaching,
            {
              // Only same-origin / CORS images (status 200) are cached.
              // Opaque cross-origin responses (status 0) are counted by
              // Chrome as ~7 MB each and quickly exceed the storage quota.
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "foodies-images-v2",
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                  purgeOnQuotaError: true,
                },
                cacheableResponse: { statuses: [200] },
              },
            },
          ],
        },
      }),
    ],
    server: {
      port: 5174,
      strictPort: true,
    },
    // Same port as dev so the backend's CORS allows `vite preview` too.
    preview: {
      port: 5174,
      strictPort: true,
    },
  };
});
