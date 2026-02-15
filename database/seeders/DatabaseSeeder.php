<?php

namespace Database\Seeders;

use App\Models\Bakery;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@cakestreet.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $owner = User::create([
            'name' => 'Happy Cakes Owner',
            'email' => 'owner@happycakes.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'John Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        $bakery = Bakery::create([
            'owner_id' => $owner->id,
            'name' => 'Happy Cakes Bakery',
            'slug' => 'happy-cakes-nairobi',
            'description' => 'The finest cakes in Nairobi. We create beautiful, delicious cakes for all occasions.',
            'phone' => '+254712345678',
            'email' => 'info@happycakes.com',
            'address' => '123 Moi Avenue',
            'city' => 'Nairobi',
            'country' => 'Kenya',
            'is_active' => true,
        ]);

        $products = [
            [
                'name' => 'Chocolate Birthday Extravaganza',
                'slug' => 'chocolate-birthday-extravaganza',
                'description' => 'A decadent multi-layer chocolate cake with rich ganache frosting.',
                'category' => 'birthday',
                'base_flavor' => 'chocolate',
                'available_sizes' => [
                    ['kg' => 0.5, 'price' => 1500, 'serves' => 4],
                    ['kg' => 1, 'price' => 2500, 'serves' => 8],
                    ['kg' => 2, 'price' => 4500, 'serves' => 16],
                ],
                'base_price' => 2500,
                'image_urls' => ['/images/sample-cake-1.jpg'],
                'ingredients' => ['Flour', 'Sugar', 'Cocoa', 'Eggs', 'Butter'],
                'allergens' => ['gluten', 'dairy', 'eggs'],
                'is_eggless' => false,
                'is_sugar_free' => false,
                'is_featured' => true,
                'is_available' => true,
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Vanilla Dream Wedding Cake',
                'slug' => 'vanilla-dream-wedding-cake',
                'description' => 'Elegant three-tier wedding cake with vanilla sponge and cream cheese frosting.',
                'category' => 'wedding',
                'base_flavor' => 'vanilla',
                'available_sizes' => [
                    ['kg' => 3, 'price' => 8500, 'serves' => 30],
                    ['kg' => 5, 'price' => 12500, 'serves' => 50],
                ],
                'base_price' => 8500,
                'image_urls' => ['/images/sample-cake-2.jpg'],
                'is_featured' => true,
                'is_available' => true,
                'stock_quantity' => 20,
            ],
            [
                'name' => 'Red Velvet Romance',
                'slug' => 'red-velvet-romance',
                'description' => 'Classic red velvet cake with cream cheese frosting, perfect for anniversaries.',
                'category' => 'anniversary',
                'base_flavor' => 'red-velvet',
                'available_sizes' => [
                    ['kg' => 1, 'price' => 3000, 'serves' => 8],
                    ['kg' => 2, 'price' => 5500, 'serves' => 16],
                ],
                'base_price' => 3000,
                'image_urls' => ['/images/sample-cake-3.jpg'],
                'is_available' => true,
                'stock_quantity' => 30,
            ],
        ];

        foreach ($products as $p) {
            Product::create(array_merge($p, ['bakery_id' => $bakery->id]));
        }
    }
}
