import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const fields = [
    ['currency_id', 'Currency'],
    ['payment_method', 'Payment Method'],
];

export default function EditPaymentMethodForm({
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
                <CardTitle>Edit Payment Method</CardTitle>
                <CardDescription>Update the selected Payment Method details.</CardDescription>
            </CardHeader>
            <Separator />
            <form onSubmit={onSubmit}>
                <CardContent className="grid grid-cols-1 gap-5 pt-6 md:grid-cols-2">
                    {fields.map(([name, label]) => (
                        <div className="space-y-2" key={name}>
                            <Label htmlFor={`edit-payment-method-${name}`}>{label}</Label>
                            <Input
                                id={`edit-payment-method-${name}`}
                                name={name}
                                value={form[name] || ''}
                                onChange={onChange}
                            />
                            {errors[name] && <p className="text-xs text-destructive">{errors[name][0]}</p>}
                        </div>
                    ))}
                </CardContent>
                <Separator />
                <CardFooter className="flex justify-end gap-3 pt-6">
                    <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update Payment Method'}</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
