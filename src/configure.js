const fs = require('fs');
const stringify = require("json-stringify-pretty-compact");

let op, defaultOption = {
	forceSet : false,	//true이면 -> set 할때 키가 없으면 생성한다
	ignoreDataType : false,	//true이면 -> set 할때 데이터 타입이 다르더라도 무시한다
	immediateFileSave : false	//true이면 -> set 할떄 파일로 바로 저장된다
};

function Blank(type) {
}

function load(path, option) {
	let configPath = '';
	let storedConfig = null;
	
	function Configure(path, option) {
		configPath = path;
		
		let buf = fs.readFileSync(path, {encoding:null, flag:'r+'});
		op = combine(defaultOption, option || {});
		this.store( JSON.parse(new String(buf)));
	}
	
	let methodList = {};
	let methodNames = [];

	methodList['get'] = function(keys) {
		if(!storedConfig) {
			throw new Error('Environment file not loaded');
		}
	
		let keyPath = keys.split('.');
		let parent = storedConfig;
		let v;
	
		do {
			let key = keyPath.shift();
			if(parent[key] == undefined) {
				v = undefined;
				break;
			}
			
			v = parent[key];
			parent = parent[key];
		} while(keyPath.length > 0);
	
		return v;
	};
	
	methodList['store'] = function(newValue) {
		if(typeof newValue == 'string')
			newValue = JSON.parse(newValue);
		storedConfig = newValue;
	
		for(key in this) {
			delete this[key];	//초기화
		}
	
		for(key in storedConfig) {
			if(methodList[key]) {
				throw new Error(key + ' is already define. ' + methodNames.join(','));
			}
			this[key] = storedConfig[key];
		}
	};
	

	methodList['set'] = function(keys, newValue) {
		let keyPath = keys.split('.');
		let parent = storedConfig;
		let lastKey = null;
	
		while(keyPath.length > 1) {
			let key = keyPath.shift();
			if(!parent[key]) {
				if(op.forceSet) {
					parent[key] = makeBlank();
				}
				else
					throw new Error(key + ' is not exists');
			}
		
			lastKey = key;
			parent = parent[key];
		}
	
		if(keyPath.length > 0) {
			lastKey = keyPath.shift();
			if(!parent[lastKey]) {
				if(op.forceSet) {
					parent[lastKey] = makeBlank();
				}
				else
					throw new Error(lastKey + ' is not exist');
			}
		}
	
		if(typeof parent[lastKey] != typeof newValue) {
			if(!(parent[lastKey] instanceof Blank) && !op.ignoreDataType)
				throw new Error('data type is different');
		}
	
		parent[lastKey] = newValue;
	
		if(op.immediateFileSave) {
			this.save();
		}
	};
	
	methodList['save'] = function() {
		if(!storedConfig) {
			throw new Error('Environment file not loaded');
		}
	
		fs.writeFileSync(configPath, stringify(storedConfig, {
			maxLength : 0
		}));
	};
	
	function makeBlank() {
		let b = new Blank();
		return b;
	}
	
	for(methodName in methodList) {
		Configure.prototype[methodName] = methodList[methodName];
		methodNames.push(methodName);
	}
	
	return new Configure(path, option);
}

function combine(def, usr) {
	function isEnd(v, k) {
		return ((v instanceof Function) || !(v instanceof Object));
	}
	function _(dst, def, usr) {
		for(var prop in def) {
			if(prop == 0) {
				return;
			}
			if(isEnd(def[prop], prop)) {
				dst[prop] = usr[prop] || def[prop];
			}
			else {
				dst[prop] = {};
				_(dst[prop], def[prop], usr[prop]);
			}
		}
	}
	var dst = {};
	_(dst, def, usr);
	return dst;
};

module.exports = (function() {
	return {
		load : load

		// load : function (path, option) {
		// 	return new Configure(path, option);
		// }
	}
})();