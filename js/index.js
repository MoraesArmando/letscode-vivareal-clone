import { getHouseData, buildResult, clearResult } from './build.js'

//CIDADE
function formatText(cityText) {
  cityText = cityText.trim()
  cityText = cityText.toLowerCase()
  cityText = cityText.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a')
  cityText = cityText.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e')
  cityText = cityText.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i')
  cityText = cityText.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o')
  cityText = cityText.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u')
  cityText = cityText.replace(new RegExp('[Ç]', 'gi'), 'c')
  cityText = cityText.replace(/\s/g, '-')
  return cityText
}

//ESTADO
function searchStateDicionary(city) {
  const dicionary = {
    'sao-paulo': 'sp',
    sp: 'sp',
    'rio-de-janeiro': 'rj',
    rj: 'rj'
  }
  return dicionary[city]
}

function searchCityDicionary(city) {
  const dicionary = {
    'sao-paulo': 'sao-paulo',
    sp: 'sao-paulo',
    'rio-de-jeneiro': 'rio-de-janeiro',
    rj: 'rio-de-janeiro'
  }
  return dicionary[city]
}

//FUNÇAO CHAMADORA
function searchCity() {
  const textSearcCity = document.querySelector('#property-location').value
  const cityText = formatText(textSearcCity)

  if (cityText != '') {
    clearResult('.cardsContainer', '#resultSummaryContainer')
    const city = searchCityDicionary(cityText)
    const state = searchStateDicionary(cityText)
    const data = getHouseData(state, city)
    buildResult(data)
  } else {
    clearResult('.cardsContainer', '#resultSummaryContainer')
  }
}

document
  .querySelector('#property-location')
  .addEventListener('blur', searchCity)
