const GAP = 5;
window.addEventListener("load", function () {
	document.querySelectorAll(".js-scrollable").forEach(($el) => {
		const parent = $el.parentElement;
		const update = () => {
			const canScroll = $el.scrollWidth > $el.clientWidth + GAP;
			if (canScroll) {
				parent.classList.add("scrollable__verified");
				parent.classList.toggle("is__scrolled", $el.scrollLeft > GAP);
				parent.classList.toggle(
					"is__end",
					$el.scrollLeft + $el.offsetWidth > $el.scrollWidth - GAP,
				);
			}
		};

		update();
		$el.addEventListener("scroll", update);
		window.addEventListener("resize", update);
	});
});
