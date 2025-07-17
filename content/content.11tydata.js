import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const mediaDir = "content/media";
let mediaFiles = [];
let imageFiles = []; // Precomputed sorted image files

// Precompute image dimensions and sort by resolution
if (fs.existsSync(mediaDir)) {
	mediaFiles = fs.readdirSync(mediaDir);

	// Process images in parallel
	const processing = mediaFiles
		.filter((file) => /\.(png|jpe?g|webp|avif|gif)$/i.test(file))
		.map(async (file) => {
			try {
				const metadata = await sharp(path.join(mediaDir, file)).metadata();
				return {
					file,
					width: metadata.width,
					height: metadata.height,
					area: metadata.width * metadata.height,
				};
			} catch (err) {
				return null;
			}
		});

	const results = await Promise.all(processing);
	imageFiles = results.filter(Boolean).sort((a, b) => b.area - a.area);
}

export default {
	layout: "layouts/home.njk",
	permalink: "/{{ page.fileSlug }}/",
	eleventyComputed: {
		media: (data) => {
			if (!data.page?.rawInput) return [];
			const content = data.page.rawInput;

			// Create optimized lookup table
			const lookup = new Map();
			mediaFiles.forEach((file) => {
				lookup.set(file, file.includes(" ") ? encodeURI(file) : file);
			});

			return mediaFiles
				.filter((file) => content.includes(lookup.get(file)))
				.sort();
		},
	},
};
