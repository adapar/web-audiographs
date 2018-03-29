//FROM: https://gist.github.com/jinzhu/255444

keyBindings = (function(){
	var keyId = {
		"U+0008" : "BackSpace",
		"U+0009" : "Tab",
		"U+0018" : "Cancel",
		"U+001B" : "Esc",
		"U+0020" : "Space",
		"U+0021" : "!",
		"U+0022" : "\"",
		"U+0023" : "#",
		"U+0024" : "$",
		"U+0026" : "&",
		"U+0027" : "'",
		"U+0028" : "(",
		"U+0029" : ")",
		"U+002A" : "*",
		"U+002B" : "+",
		"U+002C" : ",",
		"U+002D" : "-",
		"U+002E" : ".",
		"U+002F" : "/",
		"U+0030" : "0",
		"U+0031" : "1",
		"U+0032" : "2",
		"U+0033" : "3",
		"U+0034" : "4",
		"U+0035" : "5",
		"U+0036" : "6",
		"U+0037" : "7",
		"U+0038" : "8",
		"U+0039" : "9",
		"U+003A" : ":",
		"U+003B" : ";",
		"U+003C" : "<",
		"U+003D" : "=",
		"U+003E" : ">",
		"U+003F" : "?",
		"U+0040" : "@",
		"U+0041" : "a",
		"U+0042" : "b",
		"U+0043" : "c",
		"U+0044" : "d",
		"U+0045" : "e",
		"U+0046" : "f",
		"U+0047" : "g",
		"U+0048" : "h",
		"U+0049" : "i",
		"U+004A" : "j",
		"U+004B" : "k",
		"U+004C" : "l",
		"U+004D" : "m",
		"U+004E" : "n",
		"U+004F" : "o",
		"U+0050" : "p",
		"U+0051" : "q",
		"U+0052" : "r",
		"U+0053" : "s",
		"U+0054" : "t",
		"U+0055" : "u",
		"U+0056" : "v",
		"U+0057" : "w",
		"U+0058" : "x",
		"U+0059" : "y",
		"U+005A" : "z",
		"U+005B" : "[",
		"U+005C" : "\\",
		"U+005D" : "]",
		"U+00DB" : "[",
		"U+00DC" : "\\",
		"U+00DD" : "]",
		"U+005E" : "^",
		"U+005F" : "_",
		"U+0060" : "`",
		"U+007B" : "{",
		"U+007C" : "|",
		"U+007D" : "}",
		"U+007F" : "Delete",
		"U+00A1" : "¡",
		"U+0300" : "CombAcute",
		"U+0302" : "CombCircum",
		"U+0303" : "CombTilde",
		"U+0304" : "CombMacron",
		"U+0306" : "CombBreve",
		"U+0307" : "CombDot",
		"U+0308" : "CombDiaer",
		"U+030A" : "CombRing",
		"U+030B" : "CombDblAcute",
		"U+030C" : "CombCaron",
		"U+0327" : "CombCedilla",
		"U+0328" : "CombOgonek",
		"U+0345" : "CombYpogeg",
		"U+20AC" : "€",
		"U+3099" : "CombVoice",
		"U+309A" : "CombSVoice"
	};

	function getKey(evt){
		var key = evt.code;//keyId[evt.keyIdentifier] || evt.keyIdentifier,
		ctrl = evt.ctrlKey ? 'C-' : '',
		meta = (evt.metaKey || evt.altKey) ? 'M-' : '',
		shift = evt.shiftKey ? 'S-' : '';
		if (evt.shiftKey){
			if (/^[a-z]$/.test(key)){
				return ctrl+meta+key.toUpperCase();
			}
			if (/^[0-9]$/.test(key)) {
				switch(key) {
				case "4":
					key = "$";
					break;
				}
				return key;
			}
			if (/^(Enter|Space|BackSpace|Tab|Esc|Home|End|Left|Right|Up|Down|PageUp|PageDown|F(\d\d?))$/.test(key)){
				return ctrl+meta+shift+key;
			}
		}
		return ctrl+meta+key;
	}

	var bindings    = [];
	var currentKeys = [];

	function sameArray(x, y) {
		if(!(x instanceof Array && y instanceof Array)) return false;

		var len = 0;
		for(var i in x) {
			if(x[i] instanceof Array){
				if(!sameArray(x[i],y[i])) return false;
			}else{
				if(x[i] != y[i]) return false;
			}
			len++;
		}
		return y.length == len;
	}

	function add(/*Array*/ keys,/*Function*/ fun,/*Boolean*/ input){
		if(typeof keys == 'string'){ keys = Array(keys); }
		bindings.push([keys,fun,!!input]);
	}

	function remove(/*Array*/ keys,/*Function*/ fun,/*Boolean*/ input){
		if(typeof keys == 'string'){ keys = Array(keys); }
		for(var i in bindings){
			if(sameArray(bindings[i],[keys,fun,!!input])) return bindings.splice(i,1);
		}
	}

	function exec(e){
		key = getKey(e);
		currentKeys.push(key);

		if(console && console.debug){ console.debug('handling key: ' + currentKeys.join(', ')); }

		var matched = [];

		binding : for(var i in bindings){
      if(/^INPUT|TEXTAREA$/.test(e.target.nodeName) != bindings[i][2]) continue binding;

			for(var j in currentKeys){
				if(currentKeys[j] != bindings[i][0][j]) continue binding;
			}
			matched.push(bindings[i]);
		}

		// TODO notices matched functions, pass arguments
    for(var i in matched){
    	console.log(matched[i]);
			if(matched[i][0].length == currentKeys.length){
				matched[i][1].call();
				matched.splice(i,1);
			}
		}

		if(matched.length == 0 || key == 'Esc'){ reset(); }
	}

	function reset(){
		currentKeys = [];
	}

	return { add : add, exec : exec, remove : remove};
})()

document.addEventListener('keydown', keyBindings.exec, false);