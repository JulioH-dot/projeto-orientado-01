import "./css/index.css"
import IMask from "imask"


const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type){
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard:["#DF6F29", "#C69347"],
        default:["black", "gray"],
    }
    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src",`cc-${type}.svg` )
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityPattern = {
    mask: '0000'
}
const securityCodeMasked = IMask(securityCode, securityPattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: 'MM{/}YY',
    blocks:{
        YY:{
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
        MM:{
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        },
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)


const carNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask:[
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardType: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            cardType: "default",
        },
    ],
    dispatch: function(appended, dinamicMasked){
        const number = (dinamicMasked.value + appended).replace(/\D/g, "")
        const foundMask = dinamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        })
        return foundMask
    },
}
const cardNumberMasked = IMask(carNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () =>{
    alert("Cartão Adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () =>{
    const ccHolder = document.querySelector(".cc-holder .value")
    ccHolder.innerText = cardHolder.value.length === 0 ? "Fulano Das Silva" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
    const ccSecurityCode = document.querySelector(".cc-security .value")
    ccSecurityCode.innerText = code.length ===0 ? "123" : code
}

cardNumberMasked.on("accept", () =>{
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number){
    const ccNumber = document.querySelector(".cc-number")

    ccNumber.innerText= number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () =>{
    updateExpirationDate(expirationDateMasked.value)
})
function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "01/32" : date
}