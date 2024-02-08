import pino from 'pino'

const config = {
    serverUrl: process.env.REACT_APP_API_PATH || 'http://localhost:3000',
    env: process.env.NODE_ENV,
    publicUrl: process.env.PUBLIC_URL,
    level: process.env.NEXT_PUBLIC_PINO_LOG_LEVEL || 'info'
}
const send = (level: any, logEvent: { messages: any[] }) => {
    const msg = logEvent.messages[0]
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        type: 'application/json'
    }
}

const pinoConfig = {
    browser: {
        asObject: true,
        serialize: true,
    }
}

//if (config.serverUrl) {
//}

export const logger = pino(pinoConfig)

export default logger
