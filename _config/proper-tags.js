export default function taglistForTags(eleventyConfig) {
	eleventyConfig.addCollection("tags", function (collectionApi) {
		let tagMap = new Map();

		collectionApi.getAll().forEach((item) => {
			if (!item.data.taglist) return; // Skip if no tags

			// Ensure taglist is always an array (handles string and array scenarios)
			let tags = [].concat(item.data.taglist || []).filter(Boolean);

			tags.forEach((tag) => {
				if (!tagMap.has(tag)) tagMap.set(tag, []);
				tagMap.get(tag).push(item);
			});
		});

		// Return an array of objects with tag and items rather than an object
		return Array.from(tagMap.entries()).map(([tag, items]) => ({ tag, items }));
	});
}
