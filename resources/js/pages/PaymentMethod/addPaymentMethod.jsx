import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AddPaymentMethodForm from '@/components/paymentMethod/addForm';
import { useAppContext } from '@/context/AppContext';
import { createPaymentMethod } from './api';

export default function AddPaymentMethod() {
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();
    const [formData, setFormData] = useState({
        currency_id:'',
        payment_method:''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        setPageTitle('Add PaymentMethod');
    }, [setPageTitle]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.currency_id.trim()) newErrors.currency_id = 'Currency Id is required.';
        if (!formData.payment_method.trim()) newErrors.payment_method = 'Payment Method is required.';
      

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        setSubmitError('');

        try {
            await createPaymentMethod(formData);
            toast.success('Payment Method created successfully.', {
                style: { color: '#16a34a' },
            });
            navigate('/payment-method');
        } catch (error) {
            const fieldErrors = error.payload?.errors || {};
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const message = error.message || 'Failed to create Payment Method.';
                setSubmitError(message);
                toast.error(message, {
                    style: { color: '#dc2626' },
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {submitError && <p className="text-sm text-destructive">{submitError}</p>}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                <AddPaymentMethodForm
                    form={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/payment-method')}
                    isSubmitting={isLoading}
                    errors={Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, Array.isArray(value) ? value : [value]]))}
                />
            </div>
        </div>
    );
}