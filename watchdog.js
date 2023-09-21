const domStyle = {
    position: "fixed !important",
    top: "0 !important",
    right: "0 !important",
    bottom: "0 !important",
    left: " 0 !important",
    width: "100vw !important",
    height: "100vh !important",
    "z-index": "10000 !important",
    "pointer-events": "none !important",
    "background-color": " transparent !important",
    opacity: "1 !important",
    "-webkit-transform": "none !important",
    "-moz-transform": "none !important",
    "-ms-transform": "none !important",
    transform: "none !important",
    visibility: "visible !important",
    display: "block !important",
    fill: "rgba(0,0,0,0.1) !important",
    clip: "auto !important",
    filter: "none !important",
    zoom: "1 !important",
    "font-size": "14px !important",
    "user-select": "none !important"
}

const dealStyle = function(obj) {
    let str = ""
    for (const key in obj) {
        const value = obj[key]
        str += `${key}: ${value};`
    }
    return str
}

//
// canvas方法
//

// pointer-events应用于普通dom时不兼容ie10 ，放弃canvas方法，将来放弃ie10的时候可以启用该方案
// const clearCanvas = () => {
//     let cas = document.querySelectorAll("body > canvas")
//     for (let i = 0; i < cas.length; i++) {
//         cas[i].remove()
//     }
// }
// const draw = (ct, waterMark) => {
//     const timestamp = formatDate(new Date().getTime())
//     const w = 350
//     const h = 200
//     ct.rotate((-20 * Math.PI) / 180)
//     ct.translate(-250, 0)
//     ct.font = "italic 20px Arial"
//     ct.fillStyle = "rgba(0,0,0,0.15)"
//     for (let i = 0; i < 2000; i += w) {
//         for (let j = 0; j < 2000; j += h) {
//             ct.fillText(waterMark, i, j)
//             ct.fillText(timestamp, i, j + 40)
//         }
//     }
// }
// const creatCanvas = (waterMark) => {
//     let canvas = document.createElement("canvas")
//     canvas.width = window.innerWidth
//     canvas.height = window.innerHeight
//     canvas.setAttribute("style", domStyle)

//     let ct = canvas.getContext("2d")
//     draw(ct, waterMark)
//     clearCanvas()
//     document.body.appendChild(canvas)
// }

//
// svg方法
//

export const clearSvg = () => {
    const _svg = document.querySelector("#watchdogSvg")
    if (_svg) {
        _svg.removeEventListener("DOMNodeRemoved", dealDebug)
        document.body.removeChild(_svg)
    }
}

let message = ""

const creatSvg = () => {
    clearSvg()
    const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const elT = document.createElementNS("http://www.w3.org/2000/svg", "text")

    _svg.setAttribute("style", dealStyle(domStyle))
    _svg.setAttribute("id", "watchdogSvg")

    const w = 350
    const h = 200
    const winW = window.innerWidth
    const winH = window.innerHeight

    for (let i = 0; i < Math.floor(winW * 1.14); i += w) {
        for (let j = 20; j < Math.floor(winW * 1.14); j += h) {
            const elSpan = document.createElementNS("http://www.w3.org/2000/svg", "tspan")
            const elSpan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan")

            elSpan.setAttribute("x", i)
            elSpan.setAttribute("y", j)
            elSpan.setAttribute("style", dealStyle(domStyle))
            elSpan.textContent = message
            elSpan2.setAttribute("x", i)
            elSpan2.setAttribute("y", j + 40)
            elSpan2.setAttribute(
                "style",
                dealStyle({
                    ...domStyle,
                    fill: "rgba(0,0,0,0.01) !important"
                })
            )
            elSpan2.textContent = "北京xxxx科技有限公司"
            elT.appendChild(elSpan)
            elT.appendChild(elSpan2)
        }
    }

    const textStyle = {
        ...domStyle,
        "-webkit-transform": `rotate(-30deg) translate(-${Math.floor((winH / 5) * 3)}px,0) !important`,
        "-moz-transform": `rotate(-30deg) translate(-${Math.floor((winH / 5) * 3)}px,0) !important`,
        "-ms-transform": `rotate(-30deg) translate(-${Math.floor((winH / 5) * 3)}px,0) !important`,
        transform: `rotate(-30deg) translate(-${Math.floor((winH / 5) * 3)}px,0) !important`
    }
    elT.setAttribute("x", "0")
    elT.setAttribute("y", "0")
    elT.setAttribute("transform", `rotate(-30) translate(-${Math.floor((winH / 5) * 3)} 0)`)
    elT.setAttribute("style", dealStyle(textStyle))
    _svg.appendChild(elT)
    document.body.appendChild(_svg)
}

//
// 防调试
//

const dealDebug = () => {
    // window.location.href = "/errorPage.html"
    draw(message)
}

export const draw = (waterMark) => {
    message = waterMark
    creatSvg()

    // {
    //     //
    //     // 禁止打开控制台方式（次要手段，容易破解）
    //     //
    //     console.clear()

    //     // 方法一、  监听宽度方式
    //     if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
    //         // 如果打开控制台导致内外大小不同时，则认为是打开控制台
    //         dealDebug()
    //     }
    //     // 方法二、  chrome、ie
    //     let element = new Image()
    //     Object.defineProperty(element, "id", {
    //         get: function() {
    //             dealDebug()
    //             return false
    //         }
    //     })
    //     console.info(element)
    //     // 方法三、  firefox（只在首次打开控制台有效）
    //     let str1 = `(function() {
    //         // 创建一个对象
    //         let foo1 = /./
    //         // 将其打印到控制台上，实际上是一个指针
    //         console.info(foo1)
    //         // 要在第一次打印完之后再重写toString方法
    //         foo1.toString = function() {
    //             dealDebug()
    //             return false
    //         }
    //     })()`
    //     eval(str1)
    //     // 方法四、  debug陷阱（防止加载页面前打开控制台）
    //     let str2 = `(function() {
    //         var startTime = new Date()
    //         debugger
    //         if (new Date() - startTime > 10) {
    //             dealDebug()
    //         }
    //     })()`
    //     eval(str2)
    // }

    //
    // 禁止修改dom（主要手段）
    //
    const watchdogSvg = document.querySelector("#watchdogSvg")
    // 方法一、mutation event方法
    // watchdogSvg.addEventListener("DOMNodeRemoved", dealDebug)
    // 方法二、mutationObserver方法
    const config = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
    }
    const callback = function() {
        dealDebug()
    }
    const observer = new MutationObserver(callback)
    observer.observe(watchdogSvg, config)
}
