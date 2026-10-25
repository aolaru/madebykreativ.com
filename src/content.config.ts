import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    dateLabel: z.string(),
    sortDate: z.date(),
    modifiedDate: z.date().optional(),
    category: z.enum(["Product", "Project", "Ecosystem", "Engineering"]),
    project: z.string().optional(),
    app: z.enum(["sharesafe", "northlight", "paperbuild", "kreativ-font", "photofeather", "kreativ-fancy-text"]).optional(),
    image: z.string().optional()
  })
});

export const collections = { news };
