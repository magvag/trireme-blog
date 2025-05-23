---
title: Пишем личный автотипограф
description: "В Триреме работает очень незаметный автотипограф: он убирает двойные пробелы, не даёт предлогам висеть в конце строк и показывает, где можно перенести слово. С помощью нескольких строчек кода вы можете дописать в него свои правила — в этой заметке расскажу, как."
date: 2025-03-11
taglist:
  - фичи
  - 11ty
draft: 
starred:
---

В Триреме работает очень незаметный автотипограф: он убирает двойные пробелы, не даёт предлогам висеть в конце строк и показывает, где можно перенести слово на новую строку. Сейчас расскажу, как это работает и как вы с помощью нескольких строк кода можете добавить автотипографу свои правила: будь-то замена кавычек на правильные, двух дефисов на тире и так далее.

Чтобы не быть голословным: вот так выглядит правило, которое не даёт тире из середины предложения оказаться в начале строки и быть воспринятым как прямая речь. Инструкций на две строки.

/eleventy.config.js {.birka}
```js
eleventyConfig.addPreprocessor("nbspEmDash", "md", (data, content) => {
	// Replace " —" (regular space + em dash) with non-breaking space + em dash
	return content.replace(/\u0020—/g, "\u00A0—");
	});
```

Автотипограф Триремы работает благодаря тому, что 11ty даёт пользователю изменять содержимое маркдаун-файлов перед тем, как генератор превратит их в ХТМЛ — если по-птичьему, подключать **препроцессоры**.

Для того,чтобы добавить в автотипограф новое правило, просто попросите у ЧатГПТ написать функцию наподобие той, что я показал выше, откройте `eleventy.config.js` и вставьте её рядом (!) с другими `addPreprocessor`-ами.

Если ваше правило требует какой-то сложной логики или сторонних библиотек, лучше вынесите его в отдельный файл в папке `_config` и подключите плагином. По такой логике в Триреме работает перенос слов — вы можете отключить его, закомментировав одну строчку в конфиге.

\_config/hyphenation.js {.birka}
```
// логика функции hyphenateText в начале файла и импорт библиотеки Hypher

export default function hyphenatorPlugin(eleventyConfig) {
	const hyphenatorRu = new Hypher(russian);
	const hyphenatorEn = new Hypher(english);
	
	eleventyConfig.addPreprocessor("hyphenate", "md", (data, content) => {
	return hyphenateText(content, hyphenatorRu, hyphenatorEn);
	}); 
}
```

/eleventy.config.js {.birka}
```
import hyphenatorPlugin from "./_config/hyphenation.js";

export default async function (eleventyConfig) {
	eleventyConfig.addPlugin(hyphenatorPlugin); 
``` 

**Eсли вам вообще не хочется запариваться,** но хочется автозамены кавычек на «ёлочки» и „лапки“, а дефисов на тире, внутри файла `_config/markdown-it.js`  замените false на true напротив параметра typographer. Предупреждаю — для длинного тире в таком случае нужно будет набрать три дефиса подряд, а для вложенных кавычек использовать одинарные `'`.

```
typographer: false, // замени на true
quotes: "«»„“",     
})
```

А вообще скачайте [раскладку для биологов](https://magvag.ru/layout/) и нужные символы всегда будут под рукой без всяких автотипографов.