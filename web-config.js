#!/usr/bin/env node
"strict mode";
"esversion:6";
/*jshint esversion: 6 */

module.exports.serverSettings = {
	sessionAttr:{
		secret: 'keyboard cat',
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false, maxAge: 60000 }
	}
};

module.exports.app = {
	enableSSL:false,
	port:3000,
	appStage:true, // true for development and false for live
	httpsCert : {
		cert: './certificates/certificate.pem',
		key: './certificates/privatekey.pem',
	},
	GoogleGeoCodeUrl:'/maps/api/geocode/json?latlng=',
	GCMmapKey:'&key=AIzaSyBHCWVNcAX1oFJaI4aK9AI-pUOwT0lN4yU',
	GcmOptions :{
			host:'maps.googleapis.com',path:''
	}
}
