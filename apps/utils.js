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

export const htmlToElement = html => {
  var template = document.createElement('template')
  template.innerHTML = html
  return template.content.firstChild
}
