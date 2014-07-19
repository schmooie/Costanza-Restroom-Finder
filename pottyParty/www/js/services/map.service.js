angular.module('pottyParty.services')
	.factory('mapFuncs', [function(){
		return {
			style: [
		    {
		        "featureType": "road",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "lightness": 100
		            },
		            {
		                "visibility": "simplified"
		            }
		        ]
		    },
		    {
		        "featureType": "water",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "visibility": "on"
		            },
		            {
		                "color": "#C6E2FF"
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "color": "#C5E3BF"
		            }
		        ]
		    },
		    {
		        "featureType": "road",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "color": "#D1D1B8"
		            }
		        ]
		    }
			],
			makeMarker: function (data, map) {
				var position = new google.maps.LatLng(data.coords[0], data.coords[1]);
				// var icon;
				// if (data.category === 'Coffee Shop') {

				// } else if (data.category === 'Public') {

				// } else if (data.category === 'Hotel') {

				// } else if (data.category === 'Book Store') {

				// } else (data.category === 'Other') {

				// }
				var marker = new google.maps.Marker({
					position: position,
					map: map,
					title: data.name
				});
			}
		};
	}]);