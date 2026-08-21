import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const fields = [
    ['Country', 'Country', 'e.g. United States'],
    ['Country_Code', 'Country Code', 'e.g. US'],
    ['Currency', 'Currency Name', 'e.g. US Dollar'],
    ['Currency_Code', 'Currency Code', 'e.g. USD'],
    ['Currency_Sign', 'Currency Sign', 'e.g. $'],
];

export default function AddCurrencyForm({
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
                <CardTitle>Currency Details</CardTitle>
                <CardDescription>Fill in the currency details.</CardDescription>
            </CardHeader>
            <Separator />
            <form onSubmit={onSubmit}>
                <CardContent className="grid grid-cols-1 gap-5 pt-6 md:grid-cols-2">
                    {fields.map(([name, label, placeholder]) => (
                        <div className="space-y-2" key={name}>
                            <Label htmlFor={`currency-${name}`}>{label}</Label>
                            <Input
                                id={`currency-${name}`}
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
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create Currency'}</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
