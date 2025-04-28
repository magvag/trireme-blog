---
title: Как конфигурировать 11ty
description: Если вы хотите беспощадно закастомизировать Трирему, вам придётся открыть eleventy.config.js и разобраться, чем Preprocessor отличается от Filter и Transform и в каком порядке их расставлять.
date: 2025-03-09
taglist:
  - 11ty
draft: 
starred:
---
Если вы дошли до этой статьи, то наверняка уже прочитали [заметку о препроцессорах в 11ty](11ty-preprocessors.md) и открывали `eleventy.config.js`. Если ещё нет, прочитайте и возвращайтесь.

`eleventy.config.js`— по сути просто пайплайн, набор последовательных инструкций, которые исполняются 11ty для того, чтобы сгенерировать статичный сайт. По заверению сенсеев, конфиг это важнейший файл и если ты не разобрался, как в нём всё работает, то можешь посыпать голову пеплом и вернуться на Вордпресс. 

Я разбирался довольно долго и не хочу, чтобы разбирались вы. Ниже — список самых важных методов в конфиге.

### addPassthroughCopy
Интуитивно понятная вещь: копирует файлы из папок проекта в подпапки статичного сайта, никак не изменяя их по пути.

```
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./content/feed/pretty-atom-feed.xsl": "/rss/feed.xsl",
		"./content/blog/media/": "/media/",
		"./content/assets/": "/assets/",
	});
```

### addPreprocessor
Уже знакомый вам метод для редактуры исходных файлов. Заметьте, что препроцессить можно не только какой-то определённый тип файлов (`"*"`), а возвращать не только отредактированный `content` или свойства заметки `data`. Кусок кода ниже стоит в самом начале конфига и аннулирует черновики, не давая им отрендерится и попасть на сайт.

```
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});
```

### addFilter
Фильтры — это функции-преобразователи для nunjucks-шаблонов. Язык Nunjucks поддерживает очень ограниченный набор инструкций, но даёт подключать полноценные Джаваскрипт-функции через фильтры.

Выглядит это так:

\_config/filters.js {.birka}
```
eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
	// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
	return DateTime.fromJSDate(dateObj, { zone: zone || "utc" })
		.setLocale("ru")
		.toFormat(format || "MMM yyyy"); // 'апр. 2025'
	});
```

\_includes/date-and-tags.js {.birka}
```
<ul class="linklist post-metadata unvisitable">
	<li class="post-time linklist-item"><time  datetime="{ { post.date | htmlDateString } }">{ { post.date | readableDate } }</time></li>
```

Заодно показал вам, в каком месте менять формат даты у поста.

**Важно!** Если применить фильтр к объекту `{ { content } }`, например в \_includes/layoyts/post.njk, то он будет применён к отрендеренному ХТМЛ, а не к сырому Маркдауну  — я так один раз погорел, сделав расстановщик переносов в виде фильтра, а не препроцессора.

### addShortcode
Шорткоды используются внутри nunjucks-синтаксиса как полноценные функции с параметрами и всем таким. В отличие от фильтров, не требуют никакого объекта для изменения.

/eleventy.config.js {.birka}
```
eleventyConfig.addShortcode("currentBuildDate", () => {
	return new Date().toISOString();
});
```

\_includes/layouts/base.njk {.birka}
```
<!doctype html>
		<!-- Эта страница `{ { page.url }}` была собрана {× currentBuildDate ×} -->
		<!-- Движок: 11ty, тема: Трирема v1.0 -->
```

### addTransform
Как препроцессор, только для сгенерированных ХТМЛ файлов. В Триреме используется как костыль против растянутых и мутных изображений. Если вы хотите понять, зачем я уменьшаю размеры изображения в два раза и почему пиксели в CSS не равны физическим пикселям картинок, читайте [ заметку об изображениях в Триреме](11ty-images.md).

```
eleventyConfig.addTransform(
	"halve-image-dimensions",
	(content, outputPath) => {
		if (outputPath && outputPath.endsWith(".html")) {
			return content.replace(
			/<img([^>]*?)\swidth="(\d+)"\sheight="(\d+)"([^>]*?)>/g,
			(_, pre, width, height, post) => {
				const halfWidth = Math.round(Number(width) / 2);
				const halfHeight = Math.round(Number(height) / 2);
				return `<img${pre} width="${halfWidth}" height="${halfHeight}"${post}>`;
				},
			);
		}
		return content;
	},
```

### addPlugin
Любой из методов выше можно добавить как отдельный плагин, дабы не засорять конфиг лишним кодом. Создайте .js файл внутри папки /\_config, придерживайтесь в нём структуры вроде этой:

\_config/markdown-it.js {.birka}
```
import markdownIt from "markdown-it";
...

export default function markdownItConfig(eleventyConfig) {
	eleventyConfig.setLibrary(
		"md",
		markdownIt({...});
	);
}
```

и добавляйте в конфиг импортом и методом addPlugin.

```
import markdownItConfig from "./_config/markdown-it.js";
...

export default async function (eleventyConfig) {
	...
	eleventyConfig.addPlugin(markdownItConfig);
	...
}
```

Со всем остальным разберётесь по ходу дела. ЧатГПТ тут не помошник, читайте документацию: www.11ty.dev/docs/