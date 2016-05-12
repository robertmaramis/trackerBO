var PROFILE="DEV",
SECRET="mitsui",
CODE="!@#$AppTracker*&^%",
HASH = CryptoJS.SHA1(CryptoJS.SHA1(SECRET)+CODE)+"",
AJAX_TIMEOUT_INT=60000,
AJAX_TIMEOUT="Failed connect to server, please try again later",
LOADING_MESSAGE="Please wait while your request is being process",
USER_EMAIL="",
USER_PASSWORD="",
USER_NAME="",
USER_BRANCH="";

//ERROR MESSAGE
var
LOGIN_NAME_EMPTY="Please fill your user name",
LOGIN_PASSWORD_EMPTY="Please fill your user password",
GET_TRACK_NULL="Failed to get location, please try again later";

if (PROFILE=="DEV") {
    var
    BASE_URL        ="";
    LOGIN_URL       =BASE_URL+"https://dl.dropboxusercontent.com/u/22201907/appTracker/BO/login.json",
    GETMEMBER_URL   =BASE_URL+"https://dl.dropboxusercontent.com/u/22201907/appTracker/BO/getMember.json",
    GET_TRACK_URL   =BASE_URL+"https://dl.dropboxusercontent.com/u/22201907/appTracker/BO/getTrack.json",
    GET_LOCATION    =BASE_URL+"https://dl.dropboxusercontent.com/u/22201907/appTracker/BO/getLocation.json";
} else {
    var
    BASE_URL        ="http://114.4.147.113"
    LOGIN_URL       =BASE_URL+"/mitsui/index.php/login",
    GETMEMBER_URL   =BASE_URL+"/mitsui/index.php/get_members",
    GET_TRACK_URL   =BASE_URL+"/mitsui/index.php/get_track",
    GET_LOCATION    =BASE_URL+"/mitsui/index.php/realtime_track";
}