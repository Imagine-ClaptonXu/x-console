// ===== 工具函数


const log = console.log.bind(console)

const e = className => document.querySelector(className)

const es = className => document.querySelectorAll(className)

// 生成 16 位的随机字符串
const getRandomCode = function () {
	let res = []
	let arr = []
	let resStr
	for (let i = 65; i <= 90; i++) {
		arr.push(String.fromCharCode(i))
	}
	for (let i = 0; i < 10; i++) {
		arr.push(String(i))
	}
	for (let i = 0; i < 16; i++) {
		let index = Math.floor(Math.random() * arr.length)
		res.push(arr[index])
	}
	resStr = res.join('')
	return resStr
}

// 判断类型
const getType = function (data) {
	let typeText = Object.prototype.toString.call(data)
	let map = {
		'[object String]': 'String',
		'[object Number]': 'Number',
		'[object Array]': 'Array',
		'[object Object]': 'Object',
		'[object Undefined]': 'Undefined',
		'[object Null]': 'Null',
        '[object Boolean]': 'Boolean',
	}
	let res = map[typeText]
	return res
}

// 拿到 △ __proto__: Array(0)
// XX.prototype 的全部方法
const getTypeProto = function (type) {
	let res = ''
	if (type === 'Array') {
		res = Object.getOwnPropertyNames(Array.prototype)
	}
	else if (type === 'Object') {
		res = Object.getOwnPropertyNames(Object.prototype)
	}
	else if (type === 'String') {
		res = Object.getOwnPropertyNames(String.prototype)
	}
	else if (type === 'Number') {
		res = Object.getOwnPropertyNames(Number.prototype)
	}
    else if (type === 'Boolean') {
		res = Object.getOwnPropertyNames(Boolean.prototype)
	} else {
        console.error('### unknown prototype')
    }
	return res
}

// dom 的展示和隐藏
const toggleShowHide = function (dom, className) {
	if (dom.classList.contains(className)) {
		dom.classList.remove(className)
	} else {
		dom.classList.add(className)
	}
}
