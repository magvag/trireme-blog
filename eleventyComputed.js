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
	eleventyComputed: {
		media: (data) => {
			if (!data.page || !data.page.rawInput) return [];

			const content = data.page.rawInput;
			const found = mediaFiles.filter((file) =>
				content.includes(encodeURI(file)),
			);
			// console.log(data.title, found);
			return found.sort();
		},
	},
};
