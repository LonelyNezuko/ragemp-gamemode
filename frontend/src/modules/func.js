import $ from 'jquery'

const func = {}

func.random = (min, max) =>
{
    if(min === 0 && max === 0)return 0

    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
func.randomFloat = (min, max) =>
{
    return Math.random() * (max - min) + min;
}

func.rgbToHex = (r, g, b) =>
{
    function componentToHex(c)
    {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
func.hexToRgb = (hex) =>
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

func.split = (text, element) =>
{
    const letters = text.split('').map((letter, i) => {
        $(element).append('<span></span>')

        $(element).find('span:last-child').text(letter !== ' ' ? letter : ' ')
        $(element).find('span:last-child').css('opacity', '0')
        
        return $(element).find('span:last-child')
    })

    $(element).empty()
    $(element).append(...letters)

    let count = 1
    const timer = setInterval(() => {
        $(element).find(`span:nth-child(${count})`).css('opacity', '1')
        count ++
    }, 60)
    setTimeout(() => {
        clearInterval(timer)
    }, 60 * $(element).find(`span`).length)

    return false
}

func.validateEmail = email => {
    const re = /\S+@\S+\.\S+/
    if(!re.test(email))return false

    const m = email.substr(0, email.indexOf('@'))
    if(m.length < 4)return false

    return true
}

func.sliceZero = text => {
    return ('0' + text).slice(-2)
}


func.formatPhoneNumber = number => {
    number = number.toString()

    if(number.indexOf('911') === 0)return '911-' + number.substr(3, number.length)
    else if(number.indexOf('11') === 0)return '11-' + number.substr(2, number.length)
    else if(number.indexOf(215) === 0)return '2-15-' + number.substr(3, 3) + '-' + number.substr(6, number.length)
    else if(number.indexOf(61) === 0)return '61-' + number.substr(2, 3) + '-' + number.substr(5, 3) + '-' + number.substr(8, number.length)
    else if(number.indexOf(9) === 0)return '9-' + number.substr(1, number.length)

    return number
}


func.getTimeName = (time, length = false) => {
    if(time >= 0 && time < 60)return time + ' ' + (!length ? 'секунд' : 'сек')
    if(time >= 60 && time < 3600)return time / 60 + ' ' + (!length ? 'минут' : 'мин')
    if(time >= 3600 && time < 86400)return time / 3600 + ' ' + (!length ? 'часов' : 'час')
    if(time >= 86400 && time < 2592000)return time / 86400 + ' ' + (!length ? 'дней' : 'дней')
    if(time >= 2592000 && time < 31104000)return time / 2592000 + ' ' + (!length ? 'месяцев' : 'мес')

    return (!length ? 'больше года' : 'бол. года')
}

export default func