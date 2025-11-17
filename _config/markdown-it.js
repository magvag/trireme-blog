import markdownIt from "markdown-it";
import { mathjax, createMathjaxInstance } from "@mdit/plugin-mathjax";
import { icon } from "@mdit/plugin-icon";
import { container } from "@mdit/plugin-container";
import { attrs } from "@mdit/plugin-attrs";
import { spoiler } from "@mdit/plugin-spoiler";
import { mark } from "@mdit/plugin-mark";
import { figure } from "@mdit/plugin-figure";
import { imgSize } from "@mdit/plugin-img-size";

export default function markdownItConfig(eleventyConfig) {
	// latex thingys
	const mathjaxInstance = createMathjaxInstance({
		tex: {
			packages: ["base", "require"],
		},
		loader: { load: ["input/tex", "output/svg"] },
	});

	eleventyConfig.setLibrary(
		"md",
		markdownIt({
			html: true,
			breaks: true, // шифт + энтер работает
			linkify: true,
			typographer: false,
			quotes: "«»„“", // выключено, пока выключен типограф. скачай раскладку для биологов!
		})
			.use(mathjax, mathjaxInstance)
			.use(attrs)
			.use(figure)
			.use(imgSize)
			.use(spoiler)
			.use(mark)
			.use(container, { name: "container" })
			.use(icon),
	);
}
