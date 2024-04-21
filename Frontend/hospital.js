var app = angular.module("myApp", ['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) { 
	$stateProvider
		.state('Home', {
            url: '/home',
			templateUrl: 'HomePage.html',
			controller: 'HomePageController'
		})
        .state('Register', {
            url: '/register',
			templateUrl: 'Register.html',
			controller: 'RegisterController'
		})
		.state('Login', {
            url: '/login',
			templateUrl: 'login.html',
			controller: 'LogInController'
		})
		.state('DoctorRegisteration', {
            url: '/Doctorreg',
			templateUrl: 'DoctorReg.html',
			controller: 'DocLogInController'
		})
		.state('Dashboard', {
            url: '/dashboard',
			templateUrl: 'dashboard.html',
			controller: 'DashboardController'
		})
		.state('Dashboard.Appointment', {
			url: '/appointment',
			templateUrl: 'appoint.html',
			controller: 'AppointmentController'
		})
		.state('Dashboard.Personal', {
			url: '/personal',
			templateUrl: 'personinfo.html',
			controller: 'PersonalController'
		})
		.state('Receptionist', {
            url: '/reception',
			templateUrl: 'registrar.html',
			controller: 'ReceptionistController'
		})
		.state('Dashboard.Records', {
            url: '/records',
			templateUrl: 'records.html',
			controller: 'RecordsController'
		})
		.state('Dashboard.Prescription', {
            url: '/doctprescriptions',
			templateUrl: 'prescription.html',
			controller: 'PrescriptionsController'
		})
		.state('Dashboard.History', {
            url: '/medicalhistory',
			templateUrl: 'medicalhistory.html',
			controller: 'MedicalController'
		})
		.state('Dashboard.Receipt', {
			url: '/receipt',
			templateUrl: 'payment.html',
			controller: 'PaymentController'
		})
		.state('Dashboard.Rejection', {
			url: '/rejection',
			templateUrl: 'rejection.html',
			controller: 'RejectionController'
		})
		.state('RecepDashboard', {
            url: '/recepdashboard',
			templateUrl: 'receptionistdash.html',
			controller: 'RecepDashboardController'
		})
		.state('RecepDashboard.Doctor', {
            url: '/recepdashboarddoctor',
			templateUrl: 'receptiondoctor.html',
			controller: 'RecepDoctorController'
		})
		.state('RecepDashboard.Appointment', {
            url: '/recepdashboardappoint',
			templateUrl: 'receptionapp.html',
			controller: 'RecepAppointController'
		})
		.state('RecepDashboard.Record', {
            url: '/recepdashboardrecord',
			templateUrl: 'receptionistrecord.html',
			controller: 'RecepRecordController'
		})
		.state('RecepDashboard.Patient', {
            url: '/recepdashboardpatient',
			templateUrl: 'recepdoctorpatient.html',
			controller: 'RecepPatientController'
		})
		.state('DoctorDashboard', {
            url: '/doctordashboard',
			templateUrl: 'doctordashboard.html',
			controller: 'DoctorDashboardController'
		})
		.state('DoctorDashboard.DoctPersonal', {
            url: '/doctpersonal',
			templateUrl: 'doctinfo.html',
			controller: 'DoctPersonalController'
		})
		.state('DoctorDashboard.DoctAppoint', {
            url: '/doctappoint',
			templateUrl: 'doctappoint.html',
			controller: 'DoctAppointController'
		})
		.state('DoctorDashboard.DoctRecord', {
            url: '/doctrecord',
			templateUrl: 'DoctRecord.html',
			controller: 'DoctRecordController'
		})
		.state('DoctorDashboard.CheckedPatient', {
            url: '/doctcheckedpatient',
			templateUrl: 'doctcheckedpat.html',
			controller: 'DoctCheckedPatientController'
		})
		
		$urlRouterProvider.otherwise('/home');
		

}]);

var api = 'https://127.0.0.1:8000/healthcare/'

app.controller('RegisterController',function($scope,$http,$window,$state){

	$scope.validatePassword = function(){
		$scope.passwordMismatch = $scope.password !== $scope.confpassword;
	  }

	  $scope.validateEmail = function () {
		// Regular expression for email validation
		var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		if (emailPattern.test($scope.email)) {
			$scope.emailIsValid = true;
		} else {
			$scope.emailIsValid = false;
		}
	};


	 $scope.register = function(){
		var pass = $scope.password;
		var confpass = $scope.confpassword;
		var validemail = $scope.emailIsValid

		var regdata = {
            first_name: $scope.firstname,
            last_name : $scope.lastname,
            password : $scope.password,
            // confirmpassword : $scope.confpassword
			email : $scope.email,
			username : $scope.username,
			age : $scope.age,
			gender : $scope.gender,
			contact : $scope.contact,
			address : $scope.address,
		};
		console.log(regdata);

		if(pass == confpass && validemail){
			
			$http.post(api+'registeruser/', regdata, {
			headers: {'Content-Type': undefined},
		    withCredentials: true
		})
          .then(function(response){
            
            console.log(response.data)
			Swal.fire({
				icon: 'success',
				title: 'Completed...',
				text: response.data.message
			 } )
			$state.go('Login');
		  })
		  .catch(function(error){
			Swal.fire({
				icon: 'error',
				title: 'Error...',
				text: error.data.message
			  })
		  })
		}
		else{
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Incorrect password or invalid email'
			  })
			LoadingService.stopLoading();
		}

	 } 
});

app.controller('HomePageController',function($scope,$http,$window,$state){
	$scope.total = []; 
	 
	$http.get(api + 'mapdata/', {
		// withCredentials:true
	})
	.then(function(response){
		console.log(response.data)
		var data = response.data;
        var totalDoctor = data.total_doctor;
        var totalPatient = data.total_patient;
        var totalDepartments = data.total_departments;
        var totalAppointments = data.total_appointments;

		const xValues = ["Doctor", "Patient", "Appointment", "Department"];
		const yValues = [totalDoctor, totalPatient, totalAppointments, totalDepartments];
		const barColors = ["red", "green","blue","orange"];

		new Chart("myChart", {
			type: "bar",
			data: {
			  labels: xValues,
			  datasets: [{
				backgroundColor: barColors,
				data: yValues
			  }]
			},
			options: {
			  legend: {display: false},
			  title: {
				display: true,
				text: "Hospital Data"
			  }
			}
		  });

    //   PIE CHART

		  var options = {
			series: yValues,
			chart: {
			width: 380,
			type: 'donut',
			dropShadow: {
			  enabled: true,
			  color: '#111',
			  top: -1,
			  left: 3,
			  blur: 3,
			  opacity: 0.2
			}
		  },
		  stroke: {
			width: 0,
		  },
		  plotOptions: {
			pie: {
			  donut: {
				labels: {
				  show: true,
				  total: {
					showAlways: true,
					show: true
				  }
				}
			  }
			}
		  },
		  labels: xValues,
		  dataLabels: {
			dropShadow: {
			  blur: 3,
			  opacity: 0.8
			}
		  },
		  fill: {
		  type: 'pattern',
			opacity: 1,
			pattern: {
			  enabled: true,
			  style: ['verticalLines', 'squares', 'horizontalLines', 'circles','slantedLines'],
			},
		  },
		  states: {
			hover: {
			  filter: 'none'
			}
		  },
		  theme: {
			palette: 'palette2'
		  },
		  title: {
			text: "Hospital Data"
		  },
		  responsive: [{
			breakpoint: 480,
			options: {
			  chart: {
				width: 200
			  },
			  legend: {
				position: 'bottom'
			  }
			}
		  }]
		  };

		  var chart = new ApexCharts(document.querySelector("#chart"), options);
		  chart.render();



    })
	.catch(function(error){
		console.log(error)
	})

})
	
app.controller('LogInController',function($scope,$http,$window,$state){
	$scope.LoginForm = function(){
        
		console.log('Username : ', $scope.username)
		console.log('Pass :', $scope.password)
	}
	$scope.login = function(){
		var data = {
			username : $scope.username,
			password : $scope.password
	}
	if($scope.password && $scope.username)
	{
	$http.post(api+'login/', data, {
		    withCredentials: true
     })
	 .then(function(response){
		
		console.log(response.data)

		var msg = response.data.role
		console.log(msg)

		if(msg === 'Receptionist'){
			$state.go('RecepDashboard.Doctor')
		}
		else if(msg === 'Doctor') 
        {
		    $state.go('DoctorDashboard.DoctPersonal');
		}
		else {
			$state.go('Dashboard.Personal')
		}

	  })
	  .catch(function(error){
		Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.data.message
			  })
	  })
	}
	else{
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Fields are Empty.'
		  })
	}
}
});

app.controller('DocLogInController',function($scope,$http,$window,$state){
	console.log("Hit")
		$http.get(api+'departdrop/', {
			withCredentials : true
		})
		.then(function(response){
			console.log(response)
			$scope.departs = response.data;
			console.log($scope.departs)
		})
		.catch(function(error){
			console.log(error)
		})

	$scope.validatePassword = function(){
		$scope.passwordMismatch = $scope.password !== $scope.confpassword;
	  }

	  $scope.validateEmail = function () {
		// Regular expression for email validation
		var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		if(emailPattern.test($scope.email)) {
			$scope.emailIsValid = true;
		} else {
			$scope.emailIsValid = false;
		}
	};


	 $scope.Docregister = function(){
		var pass = $scope.password;
		var confpass = $scope.confpassword;
		var validemail = $scope.emailIsValid


		var regdata = {
            first_name: $scope.firstname,
            last_name : $scope.lastname,
            password : $scope.password,
			email : $scope.email,
			username : $scope.username,
			age : $scope.age,
			gender : $scope.gender,
			contact : $scope.contact,
			address : $scope.address,
			qualification : $scope.qualification,
			department_id : $scope.department,
			doctorFee : $scope.fees
		};
		console.log(regdata);

		if(pass == confpass && validemail){
			
			$http.post(api+'registerdoctor/', regdata, {
			headers: {'Content-Type': undefined},
		    withCredentials: true
		})
          .then(function(response){
            
            console.log(response.data)
			Swal.fire(
				'Congratulations!',
				'You are logged in!',
				'success'
			  )
			$state.go('Login');
		  })
		  .catch(function(error){
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.data.message
			  })
		})
		}
		else{
			// $window.alert('Incorrect Password');
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Incorrect password or Email'
			  })
		}

	 } 
});

                            //*****  PATIENT  ****//

app.controller('AppointmentController',function($scope,$http,$window,$state){

	$scope.depart = [];

	$scope.updateDate = function () {
        var selectedDate = $scope.date;
        if (selectedDate) {
            var year = selectedDate.getFullYear();
            var month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            var day = selectedDate.getDate().toString().padStart(2, '0');
            $scope.date = year + '-' + month + '-' + day;
        } else {
            $scope.date = null;
        }
    };
	  

	$http.get(api+'departdrop/', {
		withCredentials : true
	})
	.then(function(response){
		console.log(response)
		$scope.departs = response.data;
		console.log($scope.departs)
		$scope.categories = [];


		var ids = $scope.selectdeapart;

		$scope.selectdeapart = function(depart){
        console.log(depart.id)
		var Params = {department_id : depart.id}
		$http.get(api+'doctordrop/', {params : Params}, {
			withCredentials:true
		})
		.then(function(response){
			console.log(response)
			$scope.categories = response.data;
			console.log($scope.categories);
		})
	}
	    $scope.slots = [];

	    $scope.selectcat = function(category){
			$http.get(api + 'slots/', {params : {doctor_id : category.pk} , 
			withCredentials:true})
		
		.then(function(response){
			$scope.slots = response.data;
			console.log(response.data)
		}
		)
	}
		})
		.catch(function(error){
			console.log(error)
	})

	$scope.appoint = function(){

		$scope.loader = true;
        console.log($scope.selectdepartment)
		console.log($scope.selectcategory)
		var appointdata = {
			appointmentDate : $scope.date,
			department_id : $scope.selectdepartment,
			doctor_id : $scope.selectcategory,
			symptoms : $scope.symptoms,
			payment_status : $scope.payment,
			time : $scope.time
		}
		console.log(appointdata)
		$http.post(api+'bookappointment/', appointdata, {
			withCredentials : true
		})
		.then(function(response){
			$scope.loader = false;
          console.log(response)
		  Swal.fire({
			icon: 'success',
			title: 'Congratulations',
			text: response.data.message
		  })
		})
		.catch(function(error){
			console.log(error)
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.data.message
			  })
		})
	}
	
	})

app.controller('PersonalController',function($scope,$http,$window,$state){
});

app.controller('DashboardController',function($scope,$http,$window,$state){

	$scope.patients = [];
	$scope.patient = [];
	$scope.dashboards = [];

	$http.get(api + 'getpanel/', {
		withCredentials:true
	})
	.then(function(response){
		console.log(response);
		$scope.dashboards = response.data
		console.log($scope.dashboards)
		// console.log($scope.patient[0].first_name)

   })
   .catch(function(error){
	   Swal.fire({
		   icon: 'error',
		   title: 'Oops...',
		   text: 'Something went wrong..'
		 })
   })


	$http.get(api+'getpatient/', {
		withCredentials: true
	})
	.then(function(response){
         console.log(response);
		 $scope.patient = response.data
		 console.log($scope.patient)
	})
	.catch(function(error){
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: error.data.message
		  })
	})

	$scope.logout = function(){
		$http.get(api+'logout/',{
			withCredentials: true
		})
		.then(function(response){
			console.log(response);
			Swal.fire({
				icon: 'success',
				title: response.statusText,
				text: response.data.message
			  })
			$state.go('Login')
		})
		.catch(function(error){
			console.log(error);
		})
	}

	
});

app.controller('RecordsController',function($scope,$http,$window,$state,$sce){
		$scope.record = [];

		$http.get(api+'getprappoint/' , {
			withCredentials	: true
		})
		.then(function(response){
			console.log(response);
			$scope.record = response.data
			console.log($scope.record)
			console.log(response.data.pk)
		})
		.catch(function(error){
			console.log(error)
		})

		$scope.exportToExcel = function () {
			const table = document.getElementById('exportTable');

			const doc = document.createElement('table');
			doc.innerHTML = table.outerHTML;

			const blob = new Blob(['\ufeff', doc.outerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

			const url = window.URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'Records.xlsx';
			document.body.appendChild(a);
			a.click();

			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		};

       $scope.view = function(patient){
		$scope.pdf = [];
          var data = { appointment_id: patient.pk };
          console.log(data);
          $http.get(api + 'generatepdf/', {
              params: data,
          	headers: {'Content-Type': undefined},
              withCredentials: true
          })
          .then(function(response) {
              console.log(response);
              $scope.pdf = response.data;
          	$scope.show = function() {
          
          		$scope.htmlContent = $sce.trustAsHtml($scope.pdf);
        	}
          })
          .catch(function(error) {
              console.log(error);
          });
    
    $scope.download = function() {
		const printContent = document.getElementById("pdfdownload");
    //         const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0','_blank');
    //         WindowPrt.document.write(printContent.innerHTML);
    //         WindowPrt.document.close();
    //         WindowPrt.focus();
    //         WindowPrt.print();
    //         WindowPrt.close();
	const blob = new Blob([printContent.innerHTML], { type: "text/html" });

			  const url = URL.createObjectURL(blob);
		  
			  const newTab = window.open(url, "_blank");
		  
			  newTab.focus();
			  newTab.print();
	}
  }
});

app.controller('RejectionController',function($scope,$http,$window,$state){
	$scope.reject = [];
	$http.get(api + 'rejectedappoint/', {
		withCredentials:true
	})
	.then(function(response){
		console.log(response.data)
		$scope.reject = response.data
	})
	.catch(function(error){
		console.log(error)
	})
});

                              //*****  DOCTOR  ****//

app.controller('DoctorDashboardController',function($scope,$http,$window,$state){
	$scope.panel=[];
	$http.get(api + 'getpanel/', {
		withCredentials:true
	})
	.then(function(response){
		console.log(response)
		$scope.panel = response.data
	})

	$scope.logout = function(){
		// var id = $scope.patient_id
		$http.get(api+'logout/',{
			withCredentials: true
		})
		.then(function(response){
			console.log(response);
			Swal.fire({
				icon: 'success',
				title: response.statusText,
				text: response.data.message
			  })
			$state.go('Login')
		})
		.catch(function(error){
			console.log(error);
		})
	}

});

app.controller('DoctPersonalController',function($scope,$http,$window,$state){

	$scope.doctinfo = [];
	$http.get(api + 'doctorinfo/', {
		withCredentials	: true
	})
	.then(function(response){
		console.log(response);
		$scope.doctinfo = response.data
		console.log($scope.doctinfo) 
	})
	.catch(function(error){
		console.log(error)
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Something went wrong..'
		  })
	})
});	


var dltid = {};
var edtid = {};
var doctid = {};

app.controller('DoctAppointController',function($scope,$http,$window,$state){
	$scope.doctappoint = [];
	$http.get(api + 'getunapproved/', {
		withCredentials	: true
	})
	.then(function(response){
		console.log(response);
		$scope.doctappoint = response.data
		console.log($scope.doctappoint) 
	})
	.catch(function(error){
		console.log(error)
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Something went wrong..'
		  })
	})

	$scope.accept = function(appoint){

		doctid = appoint.doctor;
		var success = {appointment_id : appoint.pk}

		$http.post(api + 'confirmappointment/', success, {
			withCredentials	: true
		})
		.then(function(response){
			console.log(response)
			Swal.fire({
				icon: 'success',
				title: 'Done...',
				text: 'Appointment Approved'
			  })
			  $state.reload('DoctorDashboard.DoctAppoint')
		})
		.catch(function(error){
			console.log(error)
		})
	}
	$scope.reject = function(appoint){
		dltid = appoint.pk
	}

	$scope.edit = function(appoint){
		edtid = appoint.pk
		var id = {doctor_id : appoint.doctor}
		console.log(id)
		$http.get(api + 'slots/' , {params : id,
		withCredentials: true
	   })
	   .then(function (response) {
		console.log(response);
		$scope.slot = response.data;	
	})
	}
});

	app.service('SharedDataService', function () {
		this.reasonInput = ""; // Initialize the shared variable
	});

	app.controller('ModalDeleteController', function ($scope, $http, $window, $state, SharedDataService) {
		$scope.reasonInput = ""; 
		$scope.reasonInput = SharedDataService.reasonInput;

		$scope.submit = function() {
		  var data = {
			appointment_id: dltid,
			reason: $scope.reasonInput, 
		  };
	  console.log(data)
		  $http.delete(api + 'confirmappointment/',{params : data ,
			withCredentials : true
		  }) 
			.then(function (response) {
			  console.log(response);
			  Swal.fire({
				icon: 'success',
				title: response.data.statusText,
				text: response.data.message
			  });
			  $scope.reasonInput = "";
			  $state.reload('Dashboard.Appointment')
			})
			.catch(function (error) {
			  console.log(error);
			});

			SharedDataService.reasonInput = "";
		};
  });

  app.service('SharedData2Service', function () {
	this.date = "";
	this.time = "";
	this.reason = ""; 
});

  app.controller('Modal2Controller', function ($scope, $http, $window, $state, SharedData2Service) {
	$scope.reason = ""; 
	$scope.reason = SharedData2Service.reason;
	
	$scope.updateDate = function () {
		var selectedDate = $scope.date;
		if (selectedDate) {
			var year = selectedDate.getFullYear();
			var month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
			var day = selectedDate.getDate().toString().padStart(2, '0');
			$scope.date = year + '-' + month + '-' + day;
		} else {
			$scope.date = null;
		}
	};

	$scope.submit = function () {

	  var data = {
		appointment_id: edtid,
		new_appointmentDate: $scope.date, 
		new_time : $scope.time,
		reason : $scope.reason
	  };
      console.log(data)
	  $http.put(api + 'confirmappointment/', data, {
		withCredentials : true
	  })
		.then(function (response) {
		  console.log(response);
		  Swal.fire({
			icon: 'success',
			title: 'Edited...',
			text: response.data.message
		  });
		  $state.reload('Dashboard.Appointment')
		})
		.catch(function (error) {
		  console.log(error);
		});

		SharedData2Service.time = "";
		SharedData2Service.date = "";
	};
});

app.service('SharedData3Service', function () {
	this.testes = " "; // Initialize the shared variable
});

app.controller('ModalRecordController', function ($scope) {    
});

var appointid = {};

app.controller('DoctRecordController',function($scope,$http,$window,$state,SharedData3Service){
	$scope.doctrecord = [];
	$scope.press = [];

	$http.get(api + 'getapproved/', {
		withCredentials	: true
	})
	.then(function(response){
		console.log(response)
		$scope.doctrecord = response.data
		console.log($scope.doctrecord)

		$scope.prescribed  = function(record){

			appointid = record.pk
			var ids = {id : record.patient_id}
            console.log(ids)

				$http.get(api + 'getmedicalhistory/',{params : ids,
				withCredentials:true
			    })
			    .then(function(response){
			    	console.log(response)
				   $scope.press = response.data
				   console.log($scope.press)


				$http.get(api + 'tests/',{
					withCredentials:true
				})
				.then(function(response){
					console.log(response.data)
					$scope.tests = response.data
				})

                $scope.testrep = SharedData3Service.testes;

				$scope.contacts = [];
                $scope.medicine = "";
				$scope.quantity = "";
				$scope.dosage = "";
                $scope.timing = "";
				$scope.prescribed = {}

                $scope.addfield = function(){
                    $scope.contacts.push({
					    // test : $scope.reporttest, 
						doctor_id : record.doctor_id,
						patient_id : record.patient_id,
						medicine: $scope.medicine,
						quantity: $scope.quantity,
						dosage: $scope.dosage,
						timing: $scope.timing
					});
					$scope.medicine = "";
					$scope.quantity = "";
                    $scope.dosage = "";
                    $scope.timing = "";
                 };

                $scope.removeContactField = function(index){ 
                    $scope.contacts.splice(index, 1);
                };

	            $scope.submit = function() {
	              var data = {
					appointment_id : appointid,
					prescribed : $scope.contacts
	              };

                 console.log(data)
				 $http.post(api + 'prescribe/',data, {
					withCredentials: true
				 })
				 .then(function(response){
					console.log(response)
					$scope.press = response.data
					console.log($scope.press)
					Swal.fire({
						icon: 'success',
						title: response.statusText,
						text: response.data.message
						});
				 })
				 .catch(function(error){
					console.log(error)
					Swal.fire({
						icon: 'error',
						title: 'cancel...',
						text: error.data.message
					  })
					})
	            }

			})
			.catch(function(error){
				console.log(error)
				Swal.fire({
					icon: 'error',
					title: 'cancel...',
					text: 'Error'
				  })
				})
		}

		
	})
	.catch(function(error){
		console.log(error)
		Swal.fire({
			icon: 'error',
			title: 'cancel...',
			text: error.data.message
		  })
		})

		
});		
app.controller('Modal3Controller', function ($scope, $http, $window, $state) {    
});

app.controller('DoctCheckedPatientController',function($scope,$http,$window,$state){
	$scope.records = [];

	$http.get(api + 'checkedpatient/', {
		withCredentials: true
	})
	.then(function(response){
		console.log(response.data)
		$scope.records = response.data

		$scope.view = function(record) {
			$scope.prescription = [];

			var data = {
				patient_id : record.patient,
				// doctor_id : record.doctor,
				prescription_date : record.checkup_date
			}
			console.log(data);

		$http.post(api + 'viewprescription/',data, {
			withCredentials: true
		})
		.then(function (response) {
			console.log(response);
			$scope.prescription = response.data
			console.log($scope.prescription)
			})
			.catch(function (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'Error...',
				text: error.data.message
				});
			});
		}

		$scope.downloadpresc = function () {
		
			const printContent = document.getElementById("pdfdownload");
            // const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
            // WindowPrt.document.write(printContent.innerHTML);
            // WindowPrt.document.close();
            // WindowPrt.focus();
            // WindowPrt.print();
            // WindowPrt.close();
			const blob = new Blob([printContent.innerHTML], { type: "text/html" });

			const url = URL.createObjectURL(blob);
		
			const newTab = window.open(url, "_blank");
		
			newTab.focus();
			newTab.print();
		  };
		});							
  })

                            //*****  RECEPTIONIST   ******//

app.controller('RecepDashboardController',function($scope,$http,$window,$state){
	$scope.paneled = [];

	$http.get(api + 'getpanel/',{
		withCredentials:true
	})
	.then(function (response) {
		console.log(response);
		$scope.paneled = response.data
		console.log($scope.paneled)
	  })
	  .catch(function (error) {
		console.log(error);
		Swal.fire({
			icon: 'error',
			title: 'Wrong...',
			text: 'Something went wrong'
		  });
	  });

	  $scope.logout = function(){
		$http.get(api+'logout/',{
			withCredentials: true
		})
		.then(function(response){
			console.log(response);
			Swal.fire({
				icon: 'success',
				title: response.statusText,
				text: response.data.message
			  })
			$state.go('Login')
		})
		.catch(function(error){
			console.log(error);
		})
	}
});	

var doctorid = {};
app.controller('RecepDoctorController',function($scope,$http,$window,$state){
	$scope.doctor = [];

	$http.get(api + 'availdoctors',{
		withCredentials:true
	})
	.then(function(response){
		console.log(response)
		$scope.doctor = response.data;
		console.log($scope.doctor)
	})
	.catch(function(error){
		console.log(error)
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Something went wrong..'
		  })
	})

	$scope.view = function(doctors){
		// doctorid = doctors.user
			$scope.modal = [];
		
			var id = {doctor_id : doctors.pk}
			console.log(id)
			$http.get(api + 'doctorfulldetail/', {params : id , 
			withCredentials:true
			 })
			 .then(function(response){
				console.log(response)
				$scope.modal = response.data;
				console.log($scope.modal)
			})
			.catch(function(error){
				console.log(error)
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Something went wrong..'
				  })
			})
		
	}

});	

var dltid = {};
app.controller('RecepAppointController',function($scope,$http,$window,$state){

	$scope.appoints= [];
	$scope.searchText = " ";

		$http.get(api + 'getpatientappointment/',{
			withCredentials:true
		})
		.then(function(response){
			console.log(response)
			$scope.appoints = response.data;
			console.log($scope.appoints)
		})
		.catch(function(error){
			console.log(error)
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong..'
			  })
		})

	$scope.accept = function(appoint){
		var confirmed = {
			appointment_id : appoint.pk,
			rApproval : 1
		}
		 console.log(confirmed)
		$http.post(api + 'approveappointment/', confirmed, {
			withCredentials	: true
		})
		.then(function(response){
			console.log(response)
			Swal.fire({
				icon: 'success',
				title: 'Done...',
				text: 'Appointment Approved'
			  })
			  $state.reload('RecepDashboard.Appointment')
		})
		.catch(function(error){
			console.log(error)
			Swal.fire({
				icon: 'error',
				title: 'Something Wrong...',
				text: "Error"
			  })
		})
	}

	$scope.reject = function(appoint){
		dltid = appoint.pk
	}

	$scope.export = function () {
		const table = document.getElementById('recepappoint');

		const doc = document.createElement('table');
		doc.innerHTML = table.outerHTML;

		const blob = new Blob(['\ufeff', doc.outerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

		const url = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'Records.xlsx';
		document.body.appendChild(a);
		a.click();

		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};
});


app.service('SharedDataService', function () {
	this.reasonInput = ""; 
});

app.controller('ModalController', function ($scope, $http, $window, $state, SharedDataService) {
	$scope.reasonInput = ""; 
	$scope.reasonInput = SharedDataService.reasonInput;

	$scope.submit = function (appoint) {
	  var data = {
		appointment_id : dltid,
		reason : $scope.reasonInput, 
	  };
  console.log(data)
	  $http.delete(api + 'approveappointment/',  { data, 
		withCredentials : true
	  })
		.then(function (response) {
		  console.log(response);
		  Swal.fire({
			icon: 'success',
			title: 'Rejected...',
			text: response.data.message
		  });
		  $scope.reasonInput = "";
		  $state.reload('RecepDashboard.Appointment')

		})
		.catch(function (error) {
		  console.log(error);
		});

		SharedDataService.reasonInput = "";
	};
});

app.service('SharedData2Service', function () {
this.date = "";
this.time = "";
this.reason = ""; 
});

app.controller('RecepRecordController', function ($scope, $http, $window, $state) {
   $scope.records = [];

   $http.get(api + 'checked/', {
	withCredentials : true
   })
   .then(function (response) {
	console.log(response);
	$scope.records = response.data
	console.log($scope.records)
    })
    .catch(function (error) {
	console.log(error);
	Swal.fire({
		icon: 'error',
		title: 'Error...',
		text: 'Something went wrong'
		});
    });
	$scope.exportToExcel = function () {
		const table = document.getElementById('RecordTable');

			const doc = document.createElement('table');
			doc.innerHTML = table.outerHTML;

			const blob = new Blob(['\ufeff', doc.outerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

			const url = window.URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'Records.xlsx';
			document.body.appendChild(a);
			a.click();

			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
	   }
})

app.controller('RecepPatientController', function ($scope, $http, $window, $state) {
	$scope.patient = [];
	$scope.records = [];

	$http.get(api + 'availdoctors/', {
		withCredentials : true
	})
	.then(function (response) {
		console.log(response);
		$scope.records = response.data
		console.log($scope.records)

		$scope.show = function(doctors){
			var id = { doctor_id : doctors.pk}
			console.log(id)
			   $http.get(api + 'ptunderdoct/', {params : id ,
			   withCredentials: true
				})
				.then(function (response) {
					console.log(response);
					$scope.patient = response.data
					console.log($scope.patient)
				})
				.catch(function(error){
					console.log(error)
					Swal.fire({
						icon: 'error',
						title: 'Error...',
						text: 'Something went wrong'
						});
				})
			  }
		})
		.catch(function (error) {
		console.log(error);
		Swal.fire({
			icon: 'error',
			title: 'Error...',
			text: 'Something went wrong'
			});
		});
});

                           //*********  PRESCRIPTION  *****//

    app.controller('PrescriptionsController', function ($scope, $http) {
        $scope.doctors = [];

		$http.get(api + 'getprescription/', {
			withCredentials:true
		})
		.then(function (response) {
			console.log(response.data);
			$scope.doctors = response.data
			
		})
		.catch(function (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'Error...',
				text: error.data.message
				});
		})
		$scope.prescription=[];

		$scope.view = function(doctor) {
			$scope.prescription = [];

			var data = {
				patient_id : doctor.patient,
				doctor_id : doctor.doctor,
				prescription_date : doctor.checkup_date
			}
			console.log(data);

		$http.post(api + 'generateprescription/',data, {
			withCredentials: true
		})
		.then(function (response) {
			console.log(response);
			$scope.prescription = response.data
			console.log($scope.prescription)
			})
			.catch(function (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'Error...',
				text: error.data.message
				});
			});
		}

		$scope.downloadpresc = function () {
		
			const printContent = document.getElementById("pdfdownload");
            // const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
            // WindowPrt.document.write(printContent.innerHTML);
            // WindowPrt.document.close();
            // WindowPrt.focus();
            // WindowPrt.print();
            // WindowPrt.close();
			const blob = new Blob([printContent.innerHTML], { type: "text/html" });

			const url = URL.createObjectURL(blob);
		
			const newTab = window.open(url, "_blank");
		
			newTab.focus();
			newTab.print();
		  };
		});

		app.controller('MedicalController', function ($scope, $http, $window, $state) {

			$scope.submit = function(){
				var report = {
					height : $scope.height,
					weight : $scope.weight,
					blood_group : $scope.blood_group,
					smoker : $scope.smoker,
					alcoholic : $scope.alcoholic
				}
				console.log(report)

			$http.post(api + 'medicalhistory/', report,{
				withCredentials:true
			})
			.then(function (response) {
				console.log(response);
				Swal.fire({
					icon: 'success',
					title: 'Done...',
					text: response.data.message
					});
		    })
			.catch(function (error) {
				console.log(error);
				Swal.fire({
					icon: 'error',
					title: 'Error...',
					text: error.data.message
					});
			})
	     }
    })

                    //****  PAYMENT   *****//

	app.controller('PaymentController', function ($scope, $http, $sce, $window, $state) {

		$scope.pdf = [];
       var data = { appointment_id: 1 };

        $http.get(api + 'generatepdf/', {
            params: data,
        	headers: {'Content-Type': undefined},
            withCredentials: true
        })
        .then(function(response) {
        console.log(response);
        $scope.pdf = response.data;
	    $scope.show = function() {
    
	    	$scope.htmlContent = $sce.trustAsHtml(response.data);
	    		}
        })
        .catch(function(error) {
        console.log(error);
        });
	})