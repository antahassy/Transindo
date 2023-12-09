<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use \App\Models\MA_car;
use \App\Models\MA_rent;
use \App\Models\MA_admin;

class A_car extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if(! Session::get('admin.id')) {
            return Redirect("admin"); 
        }else{
            $sess_id = Session::get('admin.id');
            $sess_id_group = DB::table('tb_admin_group_2')->where('id_admin', $sess_id)->first()->id_group;
            $akses = DB::table('tb_admin_menu')
            ->select('tb_admin_rel_group.akses')
            ->where('tb_admin_menu.url', 'list_car')
            ->where('tb_admin_menu.deleted_at', null)
            ->where('tb_admin_rel_group.id_group', $sess_id_group)
            ->where('tb_admin_rel_group.deleted_at', null)
            ->join('tb_admin_rel_group', 'tb_admin_menu.id', '=', 'tb_admin_rel_group.id_menu')
            ->get();
            if(count($akses) != 0){
                $akses_temp = array();
                foreach ($akses as $key) {
                    array_push($akses_temp, $key->akses);
                }
                if (in_array('1', $akses_temp)){
                    $data = DB::table('tb_car')
                    ->select('tb_car.*', 'tb_merek.merek')
                    ->where('tb_car.deleted_at', null)
                    ->leftJoin('tb_merek', 'tb_car.id_merek', '=', 'tb_merek.id')
                    ->orderBy('tb_car.id', 'asc')
                    ->get();
                    foreach ($data as $row) {
                        $count_id = DB::table('tb_rent')
                        ->where('id_mobil', $row->id)
                        ->where('dikembalikan', '')
                        ->count();
                        $row->rent = $count_id;
                        $row->created = $row->created_by;
                        if(is_numeric($row->created_by)){
                            $created = DB::table('tb_admin')
                            ->select('tb_admin.username')
                            ->where('tb_admin.id', $row->created_by)
                            ->first();
                            $row->created = $created->username;
                        }
                        $row->updated = $row->updated_by;
                        if(is_numeric($row->updated_by)){
                            $updated = DB::table('tb_admin')
                            ->select('tb_admin.username')
                            ->where('tb_admin.id', $row->updated_by)
                            ->first();
                            $row->updated = $updated->username;
                        }
                    }
                    if($request->ajax()){
                        return datatables()->of($data)->addIndexColumn()->toJson();
                    }
                    return view('admin.car')->with('active_menu', 'Mobil')->with('akses_menu', $akses_temp);
                }else{
                    return view('unauthorized');
                }
            }else{
                return view('unauthorized');
            }
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $sess_id = Session::get('admin.id');
        $sess_username = MA_admin::select('username')->where('id', $sess_id)->first()->username;

        $data = MA_car::create(
            [
                'id_merek'      => $request->merek,
                'model'         => $request->model,
                'no_plat'       => $request->plat,
                'tarif'         => $request->tarif,
                'created_by'    => $sess_id,
                'created_at'    => date('Y-m-d H:i:s')
            ]
        );
        if($data){
            return response()->json([
                'success'   => true,
                'type'      => 'disimpan'
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $data = MA_car::find($id);
        return response()->json([
            'id'        => $data->id,
            'merek'     => $data->id_merek,
            'model'     => $data->model,
            'plat'      => $data->no_plat,
            'tarif'     => $data->tarif
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $sess_id = Session::get('admin.id');
        $sess_username = MA_admin::select('username')->where('id', $sess_id)->first()->username;

        $data = MA_car::find($id);
        $data->id_merek     = $request->merek;
        $data->model        = $request->model;
        $data->no_plat      = $request->plat;
        $data->tarif        = $request->tarif;
        $data->updated_by   = $sess_id;
        $data->updated_at   = date('Y-m-d H:i:s');
        $data->save();

        return response()->json([
            'success'   => true,
            'type'      => 'diupdate'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // $data = MA_car::find($id);
        // $data->delete();
        // return response()->json([
        //     'success'   => true
        // ]);
    }

    public function hapus(Request $request)
    {
        $sess_id = Session::get('admin.id');
        $sess_username = MA_admin::select('username')->where('id', $sess_id)->first()->username;

        $id = $request->id;
        $data = MA_car::find($id);
        $data->deleted_by   = $sess_id;
        $data->deleted_at   = date('Y-m-d H:i:s');
        $data->save();

        return response()->json([
            'success'   => true
        ]);
    }

    public function merek(Request $request){
        $data = DB::table('tb_merek')
        ->select('id', 'merek')
        ->where('deleted_at', null)
        ->orderBy('merek', 'asc')
        ->get();
        if($request->ajax()){
            return response()->json($data);
        }
    }

    public function sewa(Request $request){
        $sess_id = Session::get('admin.id');
        $sess_username = MA_admin::select('username')->where('id', $sess_id)->first()->username;

        $data = MA_rent::create(
            [
                'id_admin'      => $sess_id,
                'id_mobil'      => $request->id_mobil,
                'mulai'         => $request->mulai_sewa,
                'selesai'       => $request->selesai_sewa,
                'tarif'         => $request->tarif_sewa,
                'biaya'         => $request->biaya_sewa,
                'created_by'    => $sess_id,
                'created_at'    => date('Y-m-d H:i:s')
            ]
        );
        if($data){
            return response()->json([
                'success'   => true,
                'type'      => 'disewa'
            ]);
        }
    }
}
