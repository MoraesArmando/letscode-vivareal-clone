async function fetchImmobile(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
    })
    return response.json()
  } catch {
    console.log(Error)
  }
}

function searchState(nameCity) {
  const cityState = [
    {
      SP: ['São Paulo'],
      RJ: ['Rio de Janeiro']
    }
  ]
  const stateAbbreviate = Object.keys(cityState[0])
  const stateName = stateAbbreviate.find(state => {
    const hereState = cityState[0][state].indexOf(nameCity)
    if (hereState >= 0) {
      return state
    }
  })
  return [stateName, stateName.toLowerCase()]
}

function filterCity(cityIn) {
  cityIn = cityIn.trim()
  cityIn = cityIn.toLowerCase()
  cityIn = cityIn.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a')
  cityIn = cityIn.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e')
  cityIn = cityIn.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i')
  cityIn = cityIn.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o')
  cityIn = cityIn.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u')
  cityIn = cityIn.replace(new RegExp('[Ç]', 'gi'), 'c')

  if (cityIn === 'sao paulo' || cityIn === 'sp') {
    return ['sao-paulo', 'São Paulo']
  }

  if (cityIn === 'rio de janeiro' || cityIn === 'rj') {
    return ['rio-de-janeiro', 'Rio de Janeiro']
  }
}

function createElementeUpMain(main, nameState, nameCity) {
  const divContainer = document.createElement('div')
  divContainer.classList.add('container-upper')
  const paragraphUpper = document.createElement('p')
  paragraphUpper.innerHTML = `Viva Real &middot; Venda  &middot;  ${nameState}  &middot;  Imóveis à venda em ${nameCity}`
  divContainer.append(paragraphUpper)
  main.prepend(divContainer)
}

function createElementeLocate(containerLocate, nameCity, nameState) {
  const button = document.createElement('button')
  button.classList.add('button-lower-locate')
  const text = `${nameCity} - ${nameState} `
  const span = document.createElement('span')
  span.innerText = 'x'
  button.append(text, span)
  containerLocate.append(button)
}

function createElementNav(navRightSide, nameCity, nameState, totalCount) {
  const divContainerRightSide = document.createElement('div')
  divContainerRightSide.classList.add('container-lower-nav')

  const span = document.createElement('span')
  span.innerText = `${totalCount}`

  const text = ` Imóveis a venda em ${nameCity} - ${nameState}`
  const paragraph = document.createElement('p')

  const button = document.createElement('button')
  button.innerText = `${nameCity} - ${nameState}`

  const spanButton = document.createElement('span')
  spanButton.innerText = 'x'

  paragraph.append(span, text)
  button.append(spanButton)
  divContainerRightSide.append(paragraph, button)
  navRightSide.append(divContainerRightSide)
}

function renderData(dataHome, rightSide) {
  dataHome.forEach(home => {
    const address = `${home['link']['data']['street']}, ${home['link']['data']['streetNumber']} - ${home['link']['data']['neighborhood']}, ${home['link']['data']['city']} - ${home['listing']['address']['stateAcronym']}`
    const title = home['link']['name']
    const urlImg = home['medias'][0]['url']
    const price = home['listing']['pricingInfos'][0]['price']
    const typeHome = home['listing']['unitTypes'][0]

    let condominioFree = '-'
    if (
      Object.keys(home['listing']['pricingInfos'][0]).indexOf(
        'monthlyCondoFee'
      ) >= 0
    ) {
      condominioFree = home['listing']['pricingInfos'][0]['monthlyCondoFee']
    }

    const divCard = document.createElement('div')
    divCard.classList.add('container-card')
    rightSide.append(divCard)

    const img = document.createElement('img')
    img.src = urlImg
    divCard.append(img)

    const divInfo = document.createElement('div')
    divInfo.classList.add('container-card-info')

    const divInfoAmenities = document.createElement('div')
    divInfoAmenities.classList.add('container-card-info-upper')
    divInfo.append(divInfoAmenities)

    const paragraphLocate = document.createElement('p')
    paragraphLocate.classList.add('paragraph-locate')
    paragraphLocate.innerText = address
    const paragraphTitle = document.createElement('p')
    paragraphTitle.classList.add('paragraph-title')
    paragraphTitle.innerText = title

    divInfoAmenities.append(paragraphLocate, paragraphTitle)

    const detailsHome1 = [
      'usableAreas',
      'bedrooms',
      'bathrooms',
      'parkingSpaces'
    ]
    renderDetailsHome(home, detailsHome1, divInfo, divInfoAmenities)

    const detailsHome2 = home['listing']['amenities']
    if (detailsHome2.length) {
      amenitiesTranslator(detailsHome2, divInfo, divInfoAmenities)
    }
    divCard.append(divInfo)
    const divInfo2 = document.createElement('div')
    divInfo2.classList.add('container-card-info-price')

    const divPrice = document.createElement('div')
    const paragraphPrice = document.createElement('p')
    paragraphPrice.classList.add('paragraph-price')
    paragraphPrice.innerText = `R$ ${price}`
    divPrice.append(paragraphPrice)

    if (typeHome === 'APARTMENT') {
      const paragraphCondoFee = document.createElement('p')
      paragraphCondoFee.classList.add('paragraph-condo-fee')
      const spanCondeFee = document.createElement('span')
      spanCondeFee.innerText = `R$ ${condominioFree}`
      paragraphCondoFee.append('Condomínio: ', spanCondeFee)
      divPrice.append(paragraphCondoFee)
    }

    const divButton = document.createElement('div')
    divButton.classList.add('div-button')
    const buttonTel = document.createElement('button')
    buttonTel.innerText = 'TELEFONE'
    buttonTel.classList.add('button-tel-msg')
    const buttonMsg = document.createElement('button')
    buttonMsg.innerText = 'ENVIAR MENSAGEM'
    buttonMsg.classList.add('button-tel-msg')
    divButton.append(buttonTel, buttonMsg)
    buttonTel.style.display = 'none'
    buttonMsg.style.display = 'none'
    divInfo2.append(divPrice, divButton)
    divInfo.append(divInfo2)

    rightSide.append(divCard)

    divCard.addEventListener('mouseover', function onMouseOver() {
      buttonMsg.style.display = 'inline'
      buttonTel.style.display = 'inline'
    })

    divCard.addEventListener('mouseout', function onMouseOut() {
      buttonMsg.style.display = 'none'
      buttonTel.style.display = 'none'
    })
  })
}

async function getCity(evt) {
  const cityIn = evt.target.value
  const [nameCityQuery, nameCity] = await filterCity(cityIn)
  const [nameState, nameStateQuery] = await searchState(nameCity)
  const url = `https://private-9e061d-piweb.apiary-mock.com/venda?state=${nameStateQuery}&city=${nameCityQuery}`
  const dataSearch = await fetchImmobile(url)
  const totalCount = dataSearch['search']['totalCount']
  const dataHome = dataSearch['search']['result']['listings']
  createElementeUpMain(main, nameState, nameCity)
  createElementeLocate(containerLocate, nameCity, nameState)
  createElementNav(navRightSide, nameCity, nameState, totalCount)
  renderData(dataHome, rightSide)
}

function renderDetailsHome(home, detailsHome, divInfo, divInfoAmenities) {
  const ul = document.createElement('ul')
  ul.classList.add('list1')
  detailsHome.forEach(item => {
    const li = document.createElement('li')
    const span = document.createElement('span')
    const property = home['listing'][item][0]
    let quant = 0
    switch (item) {
      case 'usableAreas':
        li.innerHTML = `<span> ${property} </span> m&sup2 `
        break
      case 'bedrooms':
        quant = property > 1 ? 'Quartos' : 'Quarto'
        span.innerText = `${property} `
        li.append(span, `${quant}`)
        break
      case 'bathrooms':
        quant = property > 1 ? 'Banheiros' : 'Banheiro'
        span.innerText = `${property} `
        li.append(span, `${quant}`)
        break
      case 'parkingSpaces':
        quant = property > 1 ? 'Vagas' : 'Vaga'
        span.innerText = `${property} `
        li.append(span, `${quant}`)
        break
    }
    ul.appendChild(li)
    divInfoAmenities.appendChild(ul)
    divInfo.append(divInfoAmenities)
  })
}

function amenitiesTranslator(infoHome, divInfo, divInfoAmenities) {
  const ul = document.createElement('ul')
  ul.classList.add('listAmenities')
  infoHome.forEach(item => {
    const li = document.createElement('li')
    switch (item) {
      case 'PARTY_HALL':
        li.innerText = 'São de festa'
        break
      case 'ELEVATOR':
        li.innerText = 'Elevador'
        break
      case 'GATED_COMMUNITY':
        li.innerText = 'Condimínio fechado'
        break
      case 'BARBECUE_GRILL':
        li.innerText = 'Grelha de churrasco'
        break
      case 'GYM':
        li.innerText = 'Acadêmia'
        break
      case 'TENNIS_COURT':
        li.innerText = 'Quadra de tênis'
        break
      case 'LAUNDRY':
        li.innerText = 'Lavanderia'
        break
      case 'FURNISHED':
        li.innerText = 'Mobiliado'
        break
      case 'FIREPLACE':
        li.innerText = 'Lareira'
        break
      case 'POOL':
        li.innerText = 'Piscina'
        break
      case 'BICYCLES_PLACE':
        li.innerText = 'Bicicletário'
        break
      case 'AIR_CONDITIONING':
        li.innerText = 'Ar condicionário'
        break
      case 'PLAYGROUND':
        li.innerText = 'Parque infantil'
        break
      case 'SPORTS_COURT':
        li.innerText = 'Quadra de esportes'
        break
      case 'PETS_ALLOWED':
        li.innerText = 'Permite animais'
        break
      case 'AMERICAN_KITCHEN':
        li.innerText = 'Cozinha americana'
        break
      case 'ELECTRONIC_GATE':
        li.innerText = 'Portão eletrônico'
        break
      case 'CINEMA':
        li.innerText = 'Cinema'
        break
      case 'GARDEN':
        li.innerText = 'Jardim'
        break
      case 'SAUNA':
        li.innerText = 'Sauna'
        break
    }
    ul.appendChild(li)
    divInfoAmenities.appendChild(ul)
    divInfo.append(divInfoAmenities)
  })
}

const locate = document.querySelector('.input-locate')
const headerElement = document.querySelector('header')
const main = document.querySelector('main')
const containerLocate = document.querySelector('.container-locate')
const rightSide = document.querySelector('.right-side')
const navRightSide = document.querySelector('.nav-right-side')

function init() {
  locate.addEventListener('focusout', getCity)
}
init()
