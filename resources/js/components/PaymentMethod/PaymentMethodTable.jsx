    import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function PaymentMethodTable({
    paymentMethods = [],
    onAdd,
    onEdit,
    onRequestDelete,
    deletingId,
    isLoading,
    canCreate = false,
    canUpdate = false,
    canDelete = false,
}) {
    const showActionColumn = canUpdate || canDelete;
    const [search, setSearch] = useState('');
    
    const filtered = paymentMethods.filter((method) => {
        const query = search.toLowerCase();
        return (
            method.payment_method?.toLowerCase().includes(query) ||
            String(method.currency_id ?? '').toLowerCase().includes(query)
        );
    });
    
    const columnCount = showActionColumn ? 5 : 4;

    return (
        <>
            <div className="flex items-center gap-3 justify-between">
                <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search payment methods..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full pl-9"
                    />
                </div>
                {canCreate && (
                    <Button className="gap-2" onClick={onAdd}>
                        <Plus />
                        Add Payment Method
                    </Button>
                )}
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">SL No</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Country</TableHead>
                            {showActionColumn && <TableHead>Action</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                                    Loading payment methods...
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && paymentMethods.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                                    No payment methods found.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && filtered.length === 0 && paymentMethods.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                                    No payment methods match your search.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && filtered.map((method, index) => (
                            <TableRow key={method.id || method.payment_method}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-semibold">{method.payment_method}</TableCell>
                                <TableCell>{method.currency?.Country || 'N/A'}</TableCell>
                                {showActionColumn && (
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {canUpdate && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                aria-label={`Edit ${method.payment_method}`}
                                                                onClick={() => onEdit?.(method.id)}
                                                            >
                                                                <Pencil />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom"><p>Edit</p></TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            {canDelete && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                aria-label={`Delete ${method.payment_method}`}
                                                                onClick={() => onRequestDelete?.(method)}
                                                                disabled={deletingId === method.id}
                                                            >
                                                                <Trash2 className="text-destructive" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom"><p>Delete</p></TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}