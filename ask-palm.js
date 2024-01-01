
function ask_palm(qn) {
	let msg;
	let url;
	let prompt_text;
	let requestBody;
	let payload;
	let result;
	//msg = "";
	//url = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyCHNsZU2T8NYy_VTfOT1q9Bgow_y-Hp_ss";
	url = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyCHNsZU2T8NYy_VTfOT1q9Bgow_y-Hp_ss";
	msg = encodeURIComponent(qn);
	prompt_text = {
		'text': msg
	}
	requestBody = {
		"prompt": prompt_text
	}
	parts = {
		"parts": prompt_text
	}
	contents = {
		"contents": parts
	}
	payload = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	}
	postdata = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(contents)
	}
	return fetch(url, postdata)
	.then(response => response.json())
	.then(content => content.candidates[0].content)
	.then(parts => parts.parts[0].text)
	.then((msg) => {
		msg = decodeURIComponent(msg);
		addChat(qn, msg);
	})
	.catch(error => {
		msg = "Error calling api : " + error;
		addChat(qn, msg);
	});
}

// write a story about singapore chickren rice
