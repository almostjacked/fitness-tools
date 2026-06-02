// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
// starlight-openapi pinned <0.23: 0.23+ requires Starlight >=0.38 / Astro 6 (we're on Starlight 0.34 / Astro 5).
import starlightOpenAPI, { openAPISidebarGroups } from "starlight-openapi";

export default defineConfig({
  site: "https://ajwallacemusic.github.io",
  base: "/fitness-tools",
  integrations: [
    starlight({
      title: "Fitness Tools",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/ajwallacemusic/fitness-tools" },
      ],
      editLink: {
        baseUrl: "https://github.com/ajwallacemusic/fitness-tools/edit/main/apps/docs/",
      },
      plugins: [
        starlightOpenAPI([
          { base: "api", label: "HTTP API", schema: "./src/openapi.json" },
        ]),
      ],
      sidebar: [
        { label: "Guides", autogenerate: { directory: "guides" } },
        ...openAPISidebarGroups,
      ],
    }),
  ],
});
