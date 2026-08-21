<?php

namespace App\Http\Controllers;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
class PaymentMethodController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(PaymentMethod::query()->orderBy('id')->get());
    }

    public function store(Request $request):JsonResponse
    {
         $validated = $request->validate([
            'currency_id' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['required', 'string', 'max:20'],
            
        ]);

        $PaymentMethod=PaymentMethod::create($validated);
        return response()->json($PaymentMethod,201);
    }

    public function show(PaymentMethod $paymentMethod): JsonResponse
    {
        return response()->json($paymentMethod);
    }

    public function update(Request $request, PaymentMethod $paymentMethod): JsonResponse
    {
        $validated = $request->validate([
           'currency_id' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['required', 'string', 'max:20'],
        ]);
    $paymentMethod->update($validated);
    return response()->json($paymentMethod->fresh());
    }

    public function destroy(PaymentMethod $paymentMethod):JsonResponse
    {
        $paymentMethod->delete();
        return response()->json(['message' => 'Payment Method deleted']);
    }
}
