// ===== test =====


const testStr = function () {
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

const testArray = function () {
    showLog('===== array =====')
    let a0 = ['a']
    let a1 = ['a', '1', 2, undefined, null]
    let a2 = [...a0, a0]
    let a3 = [
        a1,
        {
            1:2
        }
    ]
    
	showLog(a1)
    showLog(a2)
    showLog(a3)
}

const testObject = function () {
    showLog('===== object =====')
    let o0 = {
        1: 1,
    }
    let o1 = {
        1: 2, // 数字k，数字v
        2: 'a', // 数字k，字符串v
		'a': 'b', // 字符串k，字符串v
		'b': 2, // 字符串k，数字v
		3: null,
		'c': undefined,
		'123': 'ddd',
        null: 1,
        '中文 key': '中文 value',
    }
    let o2 = {o1, ...o1}
    let o3 = {
        ...o0,
        1: o0,
    }
	showLog(o1)
    showLog(o2)
    showLog(o3)
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
            "data": [1, 2, 3],
            "code": 0,
            "message": null 
        },
        {
            "data": [1, 2, 3],
            "code": 0,
            "message": null 
        },
    ]
    showLog(d1)
}

const __test = function () {
    testStr()
    testNumber()
    testUndefined()
    testNull()
    testArray()

    testObject()
    testArrayInObject()
    testObjectInArray()
}
