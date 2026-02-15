<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'order_id',
        'product_id',
        'cake_design_id',
        'product_name',
        'product_snapshot',
        'customization',
        'quantity',
        'unit_price',
        'total_price',
    ];

    protected $casts = [
        'product_snapshot' => 'array',
        'customization' => 'array',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function cakeDesign(): BelongsTo
    {
        return $this->belongsTo(CakeDesign::class);
    }
}
