<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InfoInvoice extends Model
{
    use HasFactory;
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
        
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'infoInvoice';

    /**
     * allowing mass assignable for all fields.
     *
     * @var array
     */
    protected $guarded = [];    
}
