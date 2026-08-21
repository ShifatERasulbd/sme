<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CurrencyConroller extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Currency::query()->orderBy('id')->get())    ;
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'Country' => ['required', 'string', 'max:255'],
            'Country_Code' => ['required', 'string', 'max:20'],
            'Currency' => ['required', 'string', 'max:255'],
            'Currency_Code' => ['required', 'string', 'max:20', 'unique:currencies,Currency_Code'],
            'Currency_Sign' => ['required', 'string', 'max:20'],
        ]);

        $currency = Currency::query()->create($validated);

        return response()->json($currency, 201);
    }

    public function show(Currency $currency): JsonResponse
    {
        return response()->json($currency);
    }

    public function update(Request $request, Currency $currency): JsonResponse
    {
        $validated = $request->validate([
            'Country' => ['required', 'string', 'max:255'],
            'Country_Code' => ['required', 'string', 'max:20'],
            'Currency' => ['required', 'string', 'max:255'],
            'Currency_Code' => ['required', 'string', 'max:20', 'unique:currencies,Currency_Code,' . $currency->id],
            'Currency_Sign' => ['required', 'string', 'max:20'],
        ]);

        $currency->update($validated);

        return response()->json($currency->fresh());
    }

    public function destroy(Currency $currency): JsonResponse
    {
        $currency->delete();

        return response()->json(['message' => 'Currency deleted']);
    }
}
