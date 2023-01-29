chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set(
		{ 'dep_score' : 0, 
		"bdi_score": 0, 
		"madrs_score": 0, 
		"bdi_score_ind": ["Please take BDI test \n"],
		"madrs_score_ind": ["Please take MADRS test \n"]
	});
	fetch("http://ip-api.com/json")
	.then(resp => resp.json())
	.then(data => {
		chrome.storage.sync.set({ country: data["country"] });
	})
	.catch((error) => {
	  chrome.storage.sync.set({ country: "Other" });
	});
})