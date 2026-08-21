import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import EditCurrencyForm from '@/components/currency/editForm';
import { useAppContext } from '@/context/AppContext';

import { fetchCurrency, updateCurrency } from './api';

const initialForm = {
    Country: '',
    Country_Code: '',
    Currency: '',
    Currency_Code: '',
    Currency_Sign: '',
};

export default function EditCurrency() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setPageTitle } = useAppContext();

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        setPageTitle('Edit Currency');
    }, [setPageTitle]);

    useEffect(() => {
        let ignore = false;

        async function loadCurrency() {
            setIsLoading(true);
            setLoadError('');

            try {
                const currency = await fetchCurrency(id);
                if (!ignore) {
                    setFormData({
                        Country: currency?.Country || '',
                        Country_Code: currency?.Country_Code || '',
                        Currency: currency?.Currency || '',
                        Currency_Code: currency?.Currency_Code || '',
                        Currency_Sign: currency?.Currency_Sign || '',
                    });
                }
            } catch (error) {
                if (!ignore) {
                    setLoadError(error.message || 'Failed to load currency.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadCurrency();

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

        if (!formData.Country.trim()) nextErrors.Country = 'Country is required.';
        if (!formData.Country_Code.trim()) nextErrors.Country_Code = 'Country code is required.';
        if (!formData.Currency.trim()) nextErrors.Currency = 'Currency name is required.';
        if (!formData.Currency_Code.trim()) nextErrors.Currency_Code = 'Currency code is required.';
        if (!formData.Currency_Sign.trim()) nextErrors.Currency_Sign = 'Currency sign is required.';

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setLoadError('');

        try {
            await updateCurrency(id, formData);
            toast.success('Currency updated successfully.', {
                style: { color: '#16a34a' },
            });
            navigate('/currency');
        } catch (error) {
            const fieldErrors = error.payload?.errors || {};
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const message = error.message || 'Failed to update currency.';
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
        return <div className="text-center p-10">Loading currency...</div>;
    }

    return (
        <div className="space-y-4">
            {loadError && <p className="text-sm text-destructive">{loadError}</p>}
            <EditCurrencyForm
                form={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/currency')}
                isSubmitting={isSubmitting}
                errors={Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, Array.isArray(value) ? value : [value]]))}
            />
        </div>
    );
}
