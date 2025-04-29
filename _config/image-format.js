function formatImages(content) {
	const imageRegex =
		/!\[([^\]|]*?)(?:\|(\d+(?:x\d+)?))?\]\(([^)\s]+?\.(?:png|jpe?g|gif|webp|svg))\)(?:[ \t]*(\{[^}]*\}))?(?:[ \t]+([^ \t\n][^\n{]*))?(?=\s|\n|$)/gm;

	return content.replace(
		imageRegex,
		(match, alt, size, path, rawAttrs, trailingCaption, offset) => {
			// 1) Normalize alt
			alt = !alt || /^\d+(?:x\d+)?$/.test(alt) ? "" : alt.trim();

			// 2) Extract attrs
			const attributes = rawAttrs ? rawAttrs.trim() : "";

			// 3) Determine caption: prefer trailingCaption, else invisible if needed
			let caption = trailingCaption?.trim() || "";
			if (
				alt.toLowerCase().startsWith("figure") ||
				!caption ||
				caption === ""
			) {
				caption = "<span></span>";
			}

			// 4) Build size string (double for retina)
			let sizeStr = "";
			if (size) {
				const [w, h = w] = size.split("x").map(Number);
				sizeStr = ` =${w * 2}x${h * 2}`;
			}

			const processedPath =
				path.startsWith("http") ||
				path.startsWith("/") ||
				path.startsWith("media/")
					? // already absolute or full URL?  leave it alone
						path.trim()
					: // otherwise, force a root-absolute /media/ path
						`\/blog\/media\/${path.trim()}`;

			// 5) Reconstruct Markdown: always quote caption if present
			const captionStr = caption ? ` '${caption}'` : "";
			let result = `![${alt}](${processedPath}${captionStr}${sizeStr})`;

			// 6) Append attrs **after** the closing ")"
			if (attributes) result += attributes;
			return result;
		},
	);
}

function formatFiles(content) {
	const fileRegex = /\[([^\]]+?)\]\((?!https?:\/\/)([^)]+)\)/g;

	return content.replace(fileRegex, (match, text, filepath) => {
		const lowerPath = filepath.toLowerCase();

		// Skip markdown or nunjucks files
		if (lowerPath.endsWith(".md") || lowerPath.endsWith(".njk")) {
			return match;
		}

		// If the path has no extension, treat it as a note and prepend "/"
		if (!/\.[a-zA-Z0-9]+$/.test(filepath)) {
			return `[${text.trim()}](/${filepath.trim()})`;
		}

		// Otherwise, handle media paths
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
