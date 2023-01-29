const flag = {"loc": "home"};

const home_con = document.getElementById("home-content");
const help_con = document.getElementById("help-content");
const bdi_con = document.getElementById("bdi-content");
const madrs_con = document.getElementById("madrs-content");

const bdi_msg = document.getElementById("bdi-msg");
const madrs_msg = document.getElementById("madrs-msg");

const bdi_scr_msg = document.getElementById("bdi-sc-disp");
const madrs_scr_msg = document.getElementById("madrs-sc-disp");

var flag_proxy = new Proxy(flag, {
	set: (target,key,value) => {
		target[key] = value;
		if (value === "home"){
			home_con.style.display = "initial";
			help_con.style.display = "none";
			bdi_con.style.display = "none";
			madrs_con.style.display = "none";
		}
		else if (value === "help") {
			chrome.storage.sync.get(['country'],(res) => {
				home_con.style.display = "none";
				help_con.style.display = "initial";
				bdi_con.style.display = "none";
				madrs_con.style.display = "none";
				document.getElementById("country").innerHTML = ` From IP your country is - ${res.country}`;
				var temp = ""
				var con_name = Object.keys(count_help).includes(res.country) ? res.country : "Other"
				count_help[con_name].forEach((ele) => {
					temp += `<li><h6> ${ele} <h6></li>`
				})
				document.getElementById("count-helpline").innerHTML = temp
			});
		}
		else if (value === "bdi_test") {
			home_con.style.display = "none";
			help_con.style.display = "none";
			bdi_con.style.display = "initial";
			madrs_con.style.display = "none";
		}
		else if (value === "madrs_test") {
			home_con.style.display = "none";
			help_con.style.display = "none";
			bdi_con.style.display = "none";
			madrs_con.style.display = "initial";
		}
		return true
	}
})

document.addEventListener("DOMContentLoaded",() => {
	chrome.storage.sync.get(["bdi_score","madrs_score"],(res) => {
		if (res.bdi_score > 20){
			bdi_scr_msg.innerHTML = `Your Previous BDI Test score: ${res.bdi_score} -- PLEASE SEEK HELP!!`;
		}
		else bdi_scr_msg.innerHTML = `Your Previous BDI Test score: ${res.bdi_score}`;
		if (res.madrs_score > 17){
			madrs_scr_msg.innerHTML = `Your Previous MADRS Test score: ${res.madrs_score} -- PLEASE SEEK HELP!!`;
		}
		else madrs_scr_msg.innerHTML = `Your Previous MADRS Test score: ${res.madrs_score}`;
	})
})

document.getElementById("help").addEventListener('click',() => {
	flag_proxy.loc = "help";
})

document.getElementById("bdi_test").addEventListener('click',() => {
	flag_proxy.loc = "bdi_test";
})

document.getElementById("madrs_test").addEventListener('click',() => {
	flag_proxy.loc = "madrs_test";
})

document.getElementById("help-home").addEventListener('click',() => {
	flag_proxy.loc = "home";
})

document.getElementById("bdi-home").addEventListener('click',() => {
	bdi_msg.innerHTML = "";
	bdi_msg.removeAttribute("class");
	chrome.storage.sync.get(["bdi_score"],(res) => {
		if (res.bdi_score > 20){
			bdi_scr_msg.innerHTML = `Your Previous BDI Test score: ${res.bdi_score} -- PLEASE SEEK HELP!!`;
		}
		else bdi_scr_msg.innerHTML = `Your Previous BDI Test score: ${res.bdi_score}`;
	})
	flag_proxy.loc = "home";
})

document.getElementById("madrs-home").addEventListener('click',() => {
	madrs_msg.innerHTML = "";
	madrs_msg.removeAttribute("class");
	chrome.storage.sync.get(["madrs_score"],(res) => {
		if (res.madrs_score > 17){
			madrs_scr_msg.innerHTML = `Your Previous MADRS Test score: ${res.madrs_score} -- PLEASE SEEK HELP!!`;
		}
		else madrs_scr_msg.innerHTML = `Your Previous MADRS Test score: ${res.madrs_score}`;
	})
	flag_proxy.loc = "home";
})

document.getElementById("download").addEventListener('click',() => {
	chrome.storage.sync.get(["bdi_score_ind","madrs_score_ind"],(res) => {
		const blob = new Blob(res.bdi_score_ind.concat(res.madrs_score_ind), {type: "text/plain"});
		const url = URL.createObjectURL(blob);
		chrome.downloads.download({ url: url, saveAs: true });
	})
})

document.getElementById("bdi-analyze").addEventListener('click',(e) => {
	e.preventDefault();
	let bdi_score = 0;
	let bdi_score_ind = ["\n BDI-TEST\n","\n"];
	bdi_msg.innerHTML = "";
	bdi_msg.removeAttribute("class");
	for (let ind = 1; ind < 22; ind++){
		let bdi_opt = document.getElementById(`bdi-${ind}`)
		bdi_score += parseInt(bdi_opt.value)
		bdi_score_ind.push(bdi_opt.options[parseInt(bdi_opt.value)].innerHTML+"\n")
	}
	if (bdi_score <=10) {
		bdi_msg.innerHTML = `Your score is: ${bdi_score} ->These ups and downs are considered normal`;
		bdi_msg.classList.add("green");
	}
	else if (bdi_score >=11 & bdi_score <= 16) {
		bdi_msg.innerHTML = `Your score is: ${bdi_score} ->Mild mood disturbance`;
		bdi_msg.classList.add("light-green");
		bdi_msg.classList.add("darken-3");
	}
	else if (bdi_score >=17 & bdi_score <= 20) {
		bdi_msg.innerHTML = `Your score is: ${bdi_score} ->Borderline clinical depression`;
		bdi_msg.classList.add("lime");
		bdi_msg.classList.add("darken-3");
	}
	else if (bdi_score >=21 & bdi_score <= 30) {
		bdi_msg.innerHTML = `Your score is: ${bdi_score} ->Moderate depression`;
		bdi_msg.classList.add("yellow");
		bdi_msg.classList.add("darken-3");
	}
	else if (bdi_score >=31 & bdi_score <= 40) {
		bdi_msg.innerHTML = `Your score is: ${bdi_score} ->Severe depression`;
		bdi_msg.classList.add("orange"); 
		bdi_msg.classList.add("darken-3");
	}
	else if (bdi_score >= 41) {
		bdi_msg.innerHTML = `Your score is: ${bdi_score} ->Extreme depression`;
		bdi_msg.classList.add("red");
	}
	chrome.storage.sync.set({ "bdi_score": bdi_score, "bdi_score_ind": bdi_score_ind})
})

document.getElementById("madrs-analyze").addEventListener('click',(e) => {
	e.preventDefault();
	let madrs_score = 0;
	let madrs_score_ind = ["\n MADRS TEST\n","\n"]
	madrs_msg.innerHTML = "";
	madrs_msg.removeAttribute("class");
	for (let ind = 1; ind < 11; ind++){
		let v = parseInt(document.getElementById(`madrs-${ind}`).value)
		madrs_score += v;
		madrs_score_ind.push(`${madrs_title[ind-1]} - score ${v} \n`)
	}
	if (madrs_score <=12) {
		madrs_msg.innerHTML = `Your score is: ${madrs_score} ->No or minimal depression`;
		madrs_msg.classList.add("green");
	}
	else if (madrs_score >=13 & madrs_score <= 19) {
		madrs_msg.innerHTML = `Your score is: ${madrs_score} ->Mild depression`;
		madrs_msg.classList.add("lime");
		madrs_msg.classList.add("darken-3");
	}
	else if (madrs_score >=20 & madrs_score <= 34) {
		madrs_msg.innerHTML = `Your score is: ${madrs_score} ->Moderate depression`;
		madrs_msg.classList.add("amber");
		madrs_msg.classList.add("darken-3");
	}
	else if (madrs_score >=34) {
		madrs_msg.innerHTML = `Your score is: ${madrs_score} ->Severe depression`;
		madrs_msg.classList.add("red");
	}
	chrome.storage.sync.set({ "madrs_score": madrs_score, "madrs_score_ind": madrs_score_ind});
})