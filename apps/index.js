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
  .notFound(() => {
    console.log('Not Found')
  })
  .resolve()
