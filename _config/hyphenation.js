import Hypher from "hypher";
import russian from "hyphenation.ru";
import english from "hyphenation.en-gb";

function hyphenateText(text, hyphenatorRu, hyphenatorEn) {
	return text
		.split("\n")
		.map((line) => {
			// Skip headers, images
			if (
				line.startsWith("#") ||
				line.startsWith("![") ||
				line.startsWith("[![") ||
				line.startsWith("<")
			) {
				return line;
			}
			return line
				.split(" ")
				.map((word) => {
					// Skip table markdown patterns, icon patterns
					if (
						word.match(/[-]+/) ||
						word.match(/::.*::/) ||
						word.match(/{.*}/) ||
						word.match(/[#.][.*]+/) || // matches .something or #something
						word.match(/^\w+=/) // matches something=
					) {
						return word;
					}

					if (word.includes("http")) {
						return word;
					}

					if (word.includes("-")) {
						return word.replace(/-/g, "-\u00AD");
					}

					if (word.length < 7) {
						return word;
					}

					const hyphenator = /[а-яА-ЯёЁ]/.test(word)
						? hyphenatorRu
						: hyphenatorEn;
					const points = hyphenator.hyphenate(word);

					for (let i = 0; i < points.length - 1; i++) {
						const before = points.slice(0, i + 1).join("");
						const after = points.slice(i + 1).join("");

						if (before.length >= 4 && after.length >= 4) {
							return before + "\u00AD" + after;
						}
					}

					return word;
				})
				.join(" ");
		})
		.join("\n");
}

export default function hyphenatorPlugin(eleventyConfig) {
	const hyphenatorRu = new Hypher(russian);
	const hyphenatorEn = new Hypher(english);

	eleventyConfig.addPreprocessor("hyphenate", "md", (data, content) => {
		return hyphenateText(content, hyphenatorRu, hyphenatorEn);
	});
}
