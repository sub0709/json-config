/*

mocha test/configstore

*/

const Configure = require('./configure');

var assert = require("assert"); //nodejs에서 제공하는 aseert 모듈

describe('테스트 플로우', function() {
	let defaultValue;

	before(function() {
		defaultValue = {
			"dbInfo": {
				"db": {
					"host": "localhost",
					"port": 3781,
					"dbName": "testapp"
				},
				"option": {
					"order": "asc",
					"count": 1
				}
			}
		};
	});

	let conf1, conf2;
	describe('디폴트 테스트', function() {
		before(function() {
			// 이 블록 내의 테스트들을 실행하기에 앞서 한번 실행되는 부분
			conf1 = Configure.load('test-setting.json');
			conf1.store(JSON.stringify(defaultValue));
			conf2 = Configure.load('test-setting2.json');
		});
	
		after(function() {
			// 이 블록 내의 테스트들을 모두 실행한 후에 한번 실행되는 부분
		});
	
		beforeEach(function() {
			// 이 블록 내의 각 테스트들이 실행되기 전에 실행
		});
	
		afterEach(function() {
			// 이 블록 내의 각 테스트들이 실행된 후에 실행
		});
	
		// test cases
		it('존재하는 값 확인', function () {
			assert.equal('localhost', conf1.get('dbInfo.db.host'));
			assert.equal(3781, conf1.get('dbInfo.db.port'));
			assert.equal('asc', conf1.dbInfo.option.order);
			assert.equal(-167, conf2.china.manual_entryid);
		});
	
		it('값 변경', function () {
			conf1.set('dbInfo.db.host', 'local.app.com');
			assert.equal('local.app.com', conf1.get('dbInfo.db.host'));
	
			conf1.set('dbInfo.db.port', 0);
			assert.equal(0, conf1.get('dbInfo.db.port'));
		});
	
		it('없는 키에 저장하기', function () {
			let ret = '';
			try {
				conf1.set('dbInfo.db.abc', false);
			}
			catch(e) {
				ret = e.toString();
			}
			assert.equal('Error: abc is not exist', ret);
		});
	
		it('다른 데이터 타입으로 저장하기', function () {
			let ret = '';
			try {
				conf1.set('dbInfo.db.dbName', 999);
			}
			catch(e) {
				ret = e.toString();
			}
			assert.equal('Error: data type is different', ret);
		});
	
	});
	
	
	describe('모든 옵션 키기', function() {
		before(function() {
			// 이 블록 내의 테스트들을 실행하기에 앞서 한번 실행되는 부분
			Configure.load('test-setting.json', {
				forceSet : true,	//true이면 -> set 할때 키가 없으면 생성한다
				ignoreDataType : true,	//true이면 -> set 할때 데이터 타입이 다르더라도 무시한다
				immediateFileSave : false
			});
			conf1.store(JSON.stringify(defaultValue));
		});
	
		after(function() {
			// 이 블록 내의 테스트들을 모두 실행한 후에 한번 실행되는 부분
			conf1.save();
		});
	
		// test cases
		it('존재하는 값 확인', function () {
			assert.equal('localhost', conf1.get('dbInfo.db.host'));
			assert.equal(3781, conf1.get('dbInfo.db.port'));
			assert.equal('asc', conf1.dbInfo.option.order);
		});
	
		it('값 변경', function () {
			conf1.set('dbInfo.db.host', 'local.app.com');
			assert.equal('local.app.com', conf1.get('dbInfo.db.host'));
	
			conf1.set('dbInfo.db.port', 0);
			assert.equal(0, conf1.get('dbInfo.db.port'));
		});
	
		it('없는 키에 저장하기', function () {
			conf1.set('dbInfo.db.abc', false);
			assert.equal(false, conf1.get('dbInfo.db.abc'));
		});
	
		it('다른 데이터 타입으로 저장하기', function () {
			conf1.set('dbInfo.db.dbName', 999);
			assert.equal(999, conf1.get('dbInfo.db.dbName'));
		});
	
	});
	
});
