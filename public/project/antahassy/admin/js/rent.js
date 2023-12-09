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
                data_table();
            },500);
        }
    });
    function main(){
        $('#table_data').on('click', '.btn_edit', function(){
            var id = $(this).attr('data');
            var link_url = '/list_rent/kembalikan';
            swal({
                html                : '<pre>Kembalikan kendaraan ?</pre>',
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
                                    data        : {id : id},
                                    url         : link_url,
                                    dataType    : "json",
                                    async       : true,
                                    success: function(response){
                                        if(response.success){
                                            swal.close();
                                            setTimeout(function(){
                                                table_data.ajax.reload();
                                            },500);
                                        }
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
                            },500);
                        }
                    });
                }
            });
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
                url         : site + '/list_rent',
                method      : 'get'
            },
            columns             : [
                {data   : 'DT_RowIndex'},
                {data   : 'merek'},
                {data   : 'model'},
                {data   : 'no_plat'},
                {data 	: 'mulai',
                       render: function(data, type, row){
                        var dts = row.mulai.split('-');
                        return dts[2] + '/' + nama_bulan[Number(dts[1])] + '/' + dts[0]; 
                    }
                },
                {data 	: 'selesai',
                       render: function(data, type, row){
                        var dts = row.selesai.split('-');
                        return dts[2] + '/' + nama_bulan[Number(dts[1])] + '/' + dts[0]; 
                    }
                },
                {data   : 'tarif'},
                {data   : 'biaya'},
                {defaultContent: '',
                        render: function(data, type, row){
                            if(row.dikembalikan == ''){
                                return '<button class="btn btn-sm btn-outline-success btn_edit" data="' + row.id + '" style="margin: 2.5px;">Kembalikan</button>';
                            }else{
                                var time = row.dikembalikan.split(' ');
                                return time[0].split('-')[2] + '/' + nama_bulan[Number(time[0].split('-')[1])] + '/' + time[0].split('-')[0] + '<br>' + time[1]
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