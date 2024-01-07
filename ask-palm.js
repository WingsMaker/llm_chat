
function ask_gemini(qn) {
	let url;
	let prompt_text;
	let requestBody;
	let payload;
	let yy = new Date().getFullYear().toString();
	let token = "U2FsdGVkX1+1q1q3vNjaw3lwCs5k/dbn4/u2/YdlKdBRWP50dUOQoh3tOZSxtrsApgcOiTnEjA8jJEiqGdaU+PKIMm/f6eT8lKyFkT7eiO9PyjEfQYuyD7NlKuh3yqtU1ooOLmgicVAE7GoitJ+1FSVDuKaNZv1rXBRxw9PylGt15ABUvBsqazDC70Jib6F9";
	let msg = "";
	url =  CryptoJS.AES.decrypt(token, yy).toString(CryptoJS.enc.Utf8);
	prompt_text = {
		'text': encodeURIComponent(qn)
	}
	parts = {
		"parts": prompt_text
	}
	requestBody = {
		"contents": parts
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
	.then(content => content.candidates[0].content)
	.then(parts => parts.parts[0].text)
	.then((msg) => {
		msg = decodeURIComponent(msg);
		addChat(qn, msg);
		document.getElementById("input").value = "";
	})
	.catch(error => {
		msg = "Error calling api : " + error;
		addChat(qn, msg);
		document.getElementById("input").value = "";
	});
}


function ask_palm(prompt) {
	let url;
	let prompt_text;
	let requestBody;
	let payload;
	let yy = new Date().getFullYear().toString();
	let token = "U2FsdGVkX1+Gi7exaNogbqY7UpTOtaTZ+Oa2UXpI4XKAO6t7FZPpVhPk8OUCpJImbhBZSNWW/WLaZu+8Lj08ofSp2csD4+1oR26Hs4ApggnuBjhmXimuNJcmoAQLdsV1iDQbE4zTanKjVsxpjfmXh5Kd8Y3PkQbwNHue6X2V+5qk5bU7mH4lrWmxBsAnmuAp70dJM6cYgBH5qMoOk5qnVA==";
	url =  CryptoJS.AES.decrypt(token, yy).toString(CryptoJS.enc.Utf8);
	let msg = "";
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
		document.getElementById("input").value = "";
	})
	.catch(error => {
		msg = "Error calling api : " + error;
		addChat(prompt, msg);
		document.getElementById("input").value = "";
	});
}
