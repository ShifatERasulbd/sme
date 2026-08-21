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

export default function CurrencyTable({
    currencies = [],
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
    const filtered = currencies.filter((currency) => {
        const query = search.toLowerCase();
        return (
            currency.Country?.toLowerCase().includes(query) ||
            currency.Country_Code?.toLowerCase().includes(query) ||
            currency.Currency?.toLowerCase().includes(query) ||
            currency.Currency_Code?.toLowerCase().includes(query)
        );
    });
    const columnCount = showActionColumn ? 6 : 5;

    return (
        <>
            <div className="flex items-center gap-3 justify-between">
                <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search currencies..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full pl-9"
                    />
                </div>
                {canCreate && (
                    <Button className="gap-2" onClick={onAdd}>
                        <Plus />
                        Add Currency
                    </Button>
                )}
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">SL No</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Sign</TableHead>
                            {showActionColumn && <TableHead>Action</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                                    Loading currencies...
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && currencies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                                    No currencies found.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && filtered.length === 0 && currencies.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                                    No currencies match your search.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && filtered.map((currency, index) => (
                            <TableRow key={currency.id || currency.Currency_Code}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{currency.Country}</TableCell>
                                <TableCell className="font-semibold">{currency.Currency_Code}</TableCell>
                                <TableCell>{currency.Currency}</TableCell>
                                <TableCell>{currency.Currency_Sign}</TableCell>
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
                                                                aria-label={`Edit ${currency.Currency}`}
                                                                onClick={() => onEdit?.(currency.id)}
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
                                                                aria-label={`Delete ${currency.Currency}`}
                                                                onClick={() => onRequestDelete?.(currency)}
                                                                disabled={deletingId === currency.id}
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
