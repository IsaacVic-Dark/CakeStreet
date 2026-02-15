<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CakeDesign extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'bakery_id',
        'name',
        'design_data',
        'preview_image_url',
        'thumbnail_url',
        'is_template',
        'is_public',
        'status',
        'estimated_price',
    ];

    protected $casts = [
        'design_data' => 'array',
        'is_template' => 'boolean',
        'is_public' => 'boolean',
        'estimated_price' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bakery(): BelongsTo
    {
        return $this->belongsTo(Bakery::class);
    }
}
