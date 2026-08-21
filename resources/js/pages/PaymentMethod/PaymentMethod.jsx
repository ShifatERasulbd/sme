import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppContext } from '@/context/AppContext';
import PaymentMethodTable from '@/components/PaymentMethod/PaymentMethodTable';
import { deletePaymentMethod, fetchPaymentMethods } from './api';

export default function PaymentMethodPage() {
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);

    useEffect(() => {
        setPageTitle('Payment Method');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadPaymentMethods() {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const data = await fetchPaymentMethods();
                if (!ignore) {
                    setPaymentMethods(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(error.message || 'Failed to load payment methods.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadPaymentMethods();

        return () => {
            ignore = true;
        };
    }, []);

    const handleConfirmDelete = async () => {
        if (!paymentMethodToDelete) {
            return;
        }

        const id = paymentMethodToDelete.id;
        setDeletingId(id);
        setErrorMessage('');

        try {
            await deletePaymentMethod(id);
            setPaymentMethods((previous) => previous.filter((method) => method.id !== id));
            toast.success('Payment method deleted successfully.', {
                style: { color: '#16a34a' },
            });
            setPaymentMethodToDelete(null);
        } catch (error) {
            const message = error.message || 'Failed to delete payment method.';
            setErrorMessage(message);
            toast.error(message, { style: { color: '#dc2626' } });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-5">
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                <PaymentMethodTable
                    paymentMethods={paymentMethods}
                    isLoading={isLoading}
                    deletingId={deletingId}
                    onAdd={() => navigate('/payment-method/add')}
                    onEdit={(id) => navigate(`/payment-method/${id}/edit`)}
                    onRequestDelete={setPaymentMethodToDelete}
                    canCreate
                    canUpdate
                    canDelete
                />
            </div>
            <AlertDialog open={paymentMethodToDelete !== null} onOpenChange={(open) => !open && setPaymentMethodToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{paymentMethodToDelete?.name}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} disabled={deletingId === paymentMethodToDelete?.id}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}