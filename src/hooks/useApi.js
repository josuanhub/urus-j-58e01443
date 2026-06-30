import { useState, useCallback } from 'react'

const API_BASE    = 'https://www.urusverify.com/v1/client/58e01443-7fee-4e57-8145-21d05986b9b0/api'
const FACTORY_KEY = 'factory2026'

/**
 * fetchApi — cliente HTTP base
 * @param {string} endpoint   - ruta relativa, ej: '/users'
 * @param {RequestInit} options - opciones fetch (method, body, signal, etc.)
 * @returns {Promise<any>}    - JSON parseado o lanza Error
 */
export async function fetchApi(endpoint = '/', options = {}) {
  const url = `${API_BASE}${endpoint}`

  const headers = {
    'Content-Type': 'application/json',
    'x-factory-key': FACTORY_KEY,
    ...options.headers
  }

  const config = {
    ...options,
    headers
  }

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`
    try {
      const errorData = await response.json()
      errorMessage = errorData?.message ?? errorData?.error ?? errorMessage
    } catch (_) {
      // mantiene el mensaje HTTP por defecto
    }
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

/**
 * useApi — hook React para llamadas declarativas
 *
 * const { data, loading, error, request } = useApi()
 * await request('/endpoint', { method: 'POST', body: { foo: 'bar' } })
 */
export function useApi() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchApi(endpoint, options)
      setData(result)
      return result
    } catch (err) {
      setError(err.message ?? 'Error desconocido')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, request, reset }
}