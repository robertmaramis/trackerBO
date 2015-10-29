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
    }
};
var watchID = null;
var watchPos = null;
var lat="";
var lng="";

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
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        console.log(lat+" - "+lng);
        var myLatlng = new google.maps.LatLng(lat, lng);
        var mapOptions = {
          zoom: 8,
          center: myLatlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("employeeMap"),
            mapOptions);
    });
    
});

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