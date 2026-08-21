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
import CurrencyTable from '@/components/currency/table';
import { deleteCurrency, fetchCurrencies } from './api';

export default function CurrencyPage() {
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();
    const [currencies, setCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [currencyToDelete, setCurrencyToDelete] = useState(null);

    useEffect(() => {
        setPageTitle('Currency');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadCurrencies() {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const data = await fetchCurrencies();
                if (!ignore) {
                    setCurrencies(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(error.message || 'Failed to load currencies.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadCurrencies();

        return () => {
            ignore = true;
        };
    }, []);

    const handleConfirmDelete = async () => {
        if (!currencyToDelete) {
            return;
        }

        const id = currencyToDelete.id;
        setDeletingId(id);
        setErrorMessage('');

        try {
            await deleteCurrency(id);
            setCurrencies((previous) => previous.filter((currency) => currency.id !== id));
            toast.success('Currency deleted successfully.', {
                style: { color: '#16a34a' },
            });
            setCurrencyToDelete(null);
        } catch (error) {
            const message = error.message || 'Failed to delete currency.';
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
                <CurrencyTable
                    currencies={currencies}
                    isLoading={isLoading}
                    deletingId={deletingId}
                    onAdd={() => navigate('/currency/add')}
                    onEdit={(id) => navigate(`/currency/${id}/edit`)}
                    onRequestDelete={setCurrencyToDelete}
                    canCreate
                    canUpdate
                    canDelete
                />
            </div>
            <AlertDialog open={currencyToDelete !== null} onOpenChange={(open) => !open && setCurrencyToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Currency</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{currencyToDelete?.Currency}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} disabled={deletingId === currencyToDelete?.id}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}