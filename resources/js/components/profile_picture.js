import { Modal } from 'bootstrap';
import Cropper from 'cropperjs';

document.addEventListener("DOMContentLoaded", async () => {
    // -- Elements --
    const containers = document.querySelectorAll('[cstmtag-profile-picture]');
    if (!containers) return;
    
    // Preview Modal
    const previewModalEl = document.getElementById('imagePreviewModal');
    const previewModal = new Modal(previewModalEl);
    const modalContainer = document.getElementById('modalProfileContainer');
    const modalImg = document.getElementById('modalImage');
    const modalInitials = document.getElementById('modalInitials');
    const modalLoading = document.getElementById('modalLoading');
    const fileInput = document.getElementById('fileInput');
    const modalUploadHint = document.getElementById('modalUploadHint');

    // Crop Modal
    const cropModalEl = document.getElementById('cropModal');
    const cropModal = new Modal(cropModalEl);
    const cropperImage = document.getElementById('cropperImage');
    const btnSaveCrop = document.getElementById('btnSaveCrop');
    const btnCancelCrop = document.getElementById('btnCancelCrop');
    const zoomRange = document.getElementById('zoomRange');

    // Error Modal
    const errorModalEl = document.getElementById('errorModal');
    const errorModal = new Modal(errorModalEl);
    const errorMessageEl = document.getElementById('errorMessage');

    // -- State --
    let activeProfileBox = null;
    let cropper = null;
    
    // -- Config --
    const MAX_FILE_MB = 10;
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];

    // -- Helpers --
    const setVisibility = (element, isVisible, displayClass = 'd-block') => {
        if (!element) return;
        if (isVisible) {
            element.classList.remove('d-none');
            if (displayClass && displayClass !== 'd-block') element.classList.add(displayClass);
        } else {
            element.classList.add('d-none');
            if (displayClass && displayClass !== 'd-block') element.classList.remove(displayClass);
        }
    };

    const setPreviewLoading = (isLoading) => setVisibility(modalLoading, isLoading, 'd-flex');

    const showError = (message) => {
        errorMessageEl.textContent = message;
        errorModal.show();
    };

    // Helper: Check if the active box allows uploading
    const isEditable = () => {
        return activeProfileBox && activeProfileBox.hasAttribute('cstm-data-profile-picture-upload-endpoint');
    };

    // -- Initialization --
    containers.forEach(container => {
        const char = container.getAttribute('cstm-data-no-img-char') || "??";
        const img = container.querySelector('img');

        // Dynamic BG color
        let hash = 0;
        for (let i=0;i<char.length;i++){hash=char.charCodeAt(i)+((hash<<5)-hash);}
        container.dataset.bgColor = `hsl(${Math.abs(hash % 360)}, 65%, 40%)`;

        // Loader
        const loader = document.createElement('div');
        loader.className = 'profile-loading-overlay';
        loader.innerHTML = '<div class="spinner-border spinner-border-sm text-secondary" role="status"></div>';
        container.appendChild(loader);

        const removeLoader = () => {
            if(loader.parentNode){
                loader.style.opacity = '0';
                setTimeout(() => { if(loader.parentNode) loader.remove(); }, 300);
            }
        };
        setTimeout(removeLoader, 5000);

        const renderPlaceholder = () => {
            removeLoader();
            if(img) setVisibility(img, false);
            container.style.backgroundColor = container.dataset.bgColor;
            
            let span = container.querySelector('.profile-initials');
            if(!span){
                span = document.createElement('span');
                span.className = 'profile-initials';
                span.innerText = char;
                container.appendChild(span);
            } else {
                setVisibility(span, true, 'd-flex');
            }
        };

        if(img){
            img.onerror = renderPlaceholder;
            img.onload = removeLoader;
            // Immediate check in case image is cached
            if(img.complete){
                if(img.naturalWidth > 0) removeLoader(); 
                else renderPlaceholder();
            }
        } else {
            renderPlaceholder();
        }

        // On Click -> Open Preview Modal
        container.addEventListener('click', () => {
            activeProfileBox = container;

            // Reset UI
            setVisibility(modalImg, false);
            setVisibility(modalInitials, false);
            setPreviewLoading(false);

            // Determine content
            const isImgVisible = img && !img.classList.contains('d-none') && img.src;
            
            if(isImgVisible){
                modalImg.src = img.src;
                setVisibility(modalImg, true);
                modalContainer.style.backgroundColor = 'transparent';
                if(!modalImg.complete) setPreviewLoading(true);
            } else {
                modalInitials.innerText = char;
                setVisibility(modalInitials, true, 'd-flex');
                modalContainer.style.backgroundColor = container.dataset.bgColor;
            }

            // View-Only Logic: Change cursor/title AND toggle class
            if (isEditable()) {
                modalContainer.classList.remove('view-only'); // <--- Enable Hover
                modalContainer.style.cursor = 'pointer';
                modalContainer.title = "Click or Drop image to upload";
                setVisibility(modalUploadHint, true);
            } else {
                modalContainer.classList.add('view-only');    // <--- Disable Hover
                modalContainer.style.cursor = 'default';
                modalContainer.title = "";
                setVisibility(modalUploadHint, false);
            }

            previewModal.show();
        });
    });

    // Preview Image Load Handlers
    modalImg.onload = () => setPreviewLoading(false);
    modalImg.onerror = () => {
        setPreviewLoading(false);
        setVisibility(modalImg, false);
        setVisibility(modalInitials, true, 'd-flex');
        if(activeProfileBox){
            modalInitials.innerText = activeProfileBox.getAttribute('cstm-data-no-img-char');
            modalContainer.style.backgroundColor = activeProfileBox.dataset.bgColor;
        }
    };

    // -- File Selection Handling --
    
    // Drag Events: Only active if isEditable() is true
    ["dragenter","dragover"].forEach(evt => 
        modalContainer.addEventListener(evt, e => {
            e.preventDefault(); 
            if (!isEditable()) return;
            modalContainer.classList.add("border", "border-primary", "border-2", "drag-active");
        })
    );
    ["dragleave","drop"].forEach(evt => 
        modalContainer.addEventListener(evt, e => {
            e.preventDefault(); 
            if (!isEditable()) return;
            modalContainer.classList.remove("border", "border-primary", "border-2", "drag-active");
        })
    );
    
    modalContainer.addEventListener("drop", (e) => {
        if (!isEditable()) return;
        const file = e.dataTransfer.files[0];
        if(file) handleNewFile(file);
    });

    // Click Event: Only active if isEditable() is true
    modalContainer.addEventListener("click", () => {
        if (isEditable()) {
            fileInput.click();
        }
    });

    fileInput.addEventListener("change", (e) => handleNewFile(e.target.files[0]));

    function handleNewFile(file){
        if(!file) return;

        // File Type Validation
        if (!ALLOWED_TYPES.includes(file.type)) {
            showError(`Invalid file type. Please upload a PNG, JPG/JPEG, or WEBP image.`); 
            return;
        }

        if(file.size > MAX_FILE_MB*1024*1024){
            showError(`File too large, max ${MAX_FILE_MB} MB`); 
            return;
        }
        
        setPreviewLoading(true);
        const reader = new FileReader();
        reader.onload = e => {
            setPreviewLoading(false);
            cropperImage.src = e.target.result;
            previewModal.hide();
            cropModal.show();
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
    }

    // -- Cropper Logic --

    cropModalEl.addEventListener('shown.bs.modal', () => {
        if (cropper) cropper.destroy();
        cropper = new Cropper(cropperImage, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: 'move',
            background: false,
            autoCropArea: 0.8,
            movable: true,
            zoomable: true,
            zoomOnWheel: true,
            ready: function() {
                const imageData = this.cropper.getImageData();
                const currentZoom = imageData.width / imageData.naturalWidth;
                zoomRange.min = 0.1; 
                zoomRange.max = 3.0;
                zoomRange.value = currentZoom;
            },
            zoom: function(event) {
                zoomRange.value = event.detail.ratio;
            }
        });
    });

    zoomRange.addEventListener('input', (e) => {
        if (cropper) cropper.zoomTo(parseFloat(e.target.value));
    });

    cropModalEl.addEventListener('hidden.bs.modal', () => {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        cropperImage.src = '';
        zoomRange.value = 1;
    });

    btnCancelCrop.addEventListener('click', () => {
        cropModal.hide();
        previewModal.show();
    });

    // ----------------------------------------------------
    // SAVE LOGIC
    // ----------------------------------------------------
    btnSaveCrop.addEventListener('click', () => {
        // Double check permissions
        if(!cropper || !activeProfileBox || !isEditable()) return;

        const uploadEndpoint = activeProfileBox.getAttribute('cstm-data-profile-picture-upload-endpoint');

        const originalBtnText = btnSaveCrop.innerHTML;
        btnSaveCrop.disabled = true;
        btnSaveCrop.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...';

        // 1. Get Canvas
        const canvasHigh = cropper.getCroppedCanvas({ 
            width: 1024, 
            height: 1024, 
            imageSmoothingQuality: 'high'
        });

        // 2. Convert to BLOB
        canvasHigh.toBlob(async (blob) => {
            if(!blob) {
                showError("Image generation failed.");
                btnSaveCrop.disabled = false;
                btnSaveCrop.innerHTML = originalBtnText;
                return;
            }

            // 3. Prepare FormData
            const formData = new FormData();
            formData.append('avatar', blob, 'avatar.jpg');

            const csrfToken = activeProfileBox.getAttribute('cstm-data-csrf-token');

            try {    
                const response = await fetch(uploadEndpoint, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: formData
                });

                if (!response.ok) {
                    let errMsg = `Upload failed (Status: ${response.status})`;
                    try {
                        const errData = await response.json();
                        if(errData.message) errMsg = errData.message;
                    } catch(e) {}
                    throw new Error(errMsg);
                }
                
                // ----------------------------------------------------
                // REFRESH LOGIC: Force cache bust on all profile images
                // ----------------------------------------------------
                const timestamp = new Date().getTime();
                const allProfileContainers = document.querySelectorAll('[cstmtag-profile-picture]');

                allProfileContainers.forEach(container => {
                    const img = container.querySelector('img');
                    
                    if(img) {
                        // Strip old query params and add new timestamp
                        const currentSrc = img.src.split('?')[0];
                        img.src = `${currentSrc}?t=${timestamp}`;

                        // Ensure visibility
                        setVisibility(img, true);
                        
                        // Hide initials
                        const boxSpan = container.querySelector('.profile-initials');
                        if(boxSpan) setVisibility(boxSpan, false);
                    }
                    // Note: If you have elements that start with NO <img> tag at all,
                    // you would need code here to create it. Assuming standard structure
                    // where <img> is present but potentially hidden/broken.
                });

                // Close Modal
                cropModal.hide();

            } catch (err) {
                showError(err.message);
            } finally {
                btnSaveCrop.disabled = false;
                btnSaveCrop.innerHTML = originalBtnText;
            }

        }, 'image/jpeg', 0.9);
    });
});

console.log('loaded profile_picture.js')