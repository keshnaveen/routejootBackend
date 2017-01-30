$(document).ready(function(){
    $('.img-width').css('height',$(window).height());
    $(window).resize(function(){
        $('.img-width').css('height',$(window).height());
    });
    toastr.options = {
  		  "closeButton": true,
  		  "debug": true,
  		  "newestOnTop": true,
  		  "progressBar": false,
  		  "positionClass": "toast-top-full-width",
  		  "preventDuplicates": true,
  		  "showDuration": "300",
  		  "hideDuration": "1000",
  		  "timeOut": "100000",
  		  "extendedTimeOut": "1000",
  		  "showEasing": "swing",
  		  "hideEasing": "linear",
  		  "showMethod": "fadeIn",
  		  "hideMethod": "fadeOut"
  		}
});



var url = window.location.href.slice(window.location.href.indexOf('=') + 1);
var user_id = url;

// Validation for reset password
function validateFields(e) {
           var opvalid = false;
           var evalid = false;
           var npvalid = false;
           var isvalid = false;


           var pattern1 = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
           var pattern2 = /^.{6,}$/;
           var n_pswd = $('#new_pwd').val();
           var c_pswd = $('#cnfrm_pwd').val();

           if (n_pswd == "") {
               $('#OldPwdError').removeClass('hide');
               $('#OldPwdError1').addClass('hide');
               opvalid = false;
           }
           else if (!pattern2.test(n_pswd )){
                $('#OldPwdError1').removeClass('hide');
                $('#OldPwdError').addClass('hide');
               opvalid = false;
           }
           else {
               $('#OldPwdError').addClass('hide');
               $('#OldPwdError1').addClass('hide');
               opvalid = true;
            }

            if (c_pswd == "") {
                $('#NewPwdError').removeClass('hide');
                $('#NewPwdError1').addClass('hide');
                npvalid = false;
            }
            else if (!pattern2.test(c_pswd ) && c_pswd != n_pswd)
            {
                 $('#NewPwdError1').removeClass('hide');
                 $('#NewPwdError').addClass('hide');
                npvalid = false;
            }
            else {
                $('#NewPwdError').addClass('hide');
                $('#NewPwdError1').addClass('hide');
                npvalid = true;
             }

             if (npvalid == true && opvalid == true) {
                    isvalid = true;
                    var reqUrl = app.serviceUrl+'/api/changePassword';
                    $.ajax({
	                 url : reqUrl,
	                 type: "post",
	                 dataType: "json",
	                 data: {
	                    '_id' : user_id,
	                    'new_password': n_pswd},
	                 cache: false,
	                 success: function(res) {
	                     if(res.result==0)
	                    	 toastr["success"]("Your Routejoot account password is resetted successfully.","Success");
	                     else
	                    	 toastr["error"]("Sorry for the inconvenience !!!! but we're performing some maintenance at the moment. If needed you can always contact our Customer Service.","Error")
	                 },
	                 error: function(err) {
	                     console.log(err);
	                     toastr["error"]("Sorry for the inconvenience !!!!but we're performing some maintenance at the moment. If needed you can always contact our Customer Service.","Error");
	                 }
	               });
              }
                 else
                	 return false;
                 }
