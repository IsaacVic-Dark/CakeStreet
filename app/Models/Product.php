<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'bakery_id',
        'name',
        'slug',
        'description',
        'category',
        'base_flavor',
        'available_sizes',
        'base_price',
        'image_urls',
        'ingredients',
        'allergens',
        'is_eggless',
        'is_sugar_free',
        'shelf_life_days',
        'customization_options',
        'stock_quantity',
        'is_available',
        'is_featured',
        'preparation_time_hours',
    ];

    protected $casts = [
        'available_sizes' => 'array',
        'image_urls' => 'array',
        'ingredients' => 'array',
        'allergens' => 'array',
        'customization_options' => 'array',
        'is_eggless' => 'boolean',
        'is_sugar_free' => 'boolean',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'base_price' => 'decimal:2',
    ];

    public function bakery(): BelongsTo
    {
        return $this->belongsTo(Bakery::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function averageRating(): float
    {
        return (float) $this->reviews()->avg('rating');
    }
}
