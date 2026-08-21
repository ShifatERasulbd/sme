import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AddCurrencyForm from '@/components/currency/addForm';
import { useAppContext } from '@/context/AppContext';
import { createCurrency } from './api';

export default function AddCurrency() {
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();
    const [formData, setFormData] = useState({
        Country: '',
        Country_Code: '',
        Currency: '',
        Currency_Code: '',
        Currency_Sign: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        setPageTitle('Add Currency');
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
        if (!formData.Country.trim()) newErrors.Country = 'Country is required.';
        if (!formData.Country_Code.trim()) newErrors.Country_Code = 'Country code is required.';
        if (!formData.Currency.trim()) newErrors.Currency = 'Currency name is required.';
        if (!formData.Currency_Code.trim()) newErrors.Currency_Code = 'Currency code is required.';
        if (!formData.Currency_Sign.trim()) newErrors.Currency_Sign = 'Currency sign is required.';

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
            await createCurrency(formData);
            toast.success('Currency created successfully.', {
                style: { color: '#16a34a' },
            });
            navigate('/currency');
        } catch (error) {
            const fieldErrors = error.payload?.errors || {};
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const message = error.message || 'Failed to create currency.';
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
                <AddCurrencyForm
                    form={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/currency')}
                    isSubmitting={isLoading}
                    errors={Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, Array.isArray(value) ? value : [value]]))}
                />
            </div>
        </div>
    );
}