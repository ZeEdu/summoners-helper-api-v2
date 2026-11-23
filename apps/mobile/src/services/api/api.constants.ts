import { Platform } from 'react-native'

const PORT = '3000'
const PROTOCOL = 'http'
const ADDRESS = Platform.OS === 'web' ? 'localhost' : '10.0.2.2'

const LOCAL_API_URL = `${PROTOCOL}://${ADDRESS}:${PORT}/api`

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? LOCAL_API_URL

export const API_CONSTANTS = { API_URL }
