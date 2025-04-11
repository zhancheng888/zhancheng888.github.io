// 获取 DOM 元素
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片数据
let currentFile = null;
let compressedBlob = null;

// 监听文件输入变化
fileInput.addEventListener('change', handleFileSelect);

// 监听拖拽事件
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#0071e3';
    uploadArea.style.backgroundColor = 'rgba(0, 113, 227, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#d2d2d7';
    uploadArea.style.backgroundColor = '#f5f5f7';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#d2d2d7';
    uploadArea.style.backgroundColor = '#f5f5f7';
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect({ target: fileInput });
    }
});

// 监听压缩质量滑块变化
qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = `${qualitySlider.value}%`;
    if (currentFile) {
        compressImage(currentFile);
    }
});

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.match('image.*')) {
        alert('请选择图片文件！');
        return;
    }

    currentFile = file;
    originalSize.textContent = formatFileSize(file.size);

    // 显示原始图片
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        compressImage(file);
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(file) {
    const quality = qualitySlider.value / 100;
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 设置 canvas 尺寸
            canvas.width = img.width;
            canvas.height = img.height;

            // 绘制图片
            ctx.drawImage(img, 0, 0);

            // 压缩图片
            canvas.toBlob((blob) => {
                compressedBlob = blob;
                compressedImage.src = URL.createObjectURL(blob);
                compressedSize.textContent = formatFileSize(blob.size);
                downloadBtn.disabled = false;
            }, file.type, quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 下载压缩后的图片
downloadBtn.addEventListener('click', () => {
    if (!compressedBlob) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedBlob);
    link.download = `compressed_${currentFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}); 