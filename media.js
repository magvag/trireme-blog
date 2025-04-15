// File: _data/media.js
import fs from "node:fs";
import path from "node:path";

export default function () {
	const mediaDir = "content/blog/media";

	if (!fs.existsSync(mediaDir)) {
		return [];
	}

	return fs
		.readdirSync(mediaDir)
		.filter((file) => fs.statSync(path.join(mediaDir, file)).isFile())
		.sort();
}
