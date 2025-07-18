<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePodcastRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canUploadPodcasts();
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'audio_file' => 'required|file|mimes:mp3,wav,ogg|max:51200', // 50MB
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
            'allow_download' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'audio_file.max' => 'Audio file must be smaller than 50MB.',
            'cover_image.max' => 'Cover image must be smaller than 5MB.',
        ];
    }
}
