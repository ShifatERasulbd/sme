<?php

namespace Tests\Feature;

use App\Models\Currency;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CurrencyCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_crud_currency(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/currencies', [
            'Country' => 'United States',
            'Country_Code' => 'US',
            'Currency' => 'US Dollar',
            'Currency_Code' => 'USD',
            'Currency_Sign' => '$',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('Country', 'United States')
            ->assertJsonPath('Currency', 'US Dollar');

        $currencyId = $response->json('id');

        $this->getJson('/api/currencies')
            ->assertOk()
            ->assertJsonFragment(['Currency' => 'US Dollar']);

        $this->putJson('/api/currencies/'.$currencyId, [
            'Country' => 'United States',
            'Country_Code' => 'US',
            'Currency' => 'United States Dollar',
            'Currency_Code' => 'USD',
            'Currency_Sign' => '$',
        ])->assertOk()
            ->assertJsonPath('Currency', 'United States Dollar');

        $this->deleteJson('/api/currencies/'.$currencyId)
            ->assertOk()
            ->assertJson(['message' => 'Currency deleted']);

        $this->assertDatabaseMissing('currencies', ['id' => $currencyId]);
    }
}
