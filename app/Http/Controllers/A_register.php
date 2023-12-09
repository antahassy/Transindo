<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use \App\Models\MA_admin;

class A_register extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(! Session::get('admin.id')) {
            return view('admin.register');
        }else{
            return Redirect('admin_dashboard');
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
        $cek_akun = MA_admin::select('id')->where('username', $request->username)->first();
        if($cek_akun != ''){
            return response()->json([
                'account'   => true
            ]);
        }else{
            $data = MA_admin::create(
                [
                    'username'      => $request->username,
                    'password'      => Hash::make($request->password),
                    'nama'          => $request->nama,
                    'alamat'        => $request->alamat,
                    'phone'         => $request->telepon,
                    'sim'           => $request->sim,
                    'created_by'    => $request->username,
                    'created_at'    => date('Y-m-d H:i:s')
                ]
            );
            if($data){
                $sess = MA_admin::where("username", $request->username)->first();
                $group = DB::table('tb_admin_group_2')->insert([
                    'id_admin'      => $sess->id,
                    'id_group'      => '2',
                    'created_by'    => $sess->id,
                    'created_at'    => date('Y-m-d H:i:s')
                ]);
                if($group){
                    $request->session()->put("admin.id", $sess->id);
                    return response()->json([
                        'success'   => true
                    ]);
                }
            }
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
