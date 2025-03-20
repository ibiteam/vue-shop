function start () {
    let newImg = document.createElement("img")
    newImg.setAttribute("class", "def-loading")
    newImg.setAttribute("src", "https://cdn.toodudu.com/uploads/2021/03/02/load.gif")
    newImg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:1.2rem;height:1.2rem;z-index:100000000000000"

    document.body.appendChild(newImg)

    if (document.getElementsByClassName('def-mask') && document.getElementsByClassName('def-mask')[0]) {
        return false
    }

    let mask = document.createElement("div")
    mask.setAttribute("class", "def-mask")
    mask.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;z-index:100000000000000"

    document.body.appendChild(mask)

    // document.getElementsByTagName('body')[0].style.cssText = "height: 100%;overflow:hidden;"
}

function close () {
    if (document.getElementsByClassName('def-loading') && document.getElementsByClassName('def-loading')[0]) {
        document.body.removeChild(document.getElementsByClassName('def-loading')[0])
        if (!(document.getElementsByClassName('def-loading') && document.getElementsByClassName('def-loading')[0])) {
            document.body.removeChild(document.getElementsByClassName('def-mask')[0])
            // document.getElementsByTagName('body')[0].style.cssText = "height: auto;overflow:auto;"
        }
    }
}

export default {
    start,
    close
}
