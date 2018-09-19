import Navigo from 'navigo'
import './counter/counter'
import './peopleList/peopleList'
import './company/company'

const router = new Navigo(null, true)

const main = document.querySelector('main')

router
  .on('counter', () => {
    main.innerHTML = '<eth-counter></eth-counter>'
  })
  .on('people-list', () => {
    main.innerHTML = '<eth-people-list></eth-people-list>'
  })
  .on('company', () => {
    main.innerHTML = '<eth-company></eth-company>'
  })
  .notFound(() => {
    console.log('Not Found')
  })
  .resolve()
