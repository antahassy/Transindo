<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MA_rent extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'tb_rent';
    protected $guarded = [];
    protected $casts = [
	    'created_at' => 'datetime:Y-m-d H:i:s',
	    'updated_at' => 'datetime:Y-m-d H:i:s',
	    'deleted_at' => 'datetime:Y-m-d H:i:s'
	];
}
