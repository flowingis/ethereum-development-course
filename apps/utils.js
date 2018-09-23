import Web3 from 'web3'

export const web3ProviderFix = LoggableCounter => {
  if (typeof LoggableCounter.currentProvider.sendAsync !== 'function') {
    LoggableCounter.currentProvider.sendAsync = function () {
      return LoggableCounter.currentProvider.send.apply(
        LoggableCounter.currentProvider,
        arguments
      )
    }
  }
}

export const initWeb3 = (useMetaMask = USE_METAMASK, url = 'ws://127.0.0.1:8545') => {
  if (useMetaMask && typeof web3 !== 'undefined') {
    return new Web3(web3.currentProvider)
  }

  return new Web3(new Web3.providers.WebsocketProvider(url))
}

export const htmlToElement = html => {
  var template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}
