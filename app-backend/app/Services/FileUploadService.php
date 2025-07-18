<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    public static function uploadAudio(UploadedFile $file, string $folder = 'audio'): string
    {
        $filename = self::generateUniqueFilename($file, $folder);
        
        $path = Storage::disk('s3')->putFileAs(
            $folder,
            $file,
            $filename,
            'public'
        );

        return Storage::disk('s3')->url($path);
    }

    public static function uploadImage(UploadedFile $file, string $folder = 'images'): string
    {
        $filename = self::generateUniqueFilename($file, $folder);
        
        $path = Storage::disk('s3')->putFileAs(
            $folder,
            $file,
            $filename,
            'public'
        );

        return Storage::disk('s3')->url($path);
    }

    public static function deleteFile(string $url): bool
    {
        $path = self::getPathFromUrl($url);
        
        if ($path && Storage::disk('s3')->exists($path)) {
            return Storage::disk('s3')->delete($path);
        }

        return false;
    }

    private static function generateUniqueFilename(UploadedFile $file, string $folder): string
    {
        $extension = $file->getClientOriginalExtension();
        $basename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $sanitizedBasename = Str::slug($basename);
        
        return $sanitizedBasename . '_' . time() . '_' . Str::random(8) . '.' . $extension;
    }

    private static function getPathFromUrl(string $url): ?string
    {
        $bucketUrl = config('filesystems.disks.s3.url');
        
        if (Str::startsWith($url, $bucketUrl)) {
            return Str::after($url, $bucketUrl . '/');
        }

        return null;
    }

    public static function validateAudioFile(UploadedFile $file): array
    {
        $errors = [];

        // Check file type
        $allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            $errors[] = 'Only MP3, WAV, and OGG audio files are allowed.';
        }

        // Check file size (50MB max)
        $maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if ($file->getSize() > $maxSize) {
            $errors[] = 'Audio file must be smaller than 50MB.';
        }

        return $errors;
    }

    public static function validateImageFile(UploadedFile $file): array
    {
        $errors = [];

        // Check file type
        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            $errors[] = 'Only JPEG, PNG, GIF, and WebP images are allowed.';
        }

        // Check file size (5MB max)
        $maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if ($file->getSize() > $maxSize) {
            $errors[] = 'Image file must be smaller than 5MB.';
        }

        return $errors;
    }
}
