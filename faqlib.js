// Written by Kim Huat for information search based on sentimental analytics
var faq_threshold = 0.8;
var faq_list = [];
var fld_dict = {};
var tbl_dict = {};

var stopwords_list = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 
'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 
'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 
'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are',
 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 
 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 
 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 
 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 
 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 
 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 
 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 
 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn',
 "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 
 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't", '"',
 "leh", "lah", "lor", "liao", "meh"];
 
function remove_stopwords(txt) {
	var txt_list = txt.split(" ");
	var newlist = [];
	txt_list.forEach((w)=>{
		w = w.replace("?", "");
		w = w.replace(".", "");
		w = w.replace(",", "");
		if ( stopwords_list.indexOf(w) == -1) {
			newlist.push(w);
		}
	});
	return newlist.join(" ");
}

function checkSimilarity(text1, text2){
	var txtA = text1.toLowerCase();
	var txtB = text2.toLowerCase();
	txtA = remove_stopwords(txtA);
	txtB = remove_stopwords(txtB);
	var similarity = textCosineSimilarity(txtA, txtB);
	similarity = Math.round(similarity * 100)
	return similarity;
}

function textCosineSimilarity(txtA,txtB){
	let words1 = txtA.split(' ');
	let wordCountA = {};
	words1.forEach((w)=>{
		wordCountA[w] = 0;
	});
	words1.forEach((w)=>{
		wordCountA[w] = (wordCountA[w] || 0) +1;
	});
	let words2 = txtB.split(' ');
	let wordCountB = {};
	words2.forEach((w)=>{
		wordCountB[w] = 0;
	});
	words2.forEach((w)=>{
		wordCountB[w] = (wordCountB[w] || 0) +1;
	});
	let dict = {};
	for(let key in wordCountA){
		dict[key] = true;
	}
	for(let key in wordCountB){
		dict[key] = true;
	}
	let vectorA = [];
	for (let term in dict){
		vectorA.push(wordCountA[term] || 0);
	}
	let vectorB = [];
	for (let term in dict){
		vectorB.push(wordCountB[term] || 0);
	}
	let product = 0;
	var magA = magnitude(vectorA);
	var magB = magnitude(vectorB);
	var magnitudeAB = magA * magB
	if ( magnitudeAB > 0 ) {
		let n = vectorA.length;
		for(let i=0; i < n ; i++) {
			product = product + (vectorA[i] * vectorB[i]);
		}
		product = product / magnitudeAB;
	}
	return product;
}

function magnitude(vec){
	let sum = 0;
	for (let i = 0;i<vec.length;i++){
		sum += vec[i] * vec[i];
	}
	return Math.sqrt(sum);
}

function process_dictionary( content ) {
	var lines = content.split("\n");
	var cnt = lines.length;
	var x = 0;
	var w = "";
	var txt = "";
	var msg = "";
	var result = "";
	var w_list = [];
	for (x = 0; x < cnt; x++) {
		result = lines[x];
		result = result.replace(String.fromCharCode(10), "");
		result = result.replace(String.fromCharCode(13), "");
		n = result.length;
		if ( n > 0 ) {
			if ( result.endsWith(String.fromCharCode(169)) ) {
				if ( msg.length > 0) {
					faq_list.push( msg );
				}
				msg = "";
			} else {
				msg = msg + result + "\n";
			}
		}
	}
	faq_list.push( msg );
	var d = "";
	var t = "";
	var m = 0;
	var n = 0;
	var tbl_list = [];
	for (n in faq_list){
		w = faq_list[n];
		w_list = w.split("\n");
		w_list.forEach((x)=>{
			txt = x.toLowerCase();
			if ( txt.startsWith("data element : ") ) {
				d = txt.replace("data element : ","");
				fld_dict[d] = "";
			}			
			if ( txt.startsWith("tables : ") ) {
				t = txt.replace("tables : ","");
				fld_dict[d] = t;
				tbl_list = t.split(",");
				for (m in tbl_list) {
					w = tbl_list[m];
					if ( tbl_dict[ w ] == undefined ) {
						tbl_dict[ w ] = [ d ];
					} else {
						tbl_dict[ w ].push( d );
					}
				}
			}
		})
	}
	msg = "Commands :\n";
	msg = msg + "table list (keyword)\n";
	msg = msg + "display table (keyword)\n";
	msg = msg + "field list (keyword)\n";
	msg = msg + "display field (keyword)\n";
	return msg;
}

function faq_search(inp) {
	var max_score = 0;
	var inp_score = 0;
	var faq_scores = [];
	var score_list = [];
	var answer = "";
	var msg = "";
	var w = "";
	var y = 0;
	var qns = inp.toLowerCase();
	if ( qns.length == 0 ) {
		return;
	}
	faq_scores = []
	Object.keys(faq_list).forEach(function(k) {
		w = faq_list[k];
		if( w.length > 0 ) {
			txt = w.toLowerCase();
			y = 0;
			if ( txt.indexOf(qns) >= 0 ) {
				y = 1;
			}
			w_list = w.split("\n");
			score_list = [];
			w_list.forEach((x)=>{
				txt = x.toLowerCase();
				y = checkSimilarity(inp, x);
				score_list.push( y );
			})
			inp_score = Math.max.apply(null, score_list);
			max_score = Math.max.apply(null, [ y, inp_score]);
			y = 0;
			if ( max_score >= faq_threshold ) {
				y = max_score;
			}
			faq_scores.push( y );
		} else {
			faq_scores.push( 0 );
		}
	});
	return faq_scores;
}

function search_corpus( inp ) {
	var max_score = 0;
	var msg = "";
	var m = 0;
	var n = 0;
	var txt = "";
	var faq_scores = [];
	var mylist = [];
	msg = inp.toLowerCase();
	if ( msg.indexOf( "table list") >= 0 ) {
		msg = msg.replace("table list","").replaceAll(" ","");
		mylist = Object.keys(tbl_dict).sort();
		mylist = mylist.filter( x => x.indexOf(msg) >= 0);
		m = mylist.length;
		msg = "# of tables = " + m.toString();
		for (n in mylist){
			msg = msg + "\n" + n.toString() + "\t" + mylist[n];
		}
		return msg;
	}
	if ( msg.indexOf( "display table") >= 0 ) {
		msg = msg.replace("display table","").replaceAll(" ","");
		msg = table_info( msg );
		return msg;
	}
	if ( msg.indexOf( "field list") >= 0 ) {
		msg = msg.replace("field list","").replaceAll(" ","");
		var mylist = Object.keys(fld_dict).sort();
		mylist = mylist.filter( x => x.indexOf(msg) >= 0);
		m = mylist.length;
		msg = "# of fields = " + m.toString();
		for (n in mylist){
			msg = msg + "\n" + n.toString() + "\t" + mylist[n];
		}
		return msg;
	}
	if ( msg.indexOf( "display field") >= 0 ) {
		msg = msg.replace("display field","").replaceAll(" ","");
		var mylist = Object.keys(fld_dict);
		n = mylist.indexOf(msg);
		msg = faq_list[n];
		return msg;
	}
	faq_scores = faq_search( inp );
	max_score = Math.max.apply(null, faq_scores);
	if ( max_score > 0 ) {
		n = faq_scores.indexOf(max_score);
		msg = "Search result for : " + inp + "\n\n";
		msg = msg + faq_list[n] + "\n\n";
	} else {
		msg = "Unable to find the matching results.";
	}
	return msg;	
}

function table_info( tbl_name ) {
	var t = tbl_name.toLowerCase();
	var flist = [];
	var txt = "";
	var m = 0;
	var n = 0;
	var fields_list = [];
	for(let fld in fld_dict){
		flist = fld_dict[ fld ];
		m = flist.indexOf(t);
		if (m >= 0) {
			fields_list.push( fld );
		}		
	}
	m = fields_list.length;
	if (m == 0) {
		return "";
	}
	txt = fields_list.join(",");
	txt = "\nFields : \n";
	var k = 0;
	for (n in fields_list){
		k = k + 1;		
		txt = txt + fields_list[n];
		if (k < m) {
			txt = txt + ",";
		}
		if ( (k % 5) == 0 ) {
			txt = txt + "\n";
		}
	}
	var msg = "Table : tbl_name\n# of fields = "  + m.toString();
	msg = msg + txt;	
	return msg;
}

function question_list() {
	var txt = "";
	var qn_list = [];
	var cnt = faq_list.length;
	for (x = 0; x < cnt; x++) {
		txt = faq_list[x].split("\n")[0];
		qn_list.push( txt );
	}
	return qn_list;
}
