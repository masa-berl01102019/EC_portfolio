<?php

namespace App\Http\Resources;

use App\Http\Resources\TagResource;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    /**
     *
     * @var string
     */
    public static $wrap = 'news';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if ($request->routeIs('user.news.index') || $request->routeIs('user.home.index')) {
            return [
                'id' => $this->id,
                'title' => $this->title,
                'brand_name' => optional($this->brand)->brand_name,
                'thumbnail' => $this->thumbnail,
                'tags' => $this->tags->pluck('tag_name'),
                'posted_at' => $this->posted_at !== null ? $this->posted_at->format('Y/m/d') : null,
                'modified_at' => $this->modified_at !== null ? $this->modified_at->format('Y/m/d') : null
            ];
        } else if ($request->routeIs('user.news.show')) {
            return [
                'title' => $this->title,
                'body' => $this->body,
                'thumbnail' => $this->thumbnail,
                'tags' => TagResource::collection($this->tags),
                'brand' => new BrandResource($this->brand),
                'category' => new CategoryResource($this->category),
                'posted_at' => $this->posted_at !== null ? $this->posted_at->format('Y/m/d H:i') : null,
                'modified_at' => $this->modified_at !== null ? $this->modified_at->format('Y/m/d H:i') : null
            ];
        } else if ($request->routeIs('admin.news.edit')) {
            return [
                'title' => $this->title,
                'body' => $this->body,
                'thumbnail' => $this->thumbnail,
                'brand_id' => $this->brand_id,
                'category_id' => $this->category_id,
                'tags_id' => $this->tags->pluck('id'),
                'is_published' => $this->is_published
            ];
        } else {
            return [
                'id' => $this->id,
                'title' => $this->title,
                'is_published_text' => $this->is_published_text,
                'brand_name' => optional($this->brand)->brand_name,
                'gender_category_text' => $this->gender_category_text,
                'tags' => $this->tags->pluck('tag_name'),
                'thumbnail' => $this->thumbnail,
                'full_name' => optional($this->admin)->full_name,
                'full_name_kana' => optional($this->admin)->full_name_kana,
                'posted_at' => $this->posted_at !== null ? $this->posted_at->format('Y/m/d H:i') : null,
                'modified_at' => $this->modified_at !== null ? $this->modified_at->format('Y/m/d H:i') : null
            ];
        }
    }
}
