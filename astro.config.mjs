import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import image from "@astrojs/image";
import react from "@astrojs/react";
import {
	ottieniDescrizione,
	ottieniSimboli,
	boxDefinizione,
	codiceInline,
	lazyLoadingImmagini,
	nascondiTestata,
	aggiungiDizionario,
	cambioTextDirectives,
} from "./src/functions/pluginsRemark";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import rehypePrettyCode from "rehype-pretty-code";
import { readFileSync } from "fs";
import { miaEstensione } from "./plugins/plugin";

const options = {
	// Use one of Shiki's packaged themes
	theme: {
		dark: JSON.parse(readFileSync("./themes/temaScuro.json", "utf-8")),
		light: "github-light",
	},

	onVisitLine(node) {
		// Prevent lines from collapsing in `display: grid` mode, and
		// allow empty lines to be copy/pasted
		if (node.children.length === 0) {
			node.children = [{ type: "text", value: " " }];
		}
	},

	onVisitHighlightedLine(node) {
		node.properties.className.push("pippone");
	},

	onVisitHighlightedWord(node) {
		node.properties.className = ["word"];
	},

	langs: ["c"],
	useBackground: true,
};

// https://astro.build/config
export default defineConfig({
	markdown: {
		syntaxHighlight: false,
	},
	integrations: [
		image(),
		react(),
		miaEstensione(),
		mdx({
			remarkPlugins: [
				// ottieniDescrizione,
				remarkMath,
				// ottieniSimboli,
				remarkDirective,
				codiceInline,
				boxDefinizione,
				aggiungiDizionario,
				cambioTextDirectives,
			],
			rehypePlugins: [
				[
					rehypeKatex,
					{
						strict: "ignore",
					},
				],
				lazyLoadingImmagini,
				nascondiTestata,
				[rehypePrettyCode, options],
			],
			extendPlugins: "astroDefaults",
		}),
	],
});
