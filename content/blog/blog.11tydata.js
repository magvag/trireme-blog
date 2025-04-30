// File: eleventyComputed.js
import fs from "node:fs";
import path from "node:path";

const mediaDir = "content/blog/media";
let mediaFiles = [];

if (fs.existsSync(mediaDir)) {
	mediaFiles = fs
		.readdirSync(mediaDir)
		.filter((file) => fs.statSync(path.join(mediaDir, file)).isFile());
}

export default {
	layout: "layouts/post.njk",
	permalink: "/{{ page.fileSlug }}/",
	tags: ["posts"],
	eleventyComputed: {
		tags: (data) => {
			if (data.notPost) return [];
			return ["posts"];
		},
		media: (data) => {
			if (!data.page || !data.page.rawInput) return [];

			const content = data.page.rawInput;
			const found = mediaFiles.filter((file) =>
				content.includes(encodeURI(file)),
			);
			return found.filter((file) => !!file).sort();
		},

		description: async function (data) {
			if (!data.page || !data.page.rawInput) return "";
			if (data.description) return data.description;
			const paragraphs = data.page.rawInput.split("\n");
			const validParagraphs = paragraphs.filter(
				(p) =>
					!p.trim().startsWith("![") &&
					!p.trim().startsWith("|") &&
					!p.trim().startsWith("#") &&
					p.trim().length > 0 &&
					!p.trim().startsWith(" "),
			);
			if (validParagraphs.length === 1) {
				data.short = true;
			}
			const firstValidParagraph = validParagraphs[0];
			return await this.renderTemplate(firstValidParagraph || "", "md");
		},
	},
};
