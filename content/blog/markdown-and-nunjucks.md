---
title: "Оформляем третью заметку: программируем с nunjucks"
description: Провальная часть трилогии об извращениях в Маркдауне. Рассказываю, что внутри заметки можно писать циклы, if-выражения, задавать переменные и подглядывать в метаданные. Нужно ли это вам — решайте сами.
date: 2025-04-23
taglist:
  - nunjucks
  - 11ty
draft: 
starred:
---
В корне папки `/content/` вы найдёте много файлов с расширением `.njk` и каким-то квазипрограммистским языком вперемешку с ХТМЛ внутри. Знакомьтесь, это [Nunjucks,](https://mozilla.github.io/nunjucks/) и в 11ty он работает даже внутри Маркдаун-разметки.

Рассмотрим синтаксис на простом примере: навигация в шапке.  

В метаданных сайта (файл `/data/metadata.js`) есть такое поле.
```
	navigation_pages: [
		{ title: "Мануал", url: "/notes/", class: "" },
		{ title: "#11ty", url: "/tags/11ty/" },
		{ title: "#Обсидиан", url: "/tags/obsidian/" },
		{ title: "Все посты", url: "/notes/all/" },
	],
```

В базовом шаблоне для всех страниц, внутри тега header есть следующая инструкция (приведена с упрощениями). Чтобы nunjucks не исполнялся в блоке ниже, я заменил все % на ×, а сдвоенные фигурные скобки разредил пробелами.
```
<ul class="linklist">
{×- for entry in metadata.navigation_pages ×}
	<li class="linklist-item unvisitable underline">
			<a href="{ { entry.url } }">{ { entry.title } }</a>
	</li>
{×- endfor ×}
</ul

```

Если вставить эту же инструкцию без замен, получится воспроизвести шапку сайта внутри заметки. Конкретно здесь чуть сломался ЦСС, но как proof-of-concept — пойдёт.
<ul class="linklist" style='margin-bottom: 1rem;'>
{%- for entry in metadata.navigation_pages %}
	<li class="linklist-item unvisitable underline">
			<a href="{{ entry.url }}">{{entry.title}}</a>
	</li>
{%- endfor %}
</ul>

У nunjucks внутри MD-файла, как я понял, нет доступа к некоторым глобальным вещам: коллекции всех постов (collections.posts), фильтрам (nonImages и sortAlphabetically) и кто знает, чему ещё. Это бесполезные вещи при написании заметки — но очень полезные, чтобы написать инструкцию для генерации списка файлов внутри папки /media/ с разбивкой по постам (см. `media.njk`). 

```
<ul class='linklist'>
	{× for post in collections.posts ×}
	{× set nonImages = post.data.media | nonImages | sortAlphabetically ×}
	{× if nonImages.length > 0 ×}
		{× for file in nonImages ×}
			<li class='linklist-item unvisitable'>
				<a href="/media/{ { file } }">{ { file } }</a><a class="post-url-anchor" href="{ { post.url } }"> #</a>
			</li>
		{× endfor ×}
	{× endif ×}
	{× endfor ×}
</ul>
```



**Заключение** 
Я не знаю, зачем вам могут пригодится циклы и переменные в обычной заметке, моё дело сообщить о возможности. Можете там из джейсоновой базы данных сделать самообновляющуюся HTML-таблицу. Или `{ { page.url } }` или  `{ { title } }` вписать в текст как переменную, а не захардкодить.

Не очень впечатляет, правда? 

Кстати, эта заметка называется «{{title}}». Вдруг вы забыли.