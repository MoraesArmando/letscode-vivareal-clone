import { fetchApi } from './fetch.js'

//CONSULTA A CIDADE
export async function getHouseData(state, city) {
  try {
    const url = `https://private-9e061d-piweb.apiary-mock.com/venda?state=${state}&city=${city}`
    const response = await fetchApi(url)
    const houseObjectData = response.search.result.listings.reduce(
      (acc, item) => {
        let object = []
        object.state = item.listing.address.state
        object.address = `${item.link.data.street}, ${item.link.data.streetNumber}, ${item.listing.address.state} - ${item.listing.address.stateAcronym}`
        object.houseName = item.link.name
        object.mediaUrl = item.medias[0].url
        object.price = item.listing.pricingInfos[0].price
        object.condoFee = item.listing.pricingInfos[0].monthlyCondoFee
        object.type = item.listing.unitTypes[0]
        object.bedrooms = item.listing.bedrooms[0]
        object.houseSize = item.listing.usableAreas[0]
        object.stateAcronym = item.listing.address.stateAcronym
        object.bathroom = item.listing.bathrooms[0]
        object.parking = item.listing.parkingSpaces[0]
        object.amenities = item.listing.amenities
        return [...acc, object]
      },
      []
    )
    return houseObjectData
  } catch (error) {
    displayError(500)
  }
}

export function clearResult(cardsContainer, totalCountContainer) {
  document.querySelector(cardsContainer).innerHTML = ''
  document.querySelector(totalCountContainer).innerHTML = ''
}

export async function buildResult(object) {
  const cityStateObject = await object
  const city = cityStateObject.map(function (e) {
    return e.state
  })
  const state = cityStateObject.map(function (e) {
    return e.stateAcronym
  })
  console.log(city)
  displayPlacesTotalCount(city[0], state[0], cityStateObject.length)

  const cardHouse = document.querySelector('.cardsContainer')
  cityStateObject.map(item => {
    console.log(item)
    const card = document.createElement('article')
    card.append(imageCardFactory(item))
    card.append(cardInfoFactory(item))
    card.append(cardPrice(item))
    card.append(contactButtons(item))
    cardHouse.append(card)
  })
}

export const displayPlacesTotalCount = (city, state, totalCount) => {
  console.log(city, state, totalCount)
  const resultSummary = document.createElement('h1')
  const cityName = city
  resultSummary.innerText = `${totalCount} Imóveis à venda em ${cityName} - ${state.toUpperCase()}`
  document.querySelector('#resultSummaryContainer').append(resultSummary)
}

const imageCardFactory = obj => {
  let imgContainer = document.createElement('div')
  let imgElement = document.createElement('img')
  imgContainer.classList.add('imgHouses')
  imgElement.src = `${obj.mediaUrl}`
  imgContainer.append(imgElement)
  return imgContainer
}

const cardInfoFactory = obj => {
  let divOutContainer = document.createElement('div')
  divOutContainer.append(cardHeaderElement(obj))
  divOutContainer.append(cardDetails(obj))
  divOutContainer.append(cardAmenities(obj))
  divOutContainer.classList.add('infoOutContainer')
  return divOutContainer
}

const cardHeaderElement = obj => {
  let e = document.createElement('div')
  e.classList.add('divHeader')
  e.append(cardAdress(obj))
  e.append(cardName(obj))
  return e
}

const cardAdress = obj => {
  let e = document.createElement('span')
  e.innerText = obj.address
  e.classList.add('addressContainer')
  return e
}

const cardName = obj => {
  let e = document.createElement('span')
  e.innerText = obj.houseName
  e.classList.add('nameContainer')
  return e
}

const cardAmenities = obj => {
  let amenitiesContainer = document.createElement('ul')
  obj.amenities.forEach(item => {
    let amenitiesElement = document.createElement('li')
    let parsedAmenities = amenitesTranslate(item)
    amenitiesElement.append(parsedAmenities)
    amenitiesContainer.append(amenitiesElement)
  })
  amenitiesContainer.classList.add('amenitiesContainer')
  return amenitiesContainer
}

const cardDetails = obj => {
  let perksContainer = document.createElement('ul')
  perksContainer.classList.add('perksContainer')
  perksContainer.innerHTML = `
      <li><span class="perkNumber">${obj.houseSize}</span><span> m² </span></li>    
      <li><span class="perkNumber">${obj.bedrooms}</span><span> Quartos </span></li>    
      <li><span class="perkNumber">${obj.bathroom}</span><span> Banheiros </span></li>    
      <li><span class="perkNumber">${obj.parking}</span><span> Vaga </span></li>    
  `
  return perksContainer
}

const formatNumber = number =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(number)

const cardPrice = obj => {
  let housePrice = document.createElement('div')
  let price = document.createElement('p')
  let formatedPrice = formatNumber(obj.price)
  price.innerText = formatedPrice
  price.classList.add('priceContainer')
  housePrice.append(price)
  housePrice.classList.add('priceBlockContainer')
  if (obj.type === 'APARTMENT' || obj.type === 'CONDOMINIUM') {
    let condo = document.createElement('div')
    condo.classList.add('condoContainer')
    condo.innerHTML = `<span>Condomínio: </span> <span class='perkNumber'> --- </span>`
    if (obj.condoFee)
      condo.innerHTML = `<span>Condomínio: </span> <span class='perkNumber'> ${formatNumber(
        obj.condoFee
      )} </span>`
    housePrice.append(condo)
  }
  return housePrice
}

const contactButtons = obj => {
  let buttonContainer = document.createElement('div')
  let telButton = document.createElement('button')
  let msgButton = document.createElement('button')

  buttonContainer.classList.add('buttonContainer')
  telButton.innerText = 'TELEFONE'
  msgButton.innerText = 'ENVIAR MENSAGEM'
  buttonContainer.append(telButton, msgButton)
  return buttonContainer
}

const amenitesTranslate = item => {
  const amenitesDictionary = {
    PARTY_HALL: 'Salão de Festas',
    FURNISHED: 'Mobiliado',
    FIREPLACE: 'Lareira',
    POOL: 'Piscina',
    BARBECUE_GRILL: 'Churrasqueira',
    AIR_CONDITIONING: 'Ar Condicionado',
    ELEVATOR: 'Elevador',
    BICYCLES_PLACE: 'Bicicletário',
    GATED_COMMUNITY: 'Condomínio Fechado',
    PLAYGROUND: 'Playground',
    SPORTS_COURT: 'Área de Esportes',
    PETS_ALLOWED: 'Animais Permitidos',
    AMERICAN_KITCHEN: 'Cusinha Americana',
    TENNIS_COURT: 'Quadra de Tennis',
    LAUNDRY: 'Lavanderia',
    GYM: 'Academia',
    CINEMA: 'Cinema',
    SAUNA: 'Sauna',
    GARDEN: 'Jardim',
    ELECTRONIC_GATE: 'Portão Elétrico'
  }
  return amenitesDictionary[item]
}

export function displayError(status) {
  clearResult('.cardsContainer', '#resultSummaryContainer')
  const errorElement = buildErrorElement(status)
  document.querySelector('.cardsContainer').append(errorElement)
}

const buildErrorElement = status => {
  const opsElement = document.createElement('h1')
  opsElement.innerText = 'OOOOPS!'
  const wrongSearchElement = document.createElement('h1')
  wrongSearchElement.innerText = 'ALGO DEU ERRADO NA SUA BUSCA.'
  const errorStatusElement = document.createElement('h2')
  errorStatusElement.innerText = `status ${status}`
  const tryAgainElement = document.createElement('h1')
  tryAgainElement.innerText = 'POR FAVOR, TENTE NOVAMENTE.'
  const errorElement = document.createElement('div')
  errorElement.id = 'errorDiv'
  errorElement.append(
    opsElement,
    wrongSearchElement,
    errorStatusElement,
    tryAgainElement
  )
  return errorElement
}
