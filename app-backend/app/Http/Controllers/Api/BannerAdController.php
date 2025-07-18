<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BannerAd;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BannerAdController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $bannerAds = BannerAd::active()
            ->byOrder()
            ->get();

        // Add image URLs
        $bannerAds->transform(function ($ad) {
            $ad->image_url = $ad->image_url;
            $ad->banner_image_url = $ad->banner_image_url;
            $ad->mobile_image_url = $ad->mobile_image_url;
            return $ad;
        });

        return response()->json([
            'data' => $bannerAds
        ]);
    }
}