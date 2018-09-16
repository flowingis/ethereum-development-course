import Navigo from 'navigo'
import './counter/counter'
import './peopleList/peopleList'

const router = new Navigo(null, true)

const main = document.querySelector('main')

router
  .on('counter', () => {
    main.innerHTML = '<eth-counter></eth-counter>'
  })
  .on('people-list', () => {
    main.innerHTML = '<eth-people-list></eth-people-list>'
  })
  .notFound(() => {
    console.log('Not Found')
  })
  .resolve()
