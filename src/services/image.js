// Client-side resize + compress before a photo ever reaches storage — mirrors
// spec FR-PRJ-03 ("photos are resized to 1800px max and compressed to JPEG").
export function resizeImage(file, { maxDim = 1800, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not read image'))
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve({
          dataUrl: canvas.toDataURL('image/jpeg', quality),
          width,
          height,
        })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
