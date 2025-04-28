import {
	IdAttributePlugin,
	InputPathToUrlTransformPlugin,
	HtmlBasePlugin,
	EleventyRenderPlugin,
} from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import Image from "@11ty/eleventy-img";

import path from "node:path";
import sharp from "sharp";

import hyphenatorPlugin from "./_config/hyphenation.js";

import markdownItConfig from "./_config/markdown-it.js";

import taglistForTags from "./_config/proper-tags.js";

import pluginFilters from "./_config/filters.js";

import Eleventy from "@11ty/eleventy-navigation";
import imageFormat from "./_config/image-format.js";
import { OK } from "zod";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	// Drafts, see also _data/eleventyDataSchema.js
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	eleventyConfig.addPlugin(taglistForTags);

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addPlugin(hyphenatorPlugin);
	eleventyConfig.addPlugin(imageFormat);

	eleventyConfig.addPreprocessor("nbspEmDash", "md", (data, content) => {
		// Replace " —" (regular space + em dash) with non-breaking space + em dash
		return content.replace(/\u0020—/g, "\u00A0—");
	});

	eleventyConfig.addPreprocessor("nbspPrepositions", "md", (data, content) => {
		// Replace short Russian prepositions followed by a space with non-breaking space
		return content.replace(
			/ (?:(в|во|к|с|у|о|об|обо|на|над|по|под|для|до|из|от|при|не|и|но|а|как)) /giu,
			" $1\u00A0",
		);
	});

	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./content/feed/pretty-atom-feed.xsl": "/rss/feed.xsl",
		"./content/blog/media/": "/media/",
		"./content/assets/": "/assets/",
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch images for the image pipeline.
	eleventyConfig.addWatchTarget(
		"content/blog/media/**/*.{svg,webp,png,jpg,jpeg,gif}",
	);

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Adds the {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
	});
	// Adds the {% js %} paired shortcode
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
	});

	eleventyConfig.addPlugin(markdownItConfig);

	// Official plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 },
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
	eleventyConfig.addPlugin(EleventyRenderPlugin);

	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/rss/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		collection: {
			name: "posts",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "Blog Title",
			subtitle: "This is a longer description about your blog.",
			base: "https://example.com/",
			author: {
				name: "Your Name",
			},
		},
	});

	eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy's built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

	// Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Output formats for each image.
		formats: ["jpeg", "webp", "auto"],

		widths: ["auto"],
		outputDir: "./_site/media/",
		urlPath: "/media/",

		filenameFormat: function (id, src, width, format, options) {
			const extension = path.extname(src); // Get original file extension
			const name = path.basename(src, extension); // Get filename without extension

			return `${name}_width${width}.${format}`;
		},

		failOnError: false,
		htmlOptions: {
			imgAttributes: {
				// e.g. <img loading decoding> assigned on the HTML tag will override these values.
				loading: "lazy",
				decoding: "async",
			},
		},

		sharpOptions: {
			animated: true,
		},
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return new Date().toISOString();
	});

	eleventyConfig.addShortcode(
		"image",
		async function (src, alt, { height = 160 } = {}) {
			// Get original image dimensions using Sharp
			const metadata = await sharp(src).metadata();
			const aspectRatio = metadata.width / metadata.height;
			const calculatedWidth = Math.round(height * aspectRatio);
			const filename = path.basename(src);

			const imageMetadata = await Image(src, {
				widths: [calculatedWidth],
				formats: ["jpeg"],
				returnType: "metadata",
				outputDir: "./_site/media/",
				urlPath: "./../media/",
				filenameFormat: (id, src, width, format) =>
					`${path.basename(src, path.extname(src))}_thumbnail.${format}`,
			});

			return `
						<figure>
								<picture>
									<img src="${imageMetadata.jpeg[0].url}" alt="${alt}" height="${height}" width="${calculatedWidth}" loading="lazy" decoding="async">
								</picture>
							<figcaption style="width: ${calculatedWidth / 2}px">${path.basename(src)}</figcaption>
						</figure>
					`;
		},
	);

	// Hardcoded replace of bugged image paths
	eleventyConfig.addTransform("fixImagePaths", function (content, outputPath) {
		if (outputPath && outputPath.endsWith(".html")) {
			// Normalize both media\* and \content\media\* paths to \media\*
			return content
				.replace(/src="media\\([^"]*)"/g, 'src="\\media\\$1"')
				.replace(/src="content\\media\\([^"]*)"/g, 'src="\\media\\$1"');
		}
		return content;
	});

	eleventyConfig.addTransform(
		"halve-image-dimensions",
		(content, outputPath) => {
			if (outputPath && outputPath.endsWith(".html")) {
				return content.replace(
					/<img([^>]*?)\swidth="(\d+)"\sheight="(\d+)"([^>]*?)>/g,
					(_, pre, width, height, post) => {
						const halfWidth = Math.round(Number(width) / 2);
						const halfHeight = Math.round(Number(height) / 2);
						return `<img${pre} width="${halfWidth}" height="${halfHeight}"${post}>`;
					},
				);
			}
			return content;
		},
	);
	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
}

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: "njk",

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: "njk",
	inputDir: "content",
	// These are all optional:
	dir: {
		input: "content", // default: "."
		includes: "../_includes", // default: "_includes" (`input` relative)
		data: "../_data", // default: "_data" (`input` relative)
		output: "_site",
	},

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.

	// pathPrefix: "/",
};
