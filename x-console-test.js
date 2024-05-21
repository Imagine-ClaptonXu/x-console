// ===== test =====


const testString = function () {
    showLog('===== string =====')
    showLog('asd')
    showLog('111 111')
}

const testNumber = function () {
    showLog('===== number =====')
    showLog(123)
}

const testUndefined = function () {
    showLog('===== undefined =====')
    showLog(undefined)
    showLog(null)
}

const testNull = function () {
    showLog('===== null =====')
    showLog(undefined)
    showLog(null)
}

const testBoolean = function () {
    showLog('===== boolean =====')
    showLog(true)
    showLog(false)
    showLog('true')
}

const testArray = function () {
    showLog('===== array =====')
    let a0 = ['a']
    let a1 = ['a', '1', 2, undefined, null, true, false]
    let a2 = [...a0, a0]
    
	showLog(a1)
    showLog(a2)
}

const testObject = function () {
    showLog('===== object =====')
    let o0 = {
        key: 'value',
        123: 123,
    }
    let o1 = {
        2: 'a', // 数字k，字符串v
		'b': 2, // 字符串k，数字v
		3: null,
		'123': 'ddd',
        null: 1,
        '中文': '中文',
        'boolean': true,
    }
    let o2 = {o1, ...o1, 1: o0}

	showLog(o1)
    showLog(o2)
}

const testArrayInObject = function () {
    showLog('===== ArrayInObject =====')
    let d1 = {
        "data": [1, 2, 3],
        "code": 0,
        "message": null
    }
    showLog(d1)
}

const testObjectInArray = function () {
    showLog('===== ObjectInArray =====')
    let d1 = [
        {
            "data": [1, 2, 3, {
                testBool: true,
            }],
            "code": 0,
            "message": null,

        },
        '{"data":[1,2,3],"code":0,"message":null}',
    ]
    showLog(d1)
}

const __test = function () {
    testString()
    testNumber()
    testUndefined()
    testNull()
    testBoolean()

    testArray()
    testObject()

    testArrayInObject()
    testObjectInArray()
}
