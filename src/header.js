let info = document.getElementById("show_info"),
	info_div = document.getElementById("headerDiv"),
	info_paragraph = document.getElementById("infoParagraph"),
	unfolded = false;
info.addEventListener("click", onInfoClicked);
function onInfoClicked() {
	if(!unfolded){
		info_div.classList.add("unfolded");
		info_paragraph.classList.remove("hidden");
		unfolded = true;
	}else if (unfolded){
		info_div.classList.remove("unfolded");
		info_paragraph.classList.add("hidden");
		unfolded=false;
	}



}