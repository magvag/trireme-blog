import Hypher from "hypher";
import russian from "hyphenation.ru";
import english from "hyphenation.en-gb";

const hyphenatorRu = new Hypher(russian);
const hyphenatorEn = new Hypher(english);

const skipLineRx = /^(?:::|[#\[<!]| *\| *[:\-])/;
const skipWordRx = /::.*::|{.*}|[#.]\[?.+\]?|^\w+=|^\w+:\w+|^\w+\.\w+/;
const urlRx = /https?:\/\//;
const cyrillicRx = /[а-яА-ЯёЁ]/;
const smallWordLength = 7;

export function hyphenateText(text) {
	const lines = text.split("\n");
	for (let i = 0, L = lines.length; i < L; i++) {
		const line = lines[i];
		if (skipLineRx.test(line)) continue;

		const words = line.split(" ");
		for (let j = 0, W = words.length; j < W; j++) {
			const w = words[j];

			// 1) quick rejects
			if (skipWordRx.test(w) || urlRx.test(w) || w.length < smallWordLength) {
				continue;
			}

			// 2) simple dash-injection
			if (w.includes("-")) {
				words[j] = w.replace(/-/g, "-\u00AD");
				continue;
			}

			// 3) full Hypher break// Compute which boundaries are valid
			const hyph = (cyrillicRx.test(w) ? hyphenatorRu : hyphenatorEn).hyphenate(
				w,
			);

			const breaks = []; // breaks[i] === true means “between hyph[i-1] and hyph[i]”
			for (let i = 1, N = hyph.length; i < N; i++) {
				const prefixLen = hyph.slice(0, i).join("").length;
				const suffixLen = hyph.slice(i).join("").length;
				if (prefixLen >= 4 && suffixLen >= 4) {
					breaks[i] = true;
				}
			}

			// Rebuild word with soft-hyphens at every valid boundary
			let broken = hyph[0] || "";
			for (let i = 1, N = hyph.length; i < N; i++) {
				if (breaks[i]) broken += "\u00AD";
				broken += hyph[i];
			}
			words[j] = broken;
		}
		lines[i] = words.join(" ");
	}

	const result = lines.join("\n");
	return result
		.replace(/\u0020—/g, "\u00A0—")
		.replace(
			/ (?:(в|во|к|с|у|о|об|обо|на|над|по|под|для|до|из|от|при|не|и|но|а|как)) /giu,
			" $1\u00A0",
		);
}

export default function hyphenatorPlugin(eleventyConfig) {
	eleventyConfig.addPreprocessor("hyphenate", "md", (data, content) => {
		return hyphenateText(content, hyphenatorRu, hyphenatorEn);
	});
}
