// GAP нужен, чтобы не показывать тени, если скролл совсем чуть-чуть
const GAP = 5;

document.querySelectorAll(".js-scrollable").forEach(($el) => {
	$el.addEventListener("scroll", () => {
		const isScrolled = $el.scrollLeft > GAP;
		const isEnd = $el.scrollLeft + $el.offsetWidth > $el.scrollWidth - GAP;

		$el.parentElement.classList.toggle("is__scrolled", isScrolled);
		$el.parentElement.classList.toggle("is__end", isEnd);
	});
});
