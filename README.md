# x-console

原生 JavaScript 实现的一个无依赖、轻量化的 console.log

![示例图片](https://github.com/Imagine-ClaptonXu/x-console/raw/master/example.png)

### 部分测试用例
```javascript
const d0 = {
    key: 'value',
    123: 123,
}
const d1 = {
    2: 'a', // 数字k，字符串v
    'b': 2, // 字符串k，数字v
    3: null,
    '123': 'ddd',
    null: 1,
    '中文': '中文',
    'boolean': true,
}
const testData1 = {d0, ...d1, 1: d0}


const testData2 = [
    {
        "data": [1, 2, 3, {
            testBool: true,
        }],
        "code": 0,
        "message": null,

    },
    '{"data":[1,2,3],"code":0,"message":null}',
]
```
