jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'))

require('react-native-reanimated').setUpTests()

jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null
    },
  },
}))

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (object) => JSON.parse(JSON.stringify(object))
}
