import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [word, setWord] = useState('World')
  const [inputVal, setInputVal] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const handleInput = (e) => {
    // Only allow a single word (no spaces)
    const val = e.target.value.replace(/\s/g, '')
    setInputVal(val)
    if (val) setWord(val)
    else setWord('World')
  }

  const toggleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      const spoken = e.results[0][0].transcript.trim().split(/\s+/)[0]
      setWord(spoken)
      setInputVal(spoken)
      setListening(false)
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  return (
    <div className="container">
      <div className="card">
        <h1>
          Hello <span className="gradient-word">{word}</span>!
        </h1>

        <div className="controls">
          <input
            type="text"
            placeholder="Type a word…"
            value={inputVal}
            onChange={handleInput}
            className="word-input"
          />
          <button
            onClick={toggleMic}
            className={`mic-btn ${listening ? 'active' : ''}`}
            title={listening ? 'Stop listening' : 'Speak a word'}
          >
            {listening ? '⏹' : '🎤'}
          </button>
        </div>

        {listening && <p className="hint">Listening… say one word</p>}
      </div>
    </div>
  )
}

export default App
