import toast from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'loading' | 'info';

export const showSuccess = (message: string) => {
  return toast.success(message);
};

export const showError = (message: string) => {
  return toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const showInfo = (message: string) => {
  return toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  });
};

export const showPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, messages);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

export const showCustom = (message: string, options?: any) => {
  return toast(message, options);
};
