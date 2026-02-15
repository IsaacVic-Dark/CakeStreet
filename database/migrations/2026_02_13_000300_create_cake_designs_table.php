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
        Schema::create('cake_designs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('bakery_id')->nullable()->constrained('bakeries')->onDelete('set null');
            $table->string('name')->nullable();
            $table->json('design_data');
            $table->string('preview_image_url')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->boolean('is_template')->default(false);
            $table->boolean('is_public')->default(false);
            $table->enum('status', ['draft', 'submitted', 'quoted', 'approved', 'rejected'])->default('draft');
            $table->decimal('estimated_price', 10, 2)->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('bakery_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cake_designs');
    }
};

