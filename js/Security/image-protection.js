class ImageProtectionSystem {
    constructor(options = {}) {
        this.options = {
            watermarkText: options.watermarkText || 'Protected Content',
            enableCanvasProtection: options.enableCanvasProtection !== false,
            enableContextMenuProtection: options.enableContextMenuProtection !== false,
            enableDragProtection: options.enableDragProtection !== false,
            enableKeyboardProtection: options.enableKeyboardProtection !== false,
            enablePrintProtection: options.enablePrintProtection !== false,
            blurOnInactiveTab: options.blurOnInactiveTab !== false,
            addOverlay: options.addOverlay !== false
        };
        
        this.initialize();
    }

    initialize() {
        this.setupImageProtections();
        this.setupEventListeners();
        if (this.options.addOverlay) {
            this.createProtectiveOverlay();
        }
    }

    setupImageProtections() {
        // Protege todas as imagens existentes
        const images = document.getElementsByTagName('img');
        Array.from(images).forEach(img => this.protectImage(img));

        // Observa novas imagens adicionadas ao DOM
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG') {
                        this.protectImage(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    protectImage(img) {
        // Adiciona atributos de proteção básica
        img.setAttribute('draggable', 'false');
        img.style.webkitUserSelect = 'none';
        img.style.userSelect = 'none';
        img.style.webkitTouchCallout = 'none';
        
        // Substitui src por blob URL
        this.convertToSecureUrl(img);

        // Adiciona marca d'água dinâmica
        if (this.options.watermarkText) {
            this.addWatermark(img);
        }
    }

    async convertToSecureUrl(img) {
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const secureUrl = URL.createObjectURL(blob);
            
            // Armazena o URL original como atributo de dados
            img.dataset.originalSrc = img.src;
            img.src = secureUrl;

            // Revoga o URL do blob quando a imagem é carregada
            img.onload = () => {
                URL.revokeObjectURL(secureUrl);
            };
        } catch (error) {
            console.error('Erro ao converter imagem:', error);
        }
    }

    addWatermark(img) {
        // Cria uma div container para a marca d'água
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        
        // Configura o texto da marca d'água
        const watermark = document.createElement('div');
        watermark.textContent = this.options.watermarkText;
        watermark.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            font-family: Arial, sans-serif;
            font-size: 20px;
            color: rgba(7, 7, 7, 0.75);
            text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
            transform: rotate(-45deg);
            white-space: nowrap;
            overflow: hidden;
        `;

        // Substitui a imagem pelo container com marca d'água
        img.parentNode.insertBefore(container, img);
        container.appendChild(img);
        container.appendChild(watermark);
    }

    createProtectiveOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
        `;
        
        // Cria um canvas para o overlay
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.1;
        `;
        
        overlay.appendChild(canvas);
        document.body.appendChild(overlay);

        // Atualiza o padrão do canvas periodicamente
        this.updateOverlayPattern(canvas);
    }

    updateOverlayPattern(canvas) {
        const ctx = canvas.getContext('2d');
        const pattern = this.generateNoisePattern();
        
        // Atualiza o padrão a cada 100ms
        setInterval(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, 100);
    }

    generateNoisePattern() {
        const patternCanvas = document.createElement('canvas');
        const patternCtx = patternCanvas.getContext('2d');
        patternCanvas.width = 50;
        patternCanvas.height = 50;

        // Gera ruído aleatório
        const imageData = patternCtx.createImageData(50, 50);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;     // R
            data[i + 1] = value; // G
            data[i + 2] = value; // B
            data[i + 3] = 5;     // A (muito transparente)
        }

        patternCtx.putImageData(imageData, 0, 0);
        return patternCtx.createPattern(patternCanvas, 'repeat');
    }

    setupEventListeners() {
        if (this.options.enableContextMenuProtection) {
            this.preventContextMenu();
        }
        if (this.options.enableDragProtection) {
            this.preventDragging();
        }
        if (this.options.enableKeyboardProtection) {
            this.preventKeyboardShortcuts();
        }
        if (this.options.enablePrintProtection) {
            this.preventPrinting();
        }
        if (this.options.blurOnInactiveTab) {
            this.setupTabBlur();
        }
        if (this.options.enableCanvasProtection) {
            this.preventCanvasExtraction();
        }
    }

    preventContextMenu() {
        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        });
    }

    preventDragging() {
        document.addEventListener('dragstart', e => {
            e.preventDefault();
            return false;
        });
        
        document.addEventListener('drop', e => {
            e.preventDefault();
            return false;
        });
    }

    preventKeyboardShortcuts() {
        document.addEventListener('keydown', e => {
            // Previne PrintScreen
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                return false;
            }

            // Previne Ctrl+S, Ctrl+C, Ctrl+U, Ctrl+P
            if (e.ctrlKey && ['s', 'c', 'u', 'p'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                return false;
            }
        });
    }

    preventPrinting() {
        window.addEventListener('beforeprint', e => {
            e.preventDefault();
            return false;
        });
    }

    setupTabBlur() {
        document.addEventListener('visibilitychange', () => {
            const images = document.getElementsByTagName('img');
            if (document.hidden) {
                Array.from(images).forEach(img => {
                    img.style.filter = 'blur(20px)';
                });
            } else {
                Array.from(images).forEach(img => {
                    img.style.filter = 'none';
                });
            }
        });
    }

    preventCanvasExtraction() {
        // Sobrescreve o método toDataURL do canvas
        HTMLCanvasElement.prototype.toDataURL = function() {
            return '[Blocked] Canvas data URL';
        };

        // Sobrescreve o método getImageData do contexto 2D
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function(x, y, width, height) {
            const imageData = originalGetImageData.call(this, x, y, width, height);
            // Modifica os dados da imagem para prevenir extração
            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = Math.random() * 255;     // R
                imageData.data[i + 1] = Math.random() * 255; // G
                imageData.data[i + 2] = Math.random() * 255; // B
            }
            return imageData;
        };
    }
}

// Função de inicialização
function initializeImageProtection(options = {}) {
    return new ImageProtectionSystem(options);
}

// Exemplo de uso
document.addEventListener('DOMContentLoaded', () => {
    const protection = initializeImageProtection({
        watermarkText: '© NextSakura',
        blurOnInactiveTab: true,
        addOverlay: true
    });
});