    window.onload = function(){
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const originalCanvas = document.getElementById('originalCanvas');
        const digitalCanvas = document.getElementById('digitalCanvas');
        const ctxOriginal = originalCanvas.getContext('2d');
        const ctxDigital = digitalCanvas.getContext('2d');

        let originalImageData = null;
        let loadedImage = null;

        const fileInput = document.getElementById('imageInput');
        fileInput.addEventListener('change', function() {
            const file = fileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                loadedImage = new Image();
                loadedImage.onload = function() {
                    const resolution = parseInt(document.getElementById('resolution').value);

                    // Ajustar los canvas
                    canvas.width = resolution;
                    canvas.height = resolution;
                    originalCanvas.width = resolution;
                    originalCanvas.height = resolution;
                    digitalCanvas.width = resolution;
                    digitalCanvas.height = resolution;

                    // Mostrar imagen cargada inmediatamente
                    ctx.drawImage(loadedImage, 0, 0, resolution, resolution);
                    ctxOriginal.drawImage(loadedImage, 0, 0, resolution, resolution);
                };
                loadedImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        window.processImage = function() {
            if (!loadedImage) return;

            const resolution = parseInt(document.getElementById('resolution').value);
            const bitDepth = parseInt(document.getElementById('bitDepth').value);

            ctx.drawImage(loadedImage, 0, 0, resolution, resolution);
            let imageData = ctx.getImageData(0, 0, resolution, resolution);
            originalImageData = new ImageData(new Uint8ClampedArray(imageData.data), resolution, resolution);
            const data = imageData.data;

           if (bitDepth >= 1 && bitDepth <= 10) {
        const levels = Math.pow(2, bitDepth);
        const scale = 255 / (levels - 1);

        for (let i = 0; i < data.length; i += 4) {
            // Redondear cada canal RGB (no alfa)
            data[i]     = Math.round(data[i] / scale) * scale;     // Rojo
            data[i + 1] = Math.round(data[i + 1] / scale) * scale; // Verde
            data[i + 2] = Math.round(data[i + 2] / scale) * scale; // Azul
        }
    }

            ctx.putImageData(imageData, 0, 0);
            ctxDigital.putImageData(imageData, 0, 0);

            // Obtener tamaño aproximado de imagen digitalizada (bytes)
           const compressedDataURL = canvas.toDataURL('image/jpeg', 0.5);
           const sizeBytes = Math.round((compressedDataURL.length * (3/4))); // base64 a bytes

// Enviar estadísticas al backend
         fetch('http://localhost:3000/api/stats', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
         resolution: `${resolution}x${resolution}`,
         bitDepth: bitDepth,
         imageSizeBytes: sizeBytes
    })
        }).then(res => res.json())
        .then(data => console.log('Estadísticas enviadas:', data))
        .catch(err => console.error('Error enviando estadísticas:', err));

        };

        window.comprimirImagen = function() {
            const dataURL = canvas.toDataURL('image/jpeg', 0.5);
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'imagen_comprimida.jpg';
            link.click();
        };
    }
