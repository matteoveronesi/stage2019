module.exports.keygen = () =>{
    var n = new Date().valueOf().toString()
    var r = ''
    var p = 0
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!£%&()=?^*+-_.:,;<>°§@#[]{}ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûü'
    for (var i = 64; i > 0; --i) {
        r += ((i & 1) && n.charAt(p) ? n.charAt(p) : chars[Math.floor(Math.random() * chars.length)])
        if(i & 1) ++p
    }
    return r
}