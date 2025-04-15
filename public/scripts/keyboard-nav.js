document.addEventListener("keydown", (e) => {
	if (e.ctrlKey) {
		if (e.key === "ArrowRight") {
			const nextLink = document.querySelector(".links-nextprev-next a");
			if (nextLink) nextLink.click();
		}
		if (e.key === "ArrowLeft") {
			const prevLink = document.querySelector(".links-nextprev-prev a");
			if (prevLink) prevLink.click();
		}
	}
});
