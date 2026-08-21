import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const fields = [
    ['Country', 'Country'],
    ['Country_Code', 'Country Code'],
    ['Currency', 'Currency Name'],
    ['Currency_Code', 'Currency Code'],
    ['Currency_Sign', 'Currency Sign'],
];

export default function EditCurrencyForm({
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
                <CardTitle>Edit Currency</CardTitle>
                <CardDescription>Update the selected currency details.</CardDescription>
            </CardHeader>
            <Separator />
            <form onSubmit={onSubmit}>
                <CardContent className="grid grid-cols-1 gap-5 pt-6 md:grid-cols-2">
                    {fields.map(([name, label]) => (
                        <div className="space-y-2" key={name}>
                            <Label htmlFor={`edit-currency-${name}`}>{label}</Label>
                            <Input
                                id={`edit-currency-${name}`}
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
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update Currency'}</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
