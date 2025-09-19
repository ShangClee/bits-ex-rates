/**
 * PWA Icon Fallback Generator
 * Creates canvas-based icons when image files are not available
 */

function generatePWAIcon(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Bitcoin orange background with rounded corners
    const radius = size * 0.125; // 12.5% radius
    ctx.fillStyle = '#f7931a';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    
    // Bitcoin symbol
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.6}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₿', size / 2, size / 2);
    
    return canvas.toDataURL('image/png');
}

// Generate icons for common sizes
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create fallback icons if needed
iconSizes.forEach(size => {
    const img = new Image();
    img.onerror = () => {
        // If icon doesn't exist, create a fallback
        const iconData = generatePWAIcon(size);
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.sizes = `${size}x${size}`;
        link.href = iconData;
        document.head.appendChild(link);
    };
    img.src = `icons/icon-${size}x${size}.png`;
});

// Polyfill for roundRect if not available
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}