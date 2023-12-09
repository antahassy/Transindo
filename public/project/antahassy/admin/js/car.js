$(document).ready(function(){
    $.ajaxSetup({
        headers     : {
            'X-CSRF-TOKEN'  : $('meta[name="csrf-token"]').attr('content')
        }
    });
    var nama_bulan = new Array();
    nama_bulan[1] = 'Januari';
    nama_bulan[2] = 'Februari';
    nama_bulan[3] = 'Maret';
    nama_bulan[4] = 'April';
    nama_bulan[5] = 'Mei';
    nama_bulan[6] = 'Juni';
    nama_bulan[7] = 'Juli';
    nama_bulan[8] = 'Agustus'; 
    nama_bulan[9] = 'September'; 
    nama_bulan[10] = 'Oktober';
    nama_bulan[11] = 'November'; 
    nama_bulan[12] = 'Desember';
    var table_data = '';
    swal({
        showConfirmButton   : false,
        allowOutsideClick   : false,
        allowEscapeKey      : false,
        background          : 'transparent',
        onOpen  : function(){
            swal.showLoading();
            setTimeout(function(){
                data_merek();
            },500);
        }
    });
    function data_merek(){
        $.ajax({
            type        : 'ajax',
            method      : 'post',
            url         : site + '/list_car/merek',
            dataType    : "json",
            async       : true,
            success: function(data){
                var s_merek = '<option value="">Pilih Merek</option>';
                for(i = 0; i < data.length; i ++){
                    s_merek += '<option value="' + data[i].id + '">' + data[i].merek + '</option>';
                }
                $('#merek').html(s_merek);
                setTimeout(function(){
                    data_table();
                },500);
            },
            error: function (){
                swal({
                    background  : 'transparent',
                    html        : '<pre>Koneksi terputus' + '<br>' + 
                                  'Cobalah beberapa saat lagi</pre>',
                    type        : "warning"
                });
            }
        });
    }
    function main(){
        $('#mulai_sewa, #selesai_sewa').datepicker({
            minDate: new Date(),
            yearRange : '-1:+1',
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy-mm-dd',
            dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
            dayNamesMin: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
            monthNamesShort: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            beforeShow: function() {
                $(document).off('focusin.bs.modal');
            },
            onClose: function(){
                $(document).on('focusin.bs.modal');
            }
        });
        $('#tarif').on('keyup', function(){
            $(this).val(function(index, value) {
                return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            });
        });
        var modal_form;
        $('#modal_form').on('show.bs.modal', function(){
            $(this).addClass('zoomIn');
            modal_form = true;
        });
        $('#modal_form').on('hide.bs.modal', function(){
            if(modal_form){
                $(this).removeClass('zoomIn').addClass('zoomOut');
                modal_form = false;
                setTimeout(function(){
                    $('#modal_form').modal('hide');
                },350);
                return false;
            }
            $(this).removeClass('zoomOut');
        });
        var modal_sewa;
        $('#modal_sewa').on('show.bs.modal', function(){
            $(this).addClass('zoomIn');
            modal_sewa = true;
        });
        $('#modal_sewa').on('hide.bs.modal', function(){
            if(modal_sewa){
                $(this).removeClass('zoomIn').addClass('zoomOut');
                modal_sewa = false;
                setTimeout(function(){
                    $('#modal_sewa').modal('hide');
                },350);
                return false;
            }
            $(this).removeClass('zoomOut');
        });
        $('#btn_add').on('click', function(){
            swal({
                showConfirmButton   : false,
                allowOutsideClick   : false,
                allowEscapeKey      : false,
                background          : 'transparent',
                onOpen  : function(){
                    swal.showLoading();
                    setTimeout(function(){
                        $('#form_data')[0].reset();
                        $('#url').attr('readonly', false).css({'background':'transparent','color':'#3F4254'});
                        $('#modal_form').find('.modal-title').text('Tambah');
                        $('#btn_process').text('Simpan');
                        $('#form_data').attr('method', 'post');
                        $('#_method').val('post');
                        $('#form_data').attr('action', site + '/list_car');
                        swal.close();
                        $('#modal_form').modal('show');
                        data_process();
                    },500);
                }
            });
        });
        $('#table_data').on('click', '.btn_edit', function(){
            var action_data = table_data.row($(this).parents('tr')).data();
            swal({
                showConfirmButton   : false,
                allowOutsideClick   : false,
                allowEscapeKey      : false,
                background          : 'transparent',
                onOpen  : function(){
                    swal.showLoading();
                    setTimeout(function(){
                        $.ajax({
                            type           : 'ajax',
                            method         : 'get',
                            url            : site + '/list_car/' + action_data.id + '/edit',
                            async          : true,
                            dataType       : 'json',
                            success        : function(data){
                                $('#form_data')[0].reset();
                                $('#merek').val(data.merek);
                                $('#model').val(data.model);
                                $('#plat').val(data.plat);
                                $('#tarif').val(data.tarif);

                                $('#modal_form').find('.modal-title').text('Edit');
                                $('#btn_process').text('Update');
                                $('#form_data').attr('method', 'post');
                                $('#_method').val('put');
                                $('#form_data').attr('action', site + '/list_car/' + data.id);
                                swal.close();
                                $('#modal_form').modal('show');
                                data_process();
                            },
                            error   : function(){
                                swal({
                                    background  : 'transparent',
                                    html        : '<pre>Koneksi terputus' + '<br>' + 
                                                  'Cobalah beberapa saat lagi</pre>',
                                    type        : "warning"
                                });
                            }
                        });
                    },500);
                }
            });     
        });
        $('#table_data').on('click', '.btn_sewa', function(){
            var data_mobil = table_data.row($(this).parents('tr')).data();
            $('#form_sewa')[0].reset();
            $('#id_mobil').val(data_mobil.id);
            $('#merek_sewa').val(data_mobil.merek);
            $('#model_sewa').val(data_mobil.model);
            $('#no_plat_sewa').val(data_mobil.no_plat);
            $('#tarif_sewa').val(data_mobil.tarif);
            $('#selesai_sewa').on('change', function(){
                if($('#mulai_sewa').val() != ''){
                    var sehari = 1000 * 60 * 60 * 24;
                    var start = new Date($('#mulai_sewa').val());
                    var end = new Date($('#selesai_sewa').val());;
                    const day_length = Math.round(Math.abs((start - end) / sehari));
                    var biaya_sewa = day_length * data_mobil.tarif.replace(".", "");
                    $('#biaya_sewa').val(Number(biaya_sewa).toLocaleString('de'));
                }
            });
            $('#mulai_sewa').on('change', function(){
                if($('#selesai_sewa').val() != ''){
                    var sehari = 1000 * 60 * 60 * 24;
                    var start = new Date($('#mulai_sewa').val());
                    var end = new Date($('#selesai_sewa').val());;
                    const day_length = Math.round(Math.abs((start - end) / sehari));
                    var biaya_sewa = day_length * data_mobil.tarif.replace(".", "");
                    $('#biaya_sewa').val(Number(biaya_sewa).toLocaleString('de'));
                }
            });
            $('#modal_sewa').find('.modal-title').text('Sewa Mobil');
            $('#btn_process_sewa').text('Proses');
            $('#form_sewa').attr('method', 'post');
            $('#_method_sewa').val('post');
            $('#form_sewa').attr('action', site + '/list_car/sewa');
            $('#modal_sewa').modal('show');
            sewa_process();
        });
        $('#table_data').on('click', '.btn_delete', function(){
            var action_data = table_data.row($(this).parents('tr')).data();
            swal({
                html                : '<pre>Hapus data ini ?</pre>',
                type                : "question",
                background          : 'transparent',
                showCancelButton    : true,
                cancelButtonText    : 'Tidak',
                confirmButtonText   : 'Ya'
            }).then((result) => {
                if(result.value){
                    swal({
                        showConfirmButton   : false,
                        allowOutsideClick   : false,
                        allowEscapeKey      : false,
                        background          : 'transparent',
                        onOpen  : function(){
                            swal.showLoading();
                            setTimeout(function(){
                                $.ajax({
                                    type        : 'ajax',
                                    method      : 'post',
                                    data        : {id : action_data.id},
                                    url         : site + '/list_car/hapus',
                                    dataType    : "json",
                                    async       : true,
                                    success   : function(response){
                                        if(response.success){
                                            swal({
                                                html                : '<pre>Data berhasil dihapus</pre>',
                                                type                : "success",
                                                background          : 'transparent',
                                                allowOutsideClick   : false,
                                                allowEscapeKey      : false, 
                                                showConfirmButton   : false,
                                                timer               : 1000
                                            }).then(function(){
                                                setTimeout(function(){
                                                    table_data.ajax.reload();
                                                },500);
                                            });
                                        }
                                    },
                                    error          : function(){
                                        swal({
                                            background  : 'transparent',
                                            html        : '<pre>Koneksi terputus' + '<br>' +
                                                          'Cobalah beberapa saat lagi</pre>',
                                            type        : "warning"
                                        });
                                    }
                                });
                            },500);
                        }
                    });
                }
            });
        });
    }
    function sewa_process(){
        $('#btn_process_sewa').on('click', function(event){
            event.preventDefault();
            event.stopImmediatePropagation();
            var ajax_method     = $('#form_sewa').attr('method');
            var ajax_url        = $('#form_sewa').attr('action');
            var form_data       = $('#form_sewa')[0];
            form_data           = new FormData(form_data);
            var errormessage    = '';
            if(! $('#id_mobil').val()){
                errormessage += 'Kendaraan dibutuhkan \n';
           }
            if(! $('#merek_sewa').val()){
                 errormessage += 'Merek dibutuhkan \n';
            }
            if(! $('#model_sewa').val()){
                errormessage += 'Model dibutuhkan \n';
            }
            if(! $('#no_plat_sewa').val()){
                errormessage += 'No. plat dibutuhkan \n';
            }
            if(! $('#tarif_sewa').val()){
                errormessage += 'Tarif harian dibutuhkan \n';
            }
            if(! $('#mulai_sewa').val()){
                errormessage += 'Tanggal mulai dibutuhkan \n';
            }
            if(! $('#selesai_sewa').val()){
                errormessage += 'Tanggal selesai dibutuhkan \n';
            }
            if(! $('#biaya_sewa').val()){
                errormessage += 'Biaya sewa dibutuhkan \n';
            }
            if(errormessage !== ''){
                swal({
                    background  : 'transparent',
                    html        : '<pre>' + errormessage + '</pre>'
                });
            }else{
                swal({
                    background          : 'transparent',
                    html                : '<pre>Apakah data sudah benar ?</pre>',
                    type                : 'question',
                    showCancelButton    : true,
                    cancelButtonText    : 'Tidak',
                    confirmButtonText   : 'Ya'
                }).then((result) => {
                    if(result.value){
                        swal({
                            showConfirmButton   : false,
                            allowOutsideClick   : false,
                            allowEscapeKey      : false,
                            background          : 'transparent',
                            onOpen  : function(){
                                swal.showLoading();
                                setTimeout(function(){
                                    $.ajax({
                                        type           : 'ajax',
                                        method         : ajax_method,
                                        url            : ajax_url,
                                        data           : form_data,
                                        async          : true,
                                        processData    : false,
                                        contentType    : false,
                                        cache          : false,
                                        dataType       : 'json',
                                        success        : function(response){
                                            if(response.success){
                                                $('#modal_sewa').modal('hide');
                                                $('#form_sewa')[0].reset();
                                                swal({
                                                    html                : '<pre>Kendaraan berhasil ' + response.type + '<br>' + 
                                                                          'Silahkan cek menu daftar sewa</pre>',
                                                    type                : "success",
                                                    background          : 'transparent'
                                                });
                                            }
                                        },
                                        error   : function(){
                                            swal({
                                                background  : 'transparent',
                                                html        : '<pre>Koneksi terputus' + '<br>' + 
                                                              'Cobalah beberapa saat lagi</pre>',
                                                type        : "warning"
                                            });
                                        }
                                    });
                                },500);
                            }
                        });     
                    }
                });
            }
            return false;
        });
    }
    function data_process(){
        $('#btn_process').on('click', function(event){
            event.preventDefault();
            event.stopImmediatePropagation();
            var ajax_method     = $('#form_data').attr('method');
            var ajax_url        = $('#form_data').attr('action');
            var form_data       = $('#form_data')[0];
            form_data           = new FormData(form_data);
            var errormessage    = '';
            if(! $('#merek').val()){
                 errormessage += 'Merek dibutuhkan \n';
            }
            if(! $('#model').val()){
                errormessage += 'Model dibutuhkan \n';
            }
            if(! $('#plat').val()){
                errormessage += 'No. plat dibutuhkan \n';
            }
            if(! $('#tarif').val()){
                errormessage += 'Tarif harian dibutuhkan \n';
            }
            if(errormessage !== ''){
                swal({
                    background  : 'transparent',
                    html        : '<pre>' + errormessage + '</pre>'
                });
            }else{
                swal({
                    background          : 'transparent',
                    html                : '<pre>Apakah data sudah benar ?</pre>',
                    type                : 'question',
                    showCancelButton    : true,
                    cancelButtonText    : 'Tidak',
                    confirmButtonText   : 'Ya'
                }).then((result) => {
                    if(result.value){
                        swal({
                            showConfirmButton   : false,
                            allowOutsideClick   : false,
                            allowEscapeKey      : false,
                            background          : 'transparent',
                            onOpen  : function(){
                                swal.showLoading();
                                setTimeout(function(){
                                    $.ajax({
                                        type           : 'ajax',
                                        method         : ajax_method,
                                        url            : ajax_url,
                                        data           : form_data,
                                        async          : true,
                                        processData    : false,
                                        contentType    : false,
                                        cache          : false,
                                        dataType       : 'json',
                                        success        : function(response){
                                            if(response.success){
                                                $('#modal_form').modal('hide');
                                                $('#form_data')[0].reset();
                                                swal({
                                                    html                : '<pre>Data berhasil ' + response.type + '</pre>',
                                                    type                : "success",
                                                    background          : 'transparent',
                                                    allowOutsideClick   : false,
                                                    allowEscapeKey      : false, 
                                                    showConfirmButton   : false,
                                                    timer               : 1000
                                                }).then(function(){
                                                    setTimeout(function(){
                                                        table_data.ajax.reload();
                                                    },500);
                                                });
                                            }
                                        },
                                        error   : function(){
                                            swal({
                                                background  : 'transparent',
                                                html        : '<pre>Koneksi terputus' + '<br>' + 
                                                              'Cobalah beberapa saat lagi</pre>',
                                                type        : "warning"
                                            });
                                        }
                                    });
                                },500);
                            }
                        });     
                    }
                });
            }
            return false;
        });
    }
    function data_table(){
        table_data = $('#table_data').DataTable({
            lengthMenu          : [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
            processing          : true, 
            destroy             : true,
            serverSide          : true, 
            scrollX             : true,
            scrollCollapse      : true,
            fixedColumns        : true, 
            initComplete: function(){
                swal.close();
                main();
            },
            ajax            : {
                url         : site + '/list_car',
                method      : 'get'
            },
            columns             : [
                {data   : 'DT_RowIndex'},
                {data   : 'merek'},
                {data   : 'model'},
                {data   : 'no_plat'},
                {data   : 'tarif'},
                {
                    data           : 'dikembalikan',
                     render         : (data, type, row) => {
                         if(row.rent == 0){
                             if(hak_akses.includes(3)){
                                 return '<button data="' + row.id + '" title="' + row.dikembalikan + '" class="btn btn-sm btn-rounded btn-outline-primary btn_sewa">Sewa</button>';
                             }else{
                                 return 'Sewa';
                             }
                         }else{
                             if(hak_akses.includes(3)){
                                 return '<button data="' + row.id + '" title="' + row.dikembalikan + '" class="btn btn-sm btn-rounded btn-danger disabled">Dipakai</button>';
                             }else{
                                 return 'Dipakai';
                             }
                             
                         }
                     }
                 },
                {defaultContent: '',
                        render: function(data, type, row){
                            if(hak_akses.includes(3) && hak_akses.includes(4)){
                                return '<button class="btn btn-sm btn-outline-success btn_edit" style="margin: 2.5px;">Edit</button>' + '<button class="btn btn-sm btn-outline-danger btn_delete" style="margin: 2.5px;">Hapus</button>';
                            }
                            if(! hak_akses.includes(3) && hak_akses.includes(4)){
                                return '<button class="btn btn-sm btn-outline-danger btn_delete" style="margin: 2.5px;">Hapus</button>';
                            }
                            if(hak_akses.includes(3) && ! hak_akses.includes(4)){
                                return '<button class="btn btn-sm btn-outline-success btn_edit" style="margin: 2.5px;">Edit</button>';
                            }else{
                                return '';
                            }
                        }
                },
                {data 	: 'created_at',
                       render: function(data, type, row){
                        var time = row.created_at.split(' ');
                        return time[0].split('-')[2] + '/' + nama_bulan[Number(time[0].split('-')[1])] + '/' + time[0].split('-')[0] + '<br>' + time[1] + '<br>' + row.created; 
                    }
                   },
                   {data 	: 'updated_at',
                       render: function(data, type, row){
                           if(row.updated_at != null){
                               var time = row.updated_at.split(' ');
                            return time[0].split('-')[2] + '/' + nama_bulan[Number(time[0].split('-')[1])] + '/' + time[0].split('-')[0] + '<br>' + time[1] + '<br>' + row.updated; 
                           }else{
                               return '';
                           }
                    }
                   }
            ]
        });
    }
});