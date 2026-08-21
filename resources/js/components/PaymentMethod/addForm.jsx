import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const fields = [
    ['payment_method', 'Payment Method Name', 'e.g. Credit Card'],
    ['currency_id', 'Currency ID (Optional)', 'e.g. 1'],
];

export default function AddPaymentMethodForm({
    form = {},
    onChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    errors = {},
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Method Details</CardTitle>
                <CardDescription>Fill in the payment method details.</CardDescription>
            </CardHeader>
            <Separator />
            <form onSubmit={onSubmit}>
                <CardContent className="grid grid-cols-1 gap-5 pt-6 md:grid-cols-2">
                    {fields.map(([name, label, placeholder]) => (
                        <div className="space-y-2" key={name}>
                            <Label htmlFor={`payment-method-${name}`}>{label}</Label>
                            <Input
                                id={`payment-method-${name}`}
                                name={name}
                                value={form[name] || ''}
                                onChange={onChange}
                                placeholder={placeholder}
                            />
                            {errors[name] && <p className="text-xs text-destructive">{errors[name][0]}</p>}
                        </div>
                    ))}
                </CardContent>
                <Separator />
                <CardFooter className="flex justify-end gap-3 pt-6">
                    <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create Payment Method'}</Button>
                </CardFooter>
            </form>
        </Card>
    );
}