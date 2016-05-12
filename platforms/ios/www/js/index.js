/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
};
var watchID = null;
var watchPos = null;
var lat="";
var lng="";
var mapView="";
var selectedEmpl="";
var map;

$(document).ready(function () {
    $( "#sideMenu" ).enhanceWithin().panel();
    var model = getDeviceType();
    
    if (model =="iOS") {
        $(".iosHeader").css("display","block");
    }
    $(document).on("click", "#login", function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        var name = $("#userName").val();
        var pwd = $("#password").val();
        if (name == "") {
            showAlert(LOGIN_NAME_EMPTY);
        } else if (pwd == "") {
            showAlert(LOGIN_PASSWORD_EMPTY);
        } else {
            var data={
                name:name,
                password:pwd,
                mobile_code:HASH,
                from:"BO"
            }
            USER_NAME=name;
            USER_PASSWORD=pwd;
            callAjax("POST",LOGIN_URL,data,loginSuccess,"Y","Y");
        }
    });
    
    $(document).on("click", ".menuIcon", function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        $("#sideMenu").panel( "open" );
    });
    
    $(document).on("click", ".sideBarMenus", function(event) {
        var parent = $(this).attr('id');
        console.log(parent);
        if (parent == "toDoListSB") {
            $.mobile.changePage("homepage.html",{transition: "slide"});
        } else if (parent == "profileSB") {
            $.mobile.changePage("profile.html",{transition: "slide"});
        } else if (parent == "aboutSB") {
            $.mobile.changePage("about.html",{transition: "slide"});
        } else if (parent == "locationSB") {
            mapView="global";
            $.mobile.changePage("location.html",{transition: "slide"});
        } else if (parent == "closeSB") {
            $("#sideMenu").panel("close");
        } else if (parent == "logoutSB") {
            logout();
        }
    });
    
    $(document).on("pageinit", "#homePage", function(event) {
        $(document).on("click", ".emplyDetails", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            $.mobile.changePage("employeeDetail.html",{transition: "slide"});
        });
        
        $(document).on("click", ".seeMap", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            mapView="singel";
            selectedEmpl = $(this).attr("dataId");
            
            $.mobile.changePage("location.html",{transition: "slide"});
        });
        
        $(document).on("change", "#branchOption", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            var branch = $(this).val();
            if (branch!="") {
                var data = {
                    name:USER_NAME,
                    password:USER_PASSWORD,
                    mobile_code:HASH,
                    branch:branch
                }
                callAjax("POST",GETMEMBER_URL,data,getMember,"Y","Y");
            }
        });
        
        $(document).on("keyup", "#searchEmpl", function(event) {
            var key = $(this).val();
            var branch = $("#branchOption option:selected").val();
            if (branch!="") {
                $("#employeeListing > li").each(function() {
                    if ($(this).text().toLowerCase().search(key.toLowerCase()) > -1) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                    }
                });
            }
        });
    });
    $(document).on("pageshow", "#homePage", function(event) {
        generate.select(USER_BRANCH,"branchOption");
    });
    
    $(document).on("pageinit", "#employeePage", function(event) {
        $(document).on("click", ".backBtn", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            $.mobile.back();
        });
    });
    
    $(document).on("pageinit", "#locationPage", function(event) {
        if (mapView=="global") {
            $(".menuIcon").show();
            $(".backBtn").hide();
        } else {
            $(".menuIcon").hide();
            $(".backBtn").show();
        }
        $(document).on("click", ".backBtn", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            $.mobile.changePage("homepage.html",{transition: "slide", reverse:true});
        });
        
        $(document).on("change", "#branchOptionLocation", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            var branch = $(this).val();
            if (branch!="") {
                var data = {
                    name:USER_NAME,
                    password:USER_PASSWORD,
                    mobile_code:HASH,
                    branch:branch
                }
                callAjax("POST",GETMEMBER_URL,data,generateuserMap,"Y","N");
            }
        });
        
        $(document).on("click", ".employeeMarker", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            var latitude = $(this).attr("data-lat");
            var longitude = $(this).attr("data-lng");
            var latLng = new google.maps.LatLng(latitude, longitude);
            map.setCenter(latLng);
        });
    });
    
    $(document).on("pageshow", "#locationPage", function(event) {
        if (mapView=="global") {
            generate.select(USER_BRANCH,"branchOptionLocation");
            $("#branchLocation").show();
            $(".menuIcon").show();
            $(".backBtn").hide();
        } else {
            $(".menuIcon").hide();
            $(".backBtn").show();
            var data = {
                mobile_code: HASH,
                name: selectedEmpl
            }
            callAjax("POST",GET_TRACK_URL,data,singelMap,"Y","N");
        }
    });
    
});

function generateuserMap(res) {
    var listUser = {};
    var users = [];
    for(var i=0;i<res.count;i++) {
        var user = {};
        user.name = res.member[i].CN;
        users.push(user);
    }
    listUser.list_name = users;
    var paramUser = JSON.stringify(listUser);
    var data= {
        name: paramUser,
        mobile_code: HASH
    }
    
    setTimeout(function(){
        callAjax("POST",GET_LOCATION,data,realtimeMap,"N","Y");    
    },500);
}

function realtimeMap(res){
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("employeeMap"),mapOptions);
    
    
    // Multiple Markers
    var markers = [];
    var userList ="";
    // Info Window Content
    var infoWindowContent = [];
    
    for(var i=0;i<res.list_name.length;i++) {
        var singelMarker=[];
        var singelInfoWindow=[];
        singelMarker.push(res.list_name[i].name,res.list_name[i].latitude,res.list_name[i].longitude);
        markers.push(singelMarker);
        
        userList += '<li class="employeeMarker" data-lat="'+res.list_name[i].latitude+'" data-lng="'+res.list_name[i].longitude+'">'+res.list_name[i].name+'</li>';
        singelInfoWindow.push('<div class="info_content"><h3>'+res.list_name[i].name+'</h3><p>'+res.list_name[i].address+'</p></div>');
        infoWindowContent.push(singelInfoWindow);
    }
    
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: 'img/mitsuiMarker.png',
            title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        //this.setZoom(13);
        google.maps.event.removeListener(boundsListener);
    });
    
    $("#employeeMap").css("display","block");
    $("#employeeListing").html(userList);
    $("#employeeList").show();
}

function singelMap(res) {
    if (res.coords.length==0) {
        showAlertCallback(GET_TRACK_NULL,returnPage);
    }
    
    var mapOptions = {
      zoom: 3,
      center: {lat: 0, lng: -180},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("employeeMap"),mapOptions);
    
    var dHeight=$(document).height()-50;
    $("#employeeMap").css("height",dHeight+"px");
    var pathCoord = [];
    var modLength = Math.floor(res.coords.length / 8);
    var minWay = 0;
    var maxWay = 8;
    
    for(var i=0;i<=modLength+1;i++){
        wayPointGenerate(map, res,minWay,maxWay);
        minWay = minWay+7;
        maxWay = maxWay+7;
    }
    
    $("#employeeMap").css("display","block");
    loading.hide();
}

var stepDisplay;
var markerArray = [];
var infowindow = null;
var marker = null;

function wayPointGenerate(map, res,minWay,maxWay) {
    var pathCoord = [];
    // Multiple Markers
    var markers = [];
    // Info Window Content
    var infoWindowContent = [];
    var waypts=[];
    var bounds = new google.maps.LatLngBounds();
    
    if (maxWay>res.coords.length) {
        maxWay=res.coords.length-1;
    }
    
    for (var i=minWay;i<maxWay;i++){
        var latlngobj = {};
        latlngobj.lat = res.coords[i].latitude;
        latlngobj.lng = res.coords[i].longitude;
        pathCoord.push(latlngobj);
        
        var singelMarker=[];
        var singelInfoWindow=[];
        singelMarker.push("title",res.coords[i].latitude,res.coords[i].longitude);
        markers.push(singelMarker);
        var time = res.coords[i].datetime.date.split(".")[0];
        singelInfoWindow.push('<div class="info_content"><h4>'+selectedEmpl+'</h4><p><b>'+res.coords[i].address+'</b><br/>'+time+'</p></div>');
        infoWindowContent.push(singelInfoWindow);
    }
    
    var service = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers : true});
    
    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();

    directionsDisplay.setMap(map);

    for(j=1;j<pathCoord.length-1;j++){            
          waypts.push({location: pathCoord[j],stopover: true});
    }
    
    var request = {
        origin: pathCoord[0],
        destination: pathCoord[pathCoord.length-1],
        waypoints: waypts,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
      
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    //setTimeout(function(){
        service.route(request,function(result, status) {           
            if(status == google.maps.DirectionsStatus.OK) {
                //var warnings = document.getElementById("warnings_panel");
                //warnings.innerHTML = "<b>" + result.routes[0].warnings + "</b>";
    
                directionsDisplay.setDirections(result);
                //var leg = result.routes[ 0 ].legs[ 0 ];
                
                //showSteps(result,map);
            } else {
                console.log("Directions request failed:" +status);
            }
        });    
    //},500);
    
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        
        var iconMarker = "img/mitsuiMarker.png";
        console.log("MIN = "+minWay + " MAX = " + maxWay );
        if (i==0 && minWay==0) {
            console.log("MIN");
            iconMarker = "img/mitsuiMarkerBegin.png";
        } else if (i==markers.length-1 && maxWay==res.coords.length-1) {
            console.log(res.coords[maxWay].latitude +  "  " +res.coords[maxWay].longitude);
            iconMarker = "img/mitsuiMarkerEnd.png";
        }
        
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: iconMarker,
            title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        //this.setZoom(13);
        google.maps.event.removeListener(boundsListener);
    });
}

/**
 * Determine the mobile operating system.
 * This function either returns 'iOS', 'Android' or 'unknown'
 *
 * @returns {String}
 */
function getDeviceType() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
    {
      return 'iOS';
  
    }
    else if( userAgent.match( /Android/i ) )
    {
  
      return 'Android';
    }
    else
    {
      return 'unknown';
    }
};

function showAlert(content) {
    var restHtml= '     <div class="modal-dialog modal-sm">'+
                   '       <div class="modal-content">'+
                   '         <div class="modal-header">'+
                   '           <h4 class="modal-title">Mitsui Leasing</h4>'+
                   '         </div>'+
                   '         <div class="modal-body">'+
                   '           <p>'+content+'</p>'+
                   '         </div>'+
                   '         <div class="modal-footer">'+
                   '           <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                   '         </div>'+
                   '       </div>'+        
                   '     </div>';
    $("#mainModal").html(restHtml);
    $("#mainModal").modal('show');
}

function showAlertCallback(content,callback) {
    var restHtml= '     <div class="modal-dialog modal-sm">'+
                   '       <div class="modal-content">'+
                   '         <div class="modal-header">'+
                   '           <h4 class="modal-title">Mitsui Leasing</h4>'+
                   '         </div>'+
                   '         <div class="modal-body">'+
                   '           <p>'+content+'</p>'+
                   '         </div>'+
                   '         <div class="modal-footer">'+
                   '           <button type="button" class="btn btn-default" onclick="'+callback+'()" data-dismiss="modal">Close</button>'+
                   '         </div>'+
                   '       </div>'+        
                   '     </div>';
    $("#mainModal").html(restHtml);
    $("#mainModal").modal('show');
}

function logout() {
    $.mobile.changePage("index.html",{transition: "flip"});   
}

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function(position) {
    lat=position.coords.latitude;
    lng=position.coords.longitude;
    console.log(lat+" - "+lng);
    /*alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');*/
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function callAjax(method,url,data,callback,before,after) {
    $.ajax({
        type: method,
        url: url,
        data: data,
        crossDomain: true,
        timeout: AJAX_TIMEOUT_INT,
        beforeSend: function( xhr ) {
            if (before=="Y") {
                loading.show();   
            }
        },
        success: function (response) {
            if (PROFILE=="DEV") {
                response = $.parseJSON(response);   
            }
            console.log(response);
            if(response.status == 1) {
                callback(response);
            } else {
                $.mobile.loading('hide');
                showAlert(response.msg);
            }
            if (after=="Y") {
                loading.hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if(ajaxOptions === "timeout") {
                $.mobile.loading('hide');
                showAlert(AJAX_TIMEOUT);
            } else {
                $.mobile.loading('hide');
                showAlert(ajaxOptions);
            }
        }
    });
}

function loginSuccess(res) {
    if (res.status==1) {
        USER_BRANCH=res.branch;
        $.mobile.changePage("homepage.html",{transition: "flip"});
    }
}

function getMember(res) {
    console.log(JSON.stringify(res));
    var restHtml = "";
    for(var i=0;i<res.member.length;i++){
        restHtml+='<li class="employeeList">'+
                    '<div class="emplyProfilePic"><img src="img/icon-user-default.png"/></div>'+
                    '<div class="emplyDetails">'+
                    '<div class="emplyName">'+res.member[i].CN+'</div>'+
                    '<div class="currentTask">'+res.member[i].address+
                    '<br/>Telp: <a href="tel:'+res.member[i].phone_no+'">'+res.member[i].phone_no+'</a>'+
                    '</div>'+
                    '</div>'+
                    '<div class="seeMap" dataId="'+res.member[i].CN+'"><i class="fa fa-map-marker fa-2x"></i></div>'+
                    '<div class="clearfix clearBoth"></div>'+
                    '</li>';
    }
    $("#employeeListing").html(restHtml);
    $.mobile.loading('hide');
}


var generate = {
    select: function(res,fieldName) {
        var defv="-";
        var restHtml ='<select id="'+fieldName+'" name="'+fieldName+'">'+
                        '<option value="">Please select</option>';
        //for (var key in res) {
        for(var i=0;i<res.length;i++){
            if (res[i]==defv) {
                restHtml +="<option value='"+res[i]+"' selected>"+res[i]+"</option>";    
            } else {
                restHtml +="<option value='"+res[i]+"'>"+res[i]+"</option>";
            }
            
        }
        restHtml +="</select>";
        $("#"+fieldName+"_div .compRender").html(restHtml);
        $("#"+fieldName+"_div .compRender").selectmenu();
    }
}

var loading = {
    show: function() {
        $("#loadingModal").modal();
    },
    hide: function() {
        $("#loadingModal").modal('hide');
    }
}

function returnPage() {
    $.mobile.back();
}