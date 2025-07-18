<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
     public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions (only for Filament dashboard)
        $permissions = [
            // Dashboard Access
            'view-dashboard',
            
            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',
            
            // Stream Links
            'view stream-links',
            'create stream-links',
            'edit stream-links',
            'delete stream-links',
            'activate stream-links',
            
            // Categories
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',
            
            // Messages
            'view messages',
            'create messages',
            'edit messages',
            'delete messages',
            'publish messages',
            
            // Podcasts
            'view podcasts',
            'create podcasts',
            'edit podcasts',
            'delete podcasts',
            'approve podcasts',
            'reject podcasts',
            'approve podcast-deletions',
            
            // Podcast Requests
            'view podcast-requests',
            'approve podcast-requests',
            'reject podcast-requests',
            
            // Comments
            'view comments',
            'moderate comments',
            'delete comments',
            
            // Quick Links
            'view quick-links',
            'create quick-links',
            'edit quick-links',
            'delete quick-links',
            
            // Banner Ads
            'view banner-ads',
            'create banner-ads',
            'edit banner-ads',
            'delete banner-ads',
            
            // Analytics
            'view analytics',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Admin Role - Full access
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Manager Role - Partial admin access
        $managerRole = Role::create(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view-dashboard',
            'view users',
            'view stream-links',
            'create stream-links',
            'edit stream-links',
            'activate stream-links',
            'view categories',
            'create categories',
            'edit categories',
            'view messages',
            'create messages',
            'edit messages',
            'publish messages',
            'view podcasts',
            'approve podcasts',
            'reject podcasts',
            'view podcast-requests',
            'approve podcast-requests',
            'reject podcast-requests',
            'view comments',
            'moderate comments',
            'view quick-links',
            'create quick-links',
            'edit quick-links',
            'view banner-ads',
            'create banner-ads',
            'edit banner-ads',
            'view analytics',
        ]);

        // Moderator Role - Content moderation only
        $moderatorRole = Role::create(['name' => 'moderator']);
        $moderatorRole->givePermissionTo([
            'view-dashboard',
            'view comments',
            'moderate comments',
            'delete comments',
            'view podcasts',
            'approve podcasts',
            'reject podcasts',
            'approve podcast-deletions',
            'view podcast-requests',
            'approve podcast-requests',
            'reject podcast-requests',
        ]);

        // User Role - No permissions (API access only)
        $userRole = Role::create(['name' => 'user']);
        // No permissions assigned - users access everything via API

        // Create default admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@churchaudio.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');
    }
}