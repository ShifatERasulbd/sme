<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    protected $fillable = [
        'Country',
        'Country_Code',
        'Currency',
        'Currency_Code',
        'Currency_Sign',
    ];
}
