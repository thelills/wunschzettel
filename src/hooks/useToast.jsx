import { useState, useCallback, useRef } from 'react'

export function useToast() {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef(null)

  const toast = useCallback((message) => {
    setMsg(message)
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2800)
  }, [])

  const ToastEl = <div className={`toast${visible ? ' show' : ''}`}>{msg}</div>
  return { toast, ToastEl }
}
