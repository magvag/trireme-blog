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
	tags: ["posts"],
	layout: "layouts/post.njk",
	permalink: "/{{ page.fileSlug }}/",
	eleventyComputed: {
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
			if (paragraphs.length === 1) {
				data.short = true;
			}
			const firstValidParagraph = paragraphs.find(
				(p) => !p.trim().startsWith("![") && !p.trim().startsWith("|"),
			);
			return await this.renderTemplate(firstValidParagraph || "", "md");
		},
	},
};
