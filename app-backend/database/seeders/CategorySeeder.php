<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Faith',
                'description' => 'Messages about faith and belief'
            ],
            [
                'name' => 'Healing',
                'description' => 'Messages about divine healing and restoration'
            ],
            [
                'name' => 'Wealth',
                'description' => 'Messages about prosperity and financial blessing'
            ],
            [
                'name' => 'Prayer',
                'description' => 'Messages about prayer and intercession'
            ],
            [
                'name' => 'Worship',
                'description' => 'Messages about worship and praise'
            ],
            [
                'name' => 'Family',
                'description' => 'Messages about family and relationships'
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}