/*Google Map*/
var inputA = (document.getElementById('start'));
var inputB = (document.getElementById('end'));

function initMap() {
    var map;
    var autocomplete;
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    /*Skapar Google Map*/
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 62.985,
            lng: 16.445
        },
        zoom: 5
    });
    directionsDisplay.setMap(map);
    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    directionsDisplay.addListener('directions_changed', function () {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    /* A med autocomplete*/
    //  var inputA = (document.getElementById('start'));

    var autocomplete = new google.maps.places.Autocomplete(inputA);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    /*  var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      })*/
    ;

    autocomplete.addListener('place_changed', function () {

        infowindow.close();
        // marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }
        marker.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        //  marker.setPosition(place.geometry.location);
        //  marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map /*, marker*/ );
    });

    /*B med autocomplete*/
    //  var inputB = (document.getElementById('end'));

    var autocomplete2 = new google.maps.places.Autocomplete(inputB);
    autocomplete2.bindTo('bounds', map);

    var infowindow2 = new google.maps.InfoWindow();
    /*var marker2 = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    })*/
    ;

    autocomplete2.addListener('place_changed', function () {
        infowindow2.close();
        // marker2.setVisible(false);
        var place2 = autocomplete2.getPlace();
        if (!place2.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place2.geometry.viewport) {
            map.fitBounds(place2.geometry.viewport);
        } else {
            map.setCenter(place2.geometry.location);
            map.setZoom(17);
        }
        marker2.setIcon(({
            url: place2.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        // marker2.setPosition(place2.geometry.location);
        // marker2.setVisible(true);

        var address2 = '';
        if (place2.address_components) {
            address2 = [
                (place2.address_components[0] && place2.address_components[0].short_name || ''),
                (place2.address_components[1] && place2.address_components[1].short_name || ''),
                (place2.address_components[2] && place2.address_components[2].short_name || '')
            ].join(' ');
        }
        infowindow2.setContent('<div><strong>' + place2.name + '</strong><br>' + address2);
        infowindow2.open(map /*, marker2*/ );
    });
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
}

var totalMiles;

/* Räknar ut avstånd i km från A --> B
   toFixed avrundar till 2 decimaltal*/

function computeTotalDistance(result, totalMiles) {

    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 10000;
    total = +total.toFixed(2); // ger två decimaler 
    document.getElementById('total').innerHTML = total + ' mil';
    totalMiles = total * 2;
    document.getElementById('totalMiles').innerHTML = totalMiles;
}

/* Visar vägsträckan på kartan */
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var valueA = document.getElementById('start').value;
    var valueB = document.getElementById('end').value;

    if (valueA != "" && valueB != "") {
        directionsService.route({
            origin: valueA,
            destination: valueB,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);        
            }
        });
    }
}


function calcTotal() {
    var days = document.getElementById('days').value; // antal dagar man kört
    var myTotalMiles = document.getElementById('totalMiles').innerHTML; // antal mil man kört
    var mileTax = 18.50; //milersättning
    var totalTax = 0.0; //totala summan
    var tax = 0.3; //30% av totalTax
    var totalX = 0; // summan som betalas tillbaka

    myTotalMiles = myTotalMiles * days; // Räknar ut antalet mil man kört totalt under året
    totalTax = myTotalMiles * mileTax;

    if (totalTax > 10000 && myTotalMiles > 2) {

        totalX = totalTax - 10000;
        totalX = totalX * tax;

        document.getElementById('result').innerHTML = "Du har kört " + myTotalMiles + " mil under året. Milersättningen blir " + totalTax.toFixed(2) + "kr som du ska ange till skatteverket. Sen drar skatteverket av 10.000kr och så får du tillbaka 30% av den summan vilket blir " + totalX.toFixed(2) + "kr";

    } else {
        document.getElementById('result').innerHTML = 'Ditt avdrag är på ' + totalTax.toFixed(2) + 'kr och är för lågt för att få göra avdrag. För restor till och från arbetet behöver avståndet vara minst 5km. Om det inte finns komunikationsmedel räcker det med 2km. Du får bara avdrag för den del som är överstiger 10.000kr.'
    }
}

/*Alltid lÃ¤ngst ned*/
window.addEventListener('load', initMap);
var button = document.getElementById("btnCalcTotal");
btnClac.addEventListener("click", calcTotal);