import Swal from 'sweetalert2';

// Configuración global de SweetAlert2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showSuccess = (message) => {
  return Toast.fire({
    icon: 'success',
    title: message
  });
};

export const showError = (message) => {
  return Toast.fire({
    icon: 'error',
    title: message
  });
};

export const showWarning = (message) => {
  return Toast.fire({
    icon: 'warning',
    title: message
  });
};

export const showInfo = (message) => {
  return Toast.fire({
    icon: 'info',
    title: message
  });
};

export const showConfirm = async (title, text) => {
  return await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });
};

export const showAlert = (title, message, icon = 'info') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: icon,
    confirmButtonColor: '#10b981'
  });
};