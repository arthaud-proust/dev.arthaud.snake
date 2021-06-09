module.exports = {
    escape: unsafe=>unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
    ,

    randomColor: ()=>'#'+Array(6).fill(0).map(e=>('0123456789ABCDEF').charAt(Math.floor(Math.random()*16))).join(''),
    randomId: ()=>Array(20).fill(0).map(e=>('0123456789').charAt(Math.floor(Math.random()*10))).join('')
}