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
			makeMarker: function (rawCoords, map, data, title) {
				var animation = null;
				var position;
				var icon;

				if (rawCoords) {
					// raw data coordinates = [long, lat]
					position = new google.maps.LatLng(data.coords[1], data.coords[0]);
					title = data.name;
				} else {
					position = data;
					animation = google.maps.Animation.DROP;
				}

				if (data.category === 'Coffee Shop') {
					icon = 'img/coffee.png';
				} else if (data.category === 'Public') {
					icon = 'img/public.png';
				} else if (data.category === 'Hotel') {
					icon = 'img/hotel.png';
				} else if (data.category === 'Book Store') {
					icon = 'img/book.png';
				} else if (data.category === 'Other') {
					icon = 'img/other.png';
				} else {
					icon = 'img/other.png';
				}
				// FIND COSTANZA ICON

				var marker = new google.maps.Marker({
					position: position,
					title: title,
					map: map,
					icon: icon,
					animation: animation
				});
				return marker;
			}
		};
	}]);