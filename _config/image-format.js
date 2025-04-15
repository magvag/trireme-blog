function formatImages(content) {
	const imageRegex =
		/(?:\[)?!\[([^\]|]*?)(?:\|(\d+(?:x\d+)?))?\]\(([^)]+?\.(?:png|jpe?g|gif|webp|svg))\)(?:\]\([^)]+?\))?(?: (.+))?/gm;
	return content.replace(
		imageRegex,
		(match, alt, size, path, caption, offset) => {
			// Make alt empty string if it's undefined or numeric
			alt = !alt || /^\d+(?:x\d+)?$/.test(alt) ? '""' : alt.trim();

			if (alt.toLowerCase().startsWith("figure")) {
				caption = " ";
			}

			const lineStart = content.lastIndexOf("\n", offset) + 1;
			const textBefore = content.substring(lineStart, offset).trim();

			const processedPath =
				!path.startsWith("http") &&
				!path.startsWith("/") &&
				!path.startsWith("media/")
					? `media/${path.trim()}`
					: path.trim();

			let sizeStr = "";
			if (size) {
				const [width, height = width] = size.split("x");
				sizeStr = ` =${width}x${height}`;
			}

			const captionStr = !textBefore && caption ? ` '${caption}'` : "";

			let result = `![${alt}](${processedPath}${captionStr}${sizeStr})`;

			// Handle wrapped links
			if (match.startsWith("[")) {
				const linkMatch = match.match(/\]\(([^)]+?)\)$/);
				if (linkMatch) {
					result = `[${result}](${linkMatch[1]})`;
				}
			}

			return result;
		},
	);
}

function formatFiles(content) {
	const fileRegex = /\[([^\]]+?)\]\((?!https?:\/\/)([^)]+\.[a-zA-Z0-9]+)\)/g;

	return content.replace(fileRegex, (match, text, filepath) => {
		if (
			filepath.toLowerCase().endsWith(".md") ||
			filepath.toLowerCase().endsWith(".njk")
		) {
			return match;
		}
		const isExternal = filepath.startsWith("http") || filepath.startsWith("/");
		const processedPath = isExternal
			? filepath
			: filepath.startsWith("media/")
				? "/" + filepath
				: `/media/${filepath.trim()}`;
		return `[${text.trim()}](${processedPath})`;
	});
}

export default function FormatImages(eleventyConfig) {
	eleventyConfig.addPreprocessor("imageformat", "md", (data, content) => {
		return formatImages(content);
	});
	eleventyConfig.addPreprocessor("fileformat", "md", (data, content) => {
		return formatFiles(content);
	});
}
