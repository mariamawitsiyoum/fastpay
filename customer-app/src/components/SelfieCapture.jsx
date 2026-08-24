import { useRef, useState, useEffect } from 'react'

function SelfieCapture({ onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        setError('Could not access camera. Please allow camera permission.')
      }
    }

    if (!capturedImage) {
      startCamera()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [capturedImage])

  function handleTakePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob)
      setCapturedImage(imageUrl)
      onCapture(blob)
    }, 'image/jpeg')
  }

  function handleRetake() {
    setCapturedImage(null)
    onCapture(null)
  }

  if (error) {
    return <p className="text-red-600 text-sm">{error}</p>
  }

  return (
    <div>
      {!capturedImage && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg bg-slate-800"
          />
          <button
            type="button"
            onClick={handleTakePhoto}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded px-4 py-2 mt-2"
          >
            Take photo
          </button>
        </div>
      )}

      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured selfie" className="w-full rounded-lg" />
          <button
            type="button"
            onClick={handleRetake}
            className="text-sky-600 hover:text-sky-500 text-sm font-medium mt-2"
          >
            Retake photo
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default SelfieCapture