import { Modal } from 'bootstrap'
import Cropper from 'cropperjs'

/**
 * Initialize profile picture upload + cropper
 */
export function initProfilePictureUpload(root = document) {
  const inputs = root.querySelectorAll(
    'input[type="file"][cstmtag-profile-picture-upload-input]'
  )

  if (!inputs.length) return

  inputs.forEach((input) => {
    // Prevent double init
    if (input.dataset.profileUploadInit) return
    input.dataset.profileUploadInit = 'true'

    // --- Config ---
    const MAX_FILE_MB = 5
    const ALLOWED_TYPES = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/avif',
    ]

    // --- DOM Elements ---
    const cropModalEl = document.getElementById('cropModal')
    // Ensure modal exists before proceeding
    if (!cropModalEl) return 

    const cropModal = new Modal(cropModalEl)
    const cropperImage = document.getElementById('cropperImage')
    const btnSaveCrop = document.getElementById('btnSaveCrop')
    const btnCancelCrop = document.getElementById('btnCancelCrop')
    const zoomRange = document.getElementById('zoomRange')
    
    // Preview Image on the main form
    const profileBox = input.closest('.d-flex')?.querySelector('[cstmtag-profile-picture]')
    const profilePreviewImg = profileBox?.querySelector('img')

    let cropper = null
    let originalFile = null

    // --- 1. File Selection Handler ---
    input.addEventListener('change', () => {
      // Check if this change event was triggered by our own script
      if (input.dataset.internalUpdate === 'true') {
        delete input.dataset.internalUpdate
        return
      }

      const file = input.files?.[0]
      if (!file) return

      // Validate Type
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert('Invalid image type. Please use JPG, PNG, WEBP or AVIF.')
        input.value = ''
        return
      }

      // Validate Size
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        alert(`Max file size is ${MAX_FILE_MB} MB`)
        input.value = ''
        return
      }

      // Load into Cropper
      const reader = new FileReader()
      reader.onload = (e) => {
        cropperImage.src = e.target.result
        originalFile = file
        cropModal.show()
      }
      reader.readAsDataURL(file)
    })

    // --- 2. Cropper Lifecycle ---
    cropModalEl.addEventListener('shown.bs.modal', () => {
      if (cropper) cropper.destroy()

      cropper = new Cropper(cropperImage, {
        aspectRatio: 1, // Force Square
        viewMode: 1,    // Restrict crop box to canvas
        dragMode: 'move',
        autoCropArea: 1,
        responsive: true, // Add this
        restore: false,   // Prevents layout shifts on resize
        zoomable: true,
        background: true,
        ready() {
          if(zoomRange) zoomRange.value = 1
        },
        zoom(e) {
          if(zoomRange) zoomRange.value = e.detail.ratio
        },
      })
    })

    cropModalEl.addEventListener('hidden.bs.modal', () => {
      cropper?.destroy()
      cropper = null
      cropperImage.src = ''
      if(zoomRange) zoomRange.value = 1
      
      // If user closed modal without saving, clear the input so they can re-select
      if (!input.dataset.internalUpdate) {
        input.value = ''
      }
    })

    if(zoomRange) {
        zoomRange.addEventListener('input', (e) => {
          cropper?.zoomTo(parseFloat(e.target.value))
        })
    }

    btnCancelCrop?.addEventListener('click', () => {
      cropModal.hide()
    })

    // --- 3. Save Crop & Update Input ---
    btnSaveCrop?.addEventListener('click', () => {
      if (!cropper || !originalFile) return

      // Get Blob from Cropper
      cropper.getCroppedCanvas({
        width: 1024,
        height: 1024,
        imageSmoothingQuality: 'high',
      }).toBlob((blob) => {
        if (!blob) return

        // Create a new File object
        const newFile = new File([blob], originalFile.name, {
          type: 'image/jpeg',
          lastModified: new Date().getTime(),
        })

        // Use DataTransfer to simulate a file drop
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(newFile)

        // Update the input
        input.dataset.internalUpdate = 'true' // Set flag to ignore next 'change' event
        input.files = dataTransfer.files

        // Update visual preview
        if (profilePreviewImg) {
          profilePreviewImg.src = URL.createObjectURL(blob)
        }

        cropModal.hide()
      }, 'image/jpeg', 0.9)
    })
  })
}

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
  initProfilePictureUpload()
})