import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { addToast, removeToast } from '@/store/uiSlice';

export function useToast() {
  const dispatch = useDispatch();

  const toast = useCallback((message, options = {}) => {
    dispatch(addToast({ message, ...options }));
  }, [dispatch]);

  const success = useCallback((message) => {
    toast(message, { type: 'success' });
  }, [toast]);

  const error = useCallback((message) => {
    toast(message, { type: 'error' });
  }, [toast]);

  const warning = useCallback((message) => {
    toast(message, { type: 'warning' });
  }, [toast]);

  const dismiss = useCallback((id) => {
    dispatch(removeToast(id));
  }, [dispatch]);

  return { toast, success, error, warning, dismiss };
}
