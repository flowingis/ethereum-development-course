import Navigo from 'navigo'
const router = new Navigo(null, true)

const main = document.querySelector('main')

router
  .on('counter', async () => {
    await import('./counter/counter')
    await window.customElements.whenDefined('eth-counter')
    main.innerHTML = '<eth-counter></eth-counter>'
  })
  .on('people-list', async () => {
    await import('./peopleList/peopleList')
    await window.customElements.whenDefined('eth-people-list')
    main.innerHTML = '<eth-people-list></eth-people-list>'
  })
  .on('company', async () => {
    await import('./company/company')
    await window.customElements.whenDefined('eth-company')
    main.innerHTML = '<eth-company></eth-company>'
  })
  .on('simple-token', async () => {
    await import('./simpleToken/simpleToken')
    await window.customElements.whenDefined('eth-simple-coin')
    main.innerHTML = '<eth-simple-coin></eth-simple-coin>'
  })
  .on('tutorial-token', async () => {
    await import('./token/token')
    await window.customElements.whenDefined('eth-token')
    main.innerHTML = '<eth-token></eth-token>'
  })
  .on('ito', async () => {
    await import('./ito/ito')
    await window.customElements.whenDefined('eth-ito')
    main.innerHTML = '<eth-ito></eth-ito>'
  })
  .notFound(() => {
    console.log('Not Found')
  })
  .resolve()
