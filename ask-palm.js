
function ask_palm(prompt) {
	let msg;
	let url;
	let prompt_text;
	let requestBody;
	let payload;
	let result;
	msg = "";
	// Get your api key from https://makersuite.google.com/app/apikey
	let apikey = ".............";
	url = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key" + apikey;
	prompt_text = {
		'text': prompt
	}
	requestBody = {
		"prompt": prompt_text
	}
	payload = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	}
	return fetch(url, payload)
	.then(response => response.json())
	.then(data => data.candidates[0].output)
	.then((msg) => {
		addChat(prompt, msg);
	})
	.catch(error => {
		console.error('Error calling PALM2 API:', error);
	});
}
// explains chatgpt to a 10 years old boy
