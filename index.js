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
	return res
}

// 插入 dom 模板
const insertHtml = function (className, html) {
	let dom = e(className)
	dom.insertAdjacentHTML('beforeend', html)
}

// 数组中的元素，不展开的情况，展示如下：
// (7) ["aa", 123, undefined, null, Array(4), {…}, Array(2)]
const tempCloseHtmlInArray = function (data, type, index, level, key) {
	// 模板字符串内部元素
	let tempHtml = ''
	// 数组 Array(4)
	if (type === 'Array') {
		let arrLen = data.length
		let lenHTML = `
			<div class='childIsArray' data-index='${index}'>
				Array(${arrLen})
			</div>
		`
		tempHtml += lenHTML
	}
	// 字典 {...}
	else if (type === 'Object') {
		let lenHTML = `
			<div class='childIsObject' data-index='${index}'>
				{...}
			</div>
		`
		tempHtml += lenHTML
	}
	// 字符串 红色带双引号
	else if (type === 'String') {
		let html = `
			<div class='red shrink0' data-index='${index}'>
				"${data}"
			</div>
		`
		tempHtml += html
	}
	// 数字 蓝色
	else if (type === 'Number') {
		let html = `
			<div class='blue shrink0' data-index='${index}'>
				${data}
			</div>
		`
		tempHtml += html
	}
	// Undefined || Null 灰色
	else if (type === 'Undefined' || type === 'Null') {
		let html = `
			<div class='gray shrink0' data-index='${index}'>
				${data}
			</div>
		`
		tempHtml += html
	}
	// objectKey 是特殊的类型
	// 数组中的元素有字典，没展开的情况下，字典的 key 都是灰色且不带引号的，展开时是紫色的不带引号的
	else if (type === 'objectKey') {
		let html = `
			<div class='${level === 'isChild' ? 'purple' : 'gray'} shrink0' data-index='${index}'>
				${data}
			</div>
		`
		tempHtml += html
	}

	return tempHtml
}

// 数组中的元素的展开的每一行
// 0: "aa"
// 1: 123
// 2: undefined
// 3: null
// △ 4: (4) ["cc", 22, Array(2), Array(2)]
// △ 5: {123: Array(2), dudu: 345, vxv: Array(4), childObj: {…}}
// △ 6: (2) ["b", 3]
// length: 7
// △ [Prototype]]: Array(0)
const lineHtmlInArray = function (data, type, index, level, key) {
	let auto = ['String', 'Number', 'Undefined', 'Null'] // 常用
	let color = { // 颜色
		'String': 'red',
		'Number': 'blue',
		'Undefined': 'gray',
		'Null': 'gray',
	}
	let tempHtml = ''
	// 数组
	if (type === 'Array') {
		// 数组套数组，索引是 index(4: )，没展开的时候，如下格式：
		// 4: (4) ["cc", 22, Array(2), Array(2)]
		// 数组套字典，字典中 key 对应的 value 是数组的话，索引是 key(arr3: )，如下格式：
		// arr3: (4) ["cc", 22, Array(2), Array(2)]
		// TODO: 这里有个地方是 Array() 后面的空白被当成了 #main，#main 被委托了，会直接把 outBox 直接收起
		let indexHTML = `
			<div class='child-array-open template-array template flexBox zuoYi hideDom' data-index='${index}'>
				<div class='arrow-down'></div>
				<div class='purple'>${level === 'isObjectChild' ? key : index}</div>
				<div class='maoHao mr8'>:</div>
				<div class='text'>Array(${data.length})</div>
			</div>
		`
		tempHtml += indexHTML
		tempHtml += templateHTML(data, type, index, 'isChild')
	}
	// 字典
	else if (type === 'Object') {
		// 没展开的时候 5: {123: Array(2), dudu: 345, vxv: Array(4), childObj: {…}}
		let indexHTML = `
			<div class='child-object-open template-object template flexBox zuoYi hideDom' data-index='${index}'>
				<div class='arrow-down'></div>
				<div class='purple'>${index}</div>
				<div class='maoHao mr8'>:</div>
			</div>
		`
		tempHtml += indexHTML
		tempHtml += templateHTML(data, type, index, 'isChild')
	}
	// 字符串，数字，undefined，null
	else if (auto.includes(type)) {
		let html = `
			<div class='flexBox' data-index='${index}'>
				<div class='purple'>${index}</div>
				<div class='maoHao mr8'>:</div>
				<div class=${color[type]}>${type === 'String' ? '"' : ''}${data}${type === 'String' ? '"' : ''}</div>
			</div>
		`
		tempHtml += html
	}
	// objectKey 是字典的 key，特殊的类型
	// 字典的 key 都是灰色且不带引号的
	else if (type === 'objectKey') {
		let html = `<div class='gray' data-index='${index}'>${data}</div>`
		tempHtml += html
	}

	return tempHtml
}

// 字典中的元素的展开的每一行
const lineHtmlInObject = function (data, type, index) {
	let keyArr = Object.keys(data)
	let key = keyArr[0]
	let value = data[key]
	// typeV 只可能是 Array 或 Object，其他情况在 templateHTML 中直接处理了
	let typeV = getType(value)
	// 右箭头
	let arrowRightHtml = `<div class='arrow-right'></div>`
	// 下箭头
	let arrowDownHtml = `<div class='arrow-down'></div>`
	// 左大括号
	let leftBrace = `<div class='text'>{</div>`
	// 右大括号
	let rightBrace = `<div class='text ml2'>}</div>`
	// 逗号
	let douHao = `<div class='text douHao mr6'>,</div>`
	// 冒号
	let maoHao = `<div class='text maoHao mr10'>:</div>`

	let tempHtml = ''
	// 数组
	if (typeV === 'Array') {
		// 字典的 value 是数组
		// △ array11: (2) [2, "b"]
		tempHtml += `
			<div class='child-array-open template-array template flexBox zuoYi hideDom' data-index='${index}'>
				<div class='arrow-down'></div>
				<div class='purple'>${key}</div>
				<div class='maoHao mr8'>:</div>
				<div class='text'>Array(${data[key].length})</div>
			</div>
		`
		tempHtml += templateHTML(data[key], typeV, index, 'isObjectChild', key)
	}
	// 字典
	else if (typeV === 'Object') {
		// △ lll: {2: "cc", kbc: 123}

		let tempBody = ''
		tempBody += arrowRightHtml
		tempBody += `<div class='purple maoHao mr10'>${key}</div>`
		tempBody += maoHao
		tempBody += templateHTML(data[key], type, index, 'isValue')

		// 展开部分
		let lineHtml = templateHTML(data[key], type, index, 'isLine')

		tempHtml += `
			<div class='child-object-open template-object template flexBox zuoYi hideDom' data-index='${index}'>
				<div class='arrow-down'></div>
				<div class='purple'>${key}</div>
				<div class='maoHao mr8'>:</div>
			</div>
			<div class="child-object-close template flexBox template-object zuoYi2" data-index='${index}'>
				${tempBody}
			</div>
			<div class='template lineBox hideDom ml20' data-lineIndex='${index}'>
				${lineHtml}
			</div>
		`
	}
	return tempHtml
}

// 第一层的
// dom 模板
const templateHTML = function (data, type, index, level, objKey) {
	let auto = ['String', 'Number', 'Undefined', 'Null'] // 常用
	let color = { // 颜色
		'String': 'black',
		'Number': 'blue',
		'Undefined': 'gray',
		'Null': 'gray',
	}
	// 右箭头
	let arrowRightHtml = `<div class='arrow-right'></div>`
	// 下箭头
	let arrowDownHtml = `<div class='arrow-down'></div>`

	// all html
	// △ (4) ["aa", 123, undefined, null]
	let tempHtml = ''

	// 模板字符串内部元素，不展开时
	let tempBody = ''

	// 下面展开的每行
	// 0: "aa"
	// 1: 123
	// 2: undefined
	// 3: null
	// length: 4
	// __proto__: Array(0)
	let lineHtml = ''

	// 拿到 log 先判断这个数据的类型（最外层）
	// 数组
	if (type === 'Array') {
		let arrLen = data.length
		// 数组长度，最外层是数组，长度的字体颜色是黑色的
		let lenHTML = `
			<div class='array-len mr6'>
				(${arrLen})
			</div>
		`
		// 数组长度，数组内部的子元素有数组，长度的字体颜色是灰色的
		let lenHTMLChild = `
			<div class='array-len gray mr6'>
				(${arrLen})
			</div>
		`
		// 左中括号
		let leftBracket = `<div class='text'>[</div>`
		// 右中括号
		let rightBracket = `<div class='text ml2'>]</div>`
		// 逗号
		let douHao = `<div class='text douHao mr10'>,</div>`

		// isValue 代表是最外层的数组子元素有字典，且字典的 key 对应的 value 是数组，所以不能带右箭头，右箭头在字典那处理了
		// 其他情况先带上右箭头，因为要展开
		if (level !== 'isValue') {
			tempBody += arrowRightHtml
		}

		// 如果是数组套数组的子元素
		// △ 4: (3) [2, "b", Array(2)]
		// 处理 index: 4:
		if (level === 'isChild') {
			tempBody += `
				<div class='purple'>${index}</div>
				<div class='maoHao mr8'>:</div>
			`
			tempBody += lenHTMLChild
		}
		// isObjectChild 代表是字典的 key 对应的 value 是数组，格式如下
		// △ vxv: (4) ["cc", 22, Array(2), Array(2)]
		// 处理 key: vxv:
		else if (level === 'isObjectChild') {
			tempBody += `
				<div class='purple'>${objKey}</div>
				<div class='maoHao mr8'>:</div>
			`
			tempBody += lenHTMLChild
		}
		// 这是处理最外层的数组，格式如下：
		// △ (7) ["aa", 123, undefined, null, Array(4), {…}, Array(2)]
		// 在右箭头后面加长度 △ (7)
		else {
			tempBody += lenHTML
		}

		// 加上左中括号
		tempBody += leftBracket

		// 循环处理数组的每个子元素
		for (let i = 0; i < arrLen; i++) {
			let e = data[i]
			let type = getType(e)
			// 数组不展开的情况：
			// ["aa", 123, undefined, null, Array(4), {…}, Array(2)]
			tempBody += tempCloseHtmlInArray(e, type, i, level, objKey)

			// 数组展开的情况：
			// 0: "aa"
			// 1: 123
			// 2: undefined
			// 3: null
			// △ 4: (4) ["cc", 22, Array(2), Array(2)]
			// △ 5: {123: Array(2), dudu: 345, vxv: Array(4), childObj: {…}}
			// △ 6: (2) ["b", 3]
			// length: 7
			// △ [Prototype]]: Array(0)
			if (type === 'Array' && level === 'isObjectChild') {
				level = 'isChild'
			}
			lineHtml += lineHtmlInArray(e, type, i, level, objKey)

			// 数组最后一个元素后面不用加逗号
			if (i !== arrLen-1) {
				tempBody += douHao
			}
		}

		// 加上右中括号
		tempBody += rightBracket

		// length: 4
		let lineLen = `
			<div class='flexBox'>
				<div class='light-purple'>length</div>
				<div class='mr8'>:</div>
				<div class='blue'>${arrLen}</div>
			</div>
		`
		lineHtml += lineLen

		// [[Prototype]]: Array(0)
		let lineProto = `
			<div class='flexBox zuoYi'>
				<div class='arrow-right'></div>
				<div class='purple qingXie1'>[[Prototype]]</div>
				<div class='mr8'>:</div>
				<div class='text'>Array(0)</div>
			</div>
		`
		lineHtml += lineProto

		// 不是最外层
		if (level === 'isChild' || level === 'isObjectChild') {
			tempHtml = `
				<div class="child-array-close template flexBox template-array zuoYi2" data-index='${index}'>
					${tempBody}
				</div>
				<div class='template lineBox hideDom ml20' data-lineIndex='${index}'>
					${lineHtml}
				</div>
			`
		}
		// 处理最外层的
		else {
			let id = getRandomCode()
			tempHtml = `
				<div class="outBox out-close template flexBox qingXie1" data-outBoxId=${id}>
					${tempBody}
				</div>
				<div class='outBox out-open template lineBox hideDom ml30' data-outBoxId=${id}>
					${lineHtml}
				</div>
				<div class='grayLine'></div>
			`
		}
	}
	// 字典
	else if (type === 'Object') {
		// 最外层是字典，格式如下：
		// △ {1: 2, 33: 33, dd: "das", cv: null}
		let keyArr = Object.keys(data)
		let objLen = keyArr.length

		// 左大括号
		let leftBrace = `<div class='text'>{</div>`
		// 右大括号
		let rightBrace = `<div class='text ml2'>}</div>`
		// 逗号
		let douHao = `<div class='text douHao mr6'>,</div>`
		// 冒号
		let maoHao = `<div class='text maoHao mr10'>:</div>`

		// 下面被展开的每行
		// △ 4:
		//     1: 2
		//     2: "cc"
		// △ [[Prototype]]: Object
		let lineHtml = ''

		// 数组第 5 个子元素是 字典 时：
		// 收起的状态：
		// 5: {123: Array(2), dudu: 345, vxv: Array(4), childObj: {…}}
		// 展开的状态：
		// 5:
		// 	△ 123: (2) ["b", 3]
		// 	△ childObj: {son: {…}, bvn: {…}}
		// 	  dudu: 345
		// 	△ vxv: (4) ["cc", 22, Array(2), Array(2)]
		// 	△ [[Prototype]]: Object

		// 如果子元素是字典，且字典内部没有嵌套了，value 是值，不加右箭头，比如 dudu: 345，
		if (level !== 'isValue') {
			tempBody += arrowRightHtml
		}

		// 如果子元素是字典，字典内部有嵌套，value 是数组或者字典，还可以展开，比如： △ childObj: {son: {…}, bvn: {…}}
		if (level === 'isChild') {
			tempBody += `
				<div class='purple'>${index}</div>
				<div class='maoHao mr8'>:</div>
			`
		}

		// 加左大括号
		tempBody += leftBrace

		for (let i = 0; i < objLen; i++) {
			let k = keyArr[i]
			let v = data[k]
			// 字典的 key 样式固定且特殊，写死 'objectKey' 来表示
			// 字典的 key 没展开的情况下，都是灰色且不带引号的，展开时是紫色的不带引号的

			let typeV = getType(v)
			tempBody += tempCloseHtmlInArray(k, 'objectKey')
			tempBody += maoHao
			tempBody += tempCloseHtmlInArray(v, typeV)

			let openLine
			// 字典的 value 如果是 Object 或者 Array，要把 {key: value} 一起传过去
			let objSon = {}
			objSon[k] = v
			if (typeV === 'Object' || typeV === 'Array') {
				openLine = lineHtmlInObject(objSon, typeV, i)
			}
			// 字典的 value 如果是普通（数字，字符串，undefined，null），直接处理就行
			else {
				openLine = `
					<div class='flexBox'>
						${tempCloseHtmlInArray(k, 'objectKey', i, 'isChild')}
						${maoHao}
						${tempCloseHtmlInArray(v, typeV, i, 'isChild')}
			        </div>
				`
			}
			lineHtml += openLine

			// 数组最后一个元素后面不加逗号
			if (i !== objLen-1) {
				tempBody += douHao
			}
		}

		// 加右大括号
		tempBody += rightBrace

		// △ [[Prototype]]: Object
		let lineProto = `
			<div class='flexBox zuoYi2'>
				<div class='arrow-right'></div>
				<div class='purple qingXie1'>[[Prototype]]</div>
				<div class='mr8'>:</div>
				<div class='text'>Object</div>
			</div>
		`
		lineHtml += lineProto

		if (level === 'isChild') {
			tempHtml = `
				<div class="child-object-close template flexBox template-object zuoYi2" data-index='${index}'>
					${tempBody}
				</div>
				<div class='template lineBox hideDom ml20' data-lineIndex='${index}'>
					${lineHtml}
				</div>
			`
		} else if (level === 'isValue') {
			tempHtml = tempBody
		} else if (level === 'isLine') {
			tempHtml = lineHtml
		} else {
			let id = getRandomCode()
			// log('in here, outBox is obj')
			tempHtml = `
				<div class="outBox out-close template flexBox qingXie1" data-outBoxId=${id}>
					${tempBody}
				</div>
				<div class='outBox out-open template lineBox hideDom ml20' data-outBoxId=${id}>
					${lineHtml}
				</div>
				<div class='grayLine'></div>
			`
		}
	}
	// 字符串，数字，Undefined，Null
	else if (auto.includes(type)) {
		let html = `
			<div class='text ${color[type]}'>
				${data}
			</div>
		`
		tempHtml += html
	}

	return tempHtml
}

// dom 的展示和隐藏
const toggleShowHide = function (dom, className) {
	if (dom.classList.contains(className)) {
		dom.classList.remove(className)
	} else {
		dom.classList.add(className)
	}
}

// 绑定点击事件，展开数组和字典
const bindEvent = function (typeName) {
	let className = `.template-${typeName}`
	let doms = es(className)
	for (let i = 0; i < doms.length; i++) {
		let dom = doms[i]
		dom.addEventListener('click', function (event) {
			let openClassName = `child-${typeName}-open`
			let closeClassName = `child-${typeName}-close`
			// 点击 template-array 的子元素
			let target = event.target
			// 找到父元素 template-array
			let tempArr = target.closest(className)
			// 第几个元素
			let index = tempArr.dataset.index
			// template-array 同层级的 lineBox，
			// template-array 被点击后展开子元素的时候要显示
			let openLine = tempArr.parentNode.querySelector('.lineBox')
			// 最外层的直接展开/收起不用判断兄弟元素了
			if (!tempArr.classList.contains('outBox')) {
				// 不是最外层要拿所有的兄弟元素，去判断对应的 index 来展开和隐藏
				let openLines = tempArr.parentNode.children
				for (let i = 0; i < openLines.length; i++) {
					let e = openLines[i]
					// 得找到对应的 index 再展开收起
					// 被展开后这样展示 => 4: Array(4)
					if (e.dataset.index === index && e.classList.contains(openClassName)) {
						toggleShowHide(e, 'hideDom')
					}
					// 被收起后这样展示 => 4: (4) ["cc", 22, Array(2), Array(2)]
					if (e.dataset.index === index && e.classList.contains(closeClassName)) {
						toggleShowHide(e, 'hideDom')
					}
					// 被展开后有子元素要这样展示的子元素 =>
					// 0: "cc"
					// 1: 22
					// 2: (2) ["b", 3]
					// 3: (2) ["zxc", 123]
					// length: 4
					// 	[[Prototype]]: Array(0)
					if (e.dataset.lineindex === index) {
						toggleShowHide(e, 'hideDom')
						break
					}
				}
			}
		})
	}
}

// 绑定最外层事件
// 最外层有多个 outBox 的处理，就是正常情况会 log 多个数据的时候
const bindOutBox = function () {
	let className = `#main`
	let dom = e(className)
	dom.addEventListener('click', function (event) {
		// 点击 template-array 的子元素
		let target = event.target
		// 找到父元素 template-array
		let tempArr
		let isOutBox = target.classList.contains('outBox')
		// 点击的 dom 有 outBox class
		if (isOutBox) {
			tempArr = target
		}
		// 点击的 dom 没有 outBox class, 看父元素有没有
		else {
			let isParentOutBox = target.parentNode.classList.contains('outBox')
			if (isParentOutBox) {
				tempArr = target.parentNode
			}
		}
		if (!tempArr) {
			log('dom 没有 outBox，父元素也没有 outBox')
			return
		}
		// log('*** tempArr:', tempArr)
		// 拿到当前 outBox 的 index(id)
		let index = tempArr.dataset.outboxid
		// 得找到对应的 index 和 out-open, 展开这个 dom
		let openLines = tempArr.parentNode.children
		for (let i = 0; i < openLines.length; i++) {
			let e = openLines[i]
			if (e.dataset.outboxid === index && e.classList.contains('out-open')) {
				toggleShowHide(e, 'hideDom')
				// 已经被展开了，需要把 outBox 换成下箭头
				if (!e.classList.contains('hideDom')) {
					let needChange = tempArr.querySelector('.arrow-right')
					// needChange && needChange.classList.contains('arrow-right') && needChange.classList.remove('arrow-right')
					// needChange && needChange.classList.contains('arrow-down') && needChange.classList.add('arrow-down')

					needChange.classList.remove('arrow-right')
					needChange.classList.add('arrow-down')
				}
				// 收起，需要把 outBox 换回右箭头
				else {
					let needChange = tempArr.querySelector('.arrow-down')
					// needChange && needChange.classList.contains('arrow-down') && needChange.classList.remove('arrow-down')
					// needChange && needChange.classList.contains('arrow-right') && needChange.classList.add('arrow-right')

					needChange.classList.remove('arrow-down')
					needChange.classList.add('arrow-right')
				}
				break
			}
		}
	})
}

// 绑定事件
const bindEvents = function () {
	bindEvent('object')
	bindEvent('array')
	bindOutBox()
}

// 渲染 log
const showLog = function (data) {
	let type = getType(data)
	let html = templateHTML(data, type)
	insertHtml('#main', html)
	log(data)
}

const __main = function () {
    __test()
	bindEvents()
}


__main()
