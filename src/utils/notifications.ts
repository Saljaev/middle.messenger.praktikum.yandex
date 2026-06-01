export function showToast(
    message: string,
    type: 'success' | 'error' | 'warning' = 'success',
    duration = 3000,
): void {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
    <div class="toast__content">
      <span>${message}</span>
    </div>
  `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            if (container && container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, duration);
}

export function showSuccess(message: string): void {
    showToast(message, 'success');
}

export function showError(message: string): void {
    showToast(message, 'error');
}

export function showWarning(message: string): void {
    showToast(message, 'warning');
}
