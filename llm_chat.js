
document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("input");  
  inputField.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
		let input = inputField.value;
		inputField.value = "";
		if (input=="") {
			return
		}
		output(input);
    }
  });
});

function clearscreen() {
	document.getElementById("messages").innerHTML = "";
	document.getElementById("input").value = "";
}

function sendqn() {
	let qn = document.getElementById("input").value;
	if (qn =="") {
		return
	}
	output(qn);
}

function addChat(input, product) {
  const messagesContainer = document.getElementById("messages");
	let tts = document.getElementById("tts").checked;

  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<img src="user.png" class="avatar"><span>${input}</span>`;
  messagesContainer.appendChild(userDiv);

  let botDiv = document.createElement("div");
  let botImg = document.createElement("img");
  let botText = document.createElement("span");
  botDiv.id = "bot";
  botImg.src = "bot-mini.png";
  botImg.className = "avatar";
  botDiv.className = "bot response";
  botText.innerText = "Typing...";
  botDiv.appendChild(botText);
  botDiv.appendChild(botImg);
  messagesContainer.appendChild(botDiv);
  // Keep messages at most recent
  messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;

  // Fake delay to seem "real"
  setTimeout(() => {
    botText.innerText = `${product}`;
	if (tts) {
		textToSpeech(product);
	}
  }, 2000
  )
}

function output(input) {
	let product;
	let use_palm = document.getElementById("palm").checked;
	document.getElementById("input").value = "please wait.....";
	let text = input;
	if (use_palm) {
		let regExp = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g;
		if ( regExp.test(input) == true ) {
			product = "Sorry I can only understand pure english.\nSet the asean languages support to YES below.";
			addChat(input, product);
			document.getElementById("input").value = "";
			return
		}
		text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim(); 
	}
	
	text = text
	.replace(/ a /g, " ")   // 'tell me a story' -> 'tell me story'
	.replace(/i feel /g, "")
	.replace(/whats/g, "what is")
	.replace(/please /g, "")
	.replace(/ please/g, "")
	.replace(/r u/g, "are you");
  	
	if (compare(prompts, replies, text)) { 
	// Search for exact match in `prompts`
	product = compare(prompts, replies, text);
	} else if (text.match(/thank/gi)) {
	product = "You're welcome!"
	} else if (text.match(/(corona|covid|virus)/gi)) {
	// If no match, check if message contains `coronavirus`
	product = coronavirus[Math.floor(Math.random() * coronavirus.length)];
	} else {
	// If all else fails: random alternative
	//product = alternative[Math.floor(Math.random() * alternative.length)];
		if (use_palm) {
			ask_palm(text);
		} else {
			ask_gemini(text);
		}
	return
	}

	// Update DOM
	addChat(input, product);
	document.getElementById("input").value = "";
}

function compare(promptsArray, repliesArray, string) {
  let reply;
  let replyFound = false;
  for (let x = 0; x < promptsArray.length; x++) {
    for (let y = 0; y < promptsArray[x].length; y++) {
      if (promptsArray[x][y] === string) {
        let replies = repliesArray[x];
        reply = replies[Math.floor(Math.random() * replies.length)];
        replyFound = true;
        // Stop inner loop when input value matches prompts
        break;
      }
    }
    if (replyFound) {
      // Stop outer loop when reply is found instead of interating through the entire array
      break;
    }
  }
  return reply;
}
