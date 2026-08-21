import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import EditPaymentMethodForm from '@/components/PaymentMethod/editForm';
import { useAppContext } from '@/context/AppContext';

import { fetchPaymentMethod, updatePaymentMethod } from './api';

const initialForm = {
   currency_id:'',
   payment_method:''
};

export default function EditPaymentMethod() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        setPageTitle('Edit Payment Method');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadPaymentMethod() {
            setIsLoading(true);
            setLoadError('');

            try {
                const paymentMethod = await fetchPaymentMethod(id);
                if (!ignore) {
                    setFormData({
                        currency_id: String(paymentMethod?.currency_id ?? ''),
                        payment_method: paymentMethod?.payment_method || '',
                    });
                }
            } catch (error) {
                if (!ignore) {
                    setLoadError(error.message || 'Failed to load Payment Method.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadPaymentMethod();

        return () => {
            ignore = true;
        };
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
        if (errors[name]) {
            setErrors((previous) => ({ ...previous, [name]: '' }));
        }
    };

    const validate = () => {
        const nextErrors = {};

        if (!String(formData.currency_id).trim()) nextErrors.currency_id = 'Currency is required.';
        if (!formData.payment_method.trim()) nextErrors.payment_method = 'Payment Method is required.';
        

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setLoadError('');

        try {
            await updatePaymentMethod(id, formData);
            toast.success('Payment Method updated successfully.', {
                style: { color: '#16a34a' },
            });
            navigate('/payment-method');
        } catch (error) {
            const fieldErrors = error.payload?.errors || {};
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const message = error.message || 'Failed to update Payment Methods.';
                setLoadError(message);
                toast.error(message, {
                    style: { color: '#dc2626' },
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading Payment Method...</div>;
    }

    return (
        <div className="space-y-4">
            {loadError && <p className="text-sm text-destructive">{loadError}</p>}
            <EditPaymentMethodForm
                form={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/payment-method')}
                isSubmitting={isSubmitting}
                errors={Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, Array.isArray(value) ? value : [value]]))}
            />
        </div>
    );
}
