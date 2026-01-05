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
    const MAX_FILE_MB = 5;
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

    const isEditable = () => {
        return activeProfileBox && activeProfileBox.hasAttribute('cstm-data-profile-picture-upload-endpoint');
    };

    // --- NEW LOGIC HELPER ---
    const generateInitials = (fullName) => {
        const nameParts = (fullName || '').trim().split(/\s+/).filter(Boolean);

        if (nameParts.length === 0) return ':D';
        if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
        if (nameParts.length === 2) return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        
        // Your specific logic for > 2: 2nd word initial + 3rd word initial
        return (nameParts[1][0] + nameParts[2][0]).toUpperCase();
    };

    // -- Initialization --
    containers.forEach(container => {
        // --- CHANGED HERE ---
        // Instead of getting pre-calculated char, we get the name and calculate it
        const fullName = container.getAttribute('cstm-data-full-name'); 
        // We store the calculated char in the dataset so we can retrieve it easily in handlers later
        const char = generateInitials(fullName);
        container.dataset.calculatedInitials = char; 
        // --------------------

        const img = container.querySelector('img');

        // Dynamic BG color
        let hash = 0;
        // Use the calculated char for the hash so colors remain consistent
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
                span.innerText = char; // Use calculated char
                container.appendChild(span);
            } else {
                span.innerText = char; // Ensure text is updated
                setVisibility(span, true, 'd-flex');
            }
        };

        if(img){
            img.onerror = renderPlaceholder;
            img.onload = removeLoader;
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

            setVisibility(modalImg, false);
            setVisibility(modalInitials, false);
            setPreviewLoading(false);

            const isImgVisible = img && !img.classList.contains('d-none') && img.src;
            
            if(isImgVisible){
                modalImg.src = img.src;
                setVisibility(modalImg, true);
                modalContainer.style.backgroundColor = 'transparent';
                if(!modalImg.complete) setPreviewLoading(true);
            } else {
                modalInitials.innerText = char; // Use calculated char
                setVisibility(modalInitials, true, 'd-flex');
                modalContainer.style.backgroundColor = container.dataset.bgColor;
            }

            if (isEditable()) {
                modalContainer.classList.remove('view-only');
                modalContainer.style.cursor = 'pointer';
                modalContainer.title = "Click or Drop image to upload";
                setVisibility(modalUploadHint, true);
            } else {
                modalContainer.classList.add('view-only');
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
            // --- CHANGED HERE ---
            // Retrieve the calculated char from the dataset we saved earlier
            modalInitials.innerText = activeProfileBox.dataset.calculatedInitials; 
            modalContainer.style.backgroundColor = activeProfileBox.dataset.bgColor;
        }
    };

    // ... (Rest of your File Selection and Cropper logic remains exactly the same) ...

    // -- File Selection Handling --
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

    modalContainer.addEventListener("click", () => {
        if (isEditable()) fileInput.click();
    });

    fileInput.addEventListener("change", (e) => handleNewFile(e.target.files[0]));

    function handleNewFile(file){
        if(!file) return;
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

    // Save Logic
    btnSaveCrop.addEventListener('click', () => {
        if(!cropper || !activeProfileBox || !isEditable()) return;

        const uploadEndpoint = activeProfileBox.getAttribute('cstm-data-profile-picture-upload-endpoint');
        const originalBtnText = btnSaveCrop.innerHTML;
        btnSaveCrop.disabled = true;
        btnSaveCrop.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...';

        const canvasHigh = cropper.getCroppedCanvas({ 
            width: 1024, 
            height: 1024, 
            imageSmoothingQuality: 'high'
        });

        canvasHigh.toBlob(async (blob) => {
            if(!blob) {
                showError("Image generation failed.");
                btnSaveCrop.disabled = false;
                btnSaveCrop.innerHTML = originalBtnText;
                return;
            }

            const formData = new FormData();
            formData.append('avatar', blob, 'avatar.jpg');
            const csrfToken = activeProfileBox.getAttribute('cstm-data-csrf-token');

            try {    
                const response = await fetch(uploadEndpoint, {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': csrfToken },
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
                
                const timestamp = new Date().getTime();
                const allProfileContainers = document.querySelectorAll('[cstmtag-profile-picture]');

                allProfileContainers.forEach(container => {
                    const img = container.querySelector('img');
                    if(img) {
                        const currentSrc = img.src.split('?')[0];
                        img.src = `${currentSrc}?t=${timestamp}`;
                        setVisibility(img, true);
                        const boxSpan = container.querySelector('.profile-initials');
                        if(boxSpan) setVisibility(boxSpan, false);
                    }
                });

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

console.log('loaded profile_picture.js');