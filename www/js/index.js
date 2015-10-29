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
            showAlert("Please fill your user name");
        } else if (pwd == "") {
            showAlert("Please fill your user password");
        } else {
            $.mobile.changePage("homepage.html",{transition: "flip"});
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
            $.mobile.changePage("location.html",{transition: "slide"});
        });
    });
    
    $(document).on("pageinit", "#employeePage", function(event) {
        $(document).on("click", ".backBtn", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            $.mobile.changePage("homepage.html",{transition: "slide", reverse:true});
        });
    });
    
    $(document).on("pageinit", "#locationPage", function(event) {
        $(document).on("click", ".backBtn", function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            $.mobile.changePage("homepage.html",{transition: "slide", reverse:true});
        });
    });
    
    $(document).on("pageshow", "#locationPage", function(event) {
        if (mapView=="global") {
            realtimeMap();
            $("#employeeList").show();
        } else {
            singelMap();
        }
    });
    
});

function realtimeMap(){
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("employeeMap"),mapOptions);
    
    
    // Multiple Markers
    var markers = [
        ['Sudirman', -6.191906,106.822944],
        ['Matraman', -6.197538,106.856074],
        ['Mampang', -6.256838,106.828008]
    ];
    
    // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>Robert Maramis</h3>' +
        '<p>Jln Sudirman</p>'+
        '</div>'],
        ['<div class="info_content">' +
        '<h3>Bryan</h3>' +
        '<p>Jln Matraman</p>' +
        '</div>'],
        ['<div class="info_content">' +
        '<h3>Sulis</h3>' +
        '<p>Jln Mampang</p>' +
        '</div>']
    ];
    
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
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

function singelMap() {
    var dHeight=$(document).height()-50;
    $("#employeeMap").css("height",dHeight+"px");
    var mapOptions = {
      zoom: 3,
      center: {lat: 0, lng: -180},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("employeeMap"),mapOptions);
    
    var pathCoord = [
            {lat:-6.192414, lng:106.823453},
            {lat:-6.193278, lng:106.823142},
            {lat:-6.191849, lng:106.822885},
            {lat:-6.189907, lng:106.822820},
            {lat:-6.183511, lng:106.822836},
            {lat:-6.171607, lng:106.822708},
            {lat:-6.155692, lng:106.817987},
            {lat:-6.147286, lng:106.816056}
        ];
    
    var service = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();    
    directionsDisplay.setMap(map);
    
    var waypts = [];
    for(j=1;j<pathCoord.length-1;j++){            
          waypts.push({location: pathCoord[j],
                       stopover: true});
    }
    
    var request = {
        origin: pathCoord[0],
        destination: pathCoord[pathCoord.length-1],
        waypoints: waypts,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
    service.route(request,function(result, status) {           
        if(status == google.maps.DirectionsStatus.OK) {                 
              directionsDisplay.setDirections(result);
        } else { alert("Directions request failed:" +status); }
    });
    
    /*
    var myLatlng = new google.maps.LatLng(lat, lng);
    */ 
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