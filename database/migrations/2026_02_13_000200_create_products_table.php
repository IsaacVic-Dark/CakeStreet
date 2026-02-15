<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('bakery_id')->constrained('bakeries')->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable();
            $table->string('base_flavor', 100)->nullable();
            $table->json('available_sizes');
            $table->decimal('base_price', 10, 2);
            $table->json('image_urls');
            $table->json('ingredients')->nullable();
            $table->json('allergens')->nullable();
            $table->boolean('is_eggless')->default(false);
            $table->boolean('is_sugar_free')->default(false);
            $table->integer('shelf_life_days')->nullable();
            $table->json('customization_options')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->boolean('is_available')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('preparation_time_hours')->default(24);
            $table->timestamps();

            $table->unique(['bakery_id', 'slug']);
            $table->index('category');
            $table->index('is_featured');
            $table->index('is_available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

