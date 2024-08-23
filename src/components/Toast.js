
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToast = () => {
    toast.success("This is a toast notification!");
};

export { ToastContainer, showToast };
