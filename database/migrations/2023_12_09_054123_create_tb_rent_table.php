<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tb_rent', function (Blueprint $table) {
            $table->id();
            $table->integer('id_admin');
            $table->integer('id_mobil');
            $table->date('mulai');
            $table->date('selesai');
            $table->string('dikembalikan')->default('');
            $table->string('tarif')->default('');
            $table->string('biaya')->default('');
            $table->string('created_by')->default('');
            $table->string('updated_by')->default('');
            $table->string('deleted_by')->default('');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_rent');
    }
};
