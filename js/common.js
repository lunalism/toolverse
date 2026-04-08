/**
 * Toolverse — 공통 유틸 함수 모음
 * 모든 툴 페이지에서 공유하는 클립보드/토스트/다운로드/드롭존 유틸리티
 */

/* ============================================
   [1] 클립보드 복사
   ============================================ */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('복사되었습니다 ✓', 'success');
  } catch (err) {
    showToast('복사 실패', 'error');
  }
}

/* ============================================
   [2] 토스트 알림
   ============================================ */
function showToast(message, type = 'success') {
  // 기존 토스트 제거
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // 트랜지션 트리거를 위해 다음 프레임에 show 클래스 추가
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // 2초 후 제거
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  }, 2000);
}

/* ============================================
   [3] 파일 다운로드
   ============================================ */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadCanvas(canvas, filename = 'image.png') {
  canvas.toBlob((blob) => {
    if (!blob) {
      showToast('이미지 변환 실패', 'error');
      return;
    }
    downloadBlob(blob, filename);
  }, 'image/png');
}

/* ============================================
   [4] 드래그앤드롭 업로드 초기화
   ============================================ */
function initDropzone(dropEl, inputEl, onLoad) {
  if (!dropEl || !inputEl) return;

  // 클릭 시 파일 선택창 열기
  dropEl.addEventListener('click', () => inputEl.click());

  // 드래그 오버
  dropEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropEl.classList.add('dragover');
  });

  // 드래그 떠남
  dropEl.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropEl.classList.remove('dragover');
  });

  // 드롭
  dropEl.addEventListener('drop', (e) => {
    e.preventDefault();
    dropEl.classList.remove('dragover');
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  });

  // 파일 선택
  inputEl.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  });

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => onLoad(file, e.target.result);
    reader.onerror = () => showToast('파일 읽기 실패', 'error');
    reader.readAsDataURL(file);
  }
}

/* ============================================
   [5] 파일 크기 포맷
   ============================================ */
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ============================================
   [6] window 등록
   ============================================ */
window.copyToClipboard = copyToClipboard;
window.showToast = showToast;
window.downloadBlob = downloadBlob;
window.downloadCanvas = downloadCanvas;
window.initDropzone = initDropzone;
window.formatFileSize = formatFileSize;
