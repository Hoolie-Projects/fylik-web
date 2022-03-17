import axios, {AxiosError} from "axios";
import {io} from 'socket.io-client'

export function roundNumber(number: number, places: number = 2) {
  return Math.round(number * 10 ** places) / 10 ** places
}

export function nError(error: Error | AxiosError | unknown): {
  error: Error | AxiosError | unknown,
  content: {
    code?: number,
    errorText: string
  }
} {

  // HTTP error (axios)
  if ((error as any).isAxiosError) {
    const _error = error as any
    console.warn(_error.request, _error.response)

    if (!_error.response) return {
      content: {
        errorText: "Can`t connect to server"
      },
      error
    }

    const errorText = _error.response.data.error.message

    return {
      content: {
        errorText
      },
      error
    }
  }

  // Another error
  else {
    // eslint-disable-next-line no-console
    console.error(error)
  }

  // Return error content
  return {
    content: {
      errorText: String(error)
    },
    error
  }
}

export const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

export const socket = io(process.env.REACT_APP_SOCKETIO_URL as string)
socket.on('connect', () => {
  console.info('Connected to socket.io')
})
socket.io.on('error', (error) => nError(error))

export const getSizeByBytes = (bytes: number): string => {

  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return roundNumber(bytes / 1024) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return roundNumber(bytes / 1024 / 1024) + ' MB'

  return 'Unknown'
}
