export default function typographerPlugin(eleventyConfig) {
	eleventyConfig.addPreprocessor(
		"unDirectSpeechEmDashes",
		"md",
		(data, content) => {
			return content.replace(/\u0020—/g, "\u00A0—");
		},
	);

	eleventyConfig.addPreprocessor(
		"unhangPrepositions",
		"md",
		(data, content) => {
			return content.replace(
				/\u0020(?:(в|во|к|с|у|о|об|обо|на|над|по|под|для|до|из|от|при|не|и|но|а|как))\u0020/giu,
				"\u0020$1\u00A0",
			);
		},
	);

	eleventyConfig.addPreprocessor(
		"unhangMeasurements",
		"md",
		(data, content) => {
			return content.replace(
				/(\d)\u0020(%|°C|°F|kg|g|mg|km|m|cm|mm|μm|nm|l|ml|h|min|s|Hz|kHz|MHz|GHz|Б|КБ|МБ|ГБ|ТБ|с|мин|ч|дн|г|м|мм|см|км|кг)\b/giu,
				"$1\u00A0$2",
			);
		},
	);

	eleventyConfig.addPreprocessor("unhangInitials", "md", (data, content) => {
		return content
			.replace(
				/([A-Za-zА-Яа-яЁё]+)\u0020([A-ZА-ЯЁ])\.\u0020?([A-ZА-ЯЁ])\./g,
				"$1\u00A0$2.\u202F$3.",
			)
			.replace(/(^|\s)([A-ZА-ЯЁ])\.\u0020?([A-ZА-ЯЁ])\./g, "$1$2.\u202F$3.");
	});
}
