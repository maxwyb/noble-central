var noble = require('./index');

console.log('noble');

noble.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
	noble.startScanning();
    } else {
	noble.stopScanning();
    }
});

noble.on('scanStart', function() {
    console.log('on -> scanStart');
});

noble.on('scanStop', function() {
    console.log('on -> scanStop');
});


noble.on('discover', function(peripheral) {
    console.log('on -> discover: id = ' + peripheral.id);

    // register for listeners for every device scanned
    peripheral.on('connect', function() {
	console.log('on -> connect: connecting to a device, with localName: ' + peripheral.advertisement.localName);
	this.updateRssi();
    });

    peripheral.on('disconnect', function() {
	console.log('on -> disconnect: disconnecting a device, with localName: ' + peripheral.advertisement.localName);
    });

    peripheral.on('rssiUpdate', function(rssi) {
	console.log('on -> RSSI update: ' + peripheral.advertisement.localName + ' with RSSI: ' +  rssi);
	this.discoverServices();
    });

    peripheral.on('servicesDiscover', function(services) {
	console.log('on -> peripheral services discovered, for peripheral: ' + peripheral.advertisement.localName + '. Number of services: ' + services.length);
	// in our case of iOS peripheral data transfer, we find that the last service is actually the one we are broadcasting
	console.log('  The 11th service: ' + services[10]);

	var serviceIndex = 10;

	services[serviceIndex].on('includedServicesDiscover', function(includedServiceUuids) {
	    console.log('on -> service included services discovered ' + includedServiceUuids);
	    this.discoverCharacteristics();
	});

	services[serviceIndex].on('characteristicsDiscover', function(characteristics) {
	    console.log('on -> service characteristics discovered, for peripheral: ' + peripheral.advertisement.localName + ', for serviceIndex: ' + serviceIndex + '. Number of characteristics: ' + characteristics.length);
	    console.log('  characteristics: ' + characteristics);

	    // we need the 1st characteristic of the 11th service
	    var characteristicIndex = 0;

	    // automatically called when subscribed characteristics have update
	    characteristics[characteristicIndex].on('read', function(data, isNotification) {
		console.log('on -> characteristic read ' + data + ' ' + isNotification);
		console.log(data);

		//peripheral.disconnect();
	    });

	    characteristics[characteristicIndex].on('write', function() {
		console.log('on -> characteristic write ');

		//peripheral.disconnect();
	    });

	    characteristics[characteristicIndex].on('broadcast', function(state) {
		console.log('on -> characteristic broadcast ' + state);

		//peripheral.disconnect();
	    });

	    characteristics[characteristicIndex].on('notify', function(state) {
		console.log('on -> characteristic notify ' + state);

		//peripheral.disconnect();
	    });

	    characteristics[characteristicIndex].on('descriptorsDiscover', function(descriptors) {
		console.log('on -> descriptors discover ' + descriptors);

		var descriptorIndex = 0;

		descriptors[descriptorIndex].on('valueRead', function(data) {
		    console.log('on -> descriptor value read ' + data);
		    console.log(data);
		    //peripheral.disconnect();
		});

		descriptors[descriptorIndex].on('valueWrite', function() {
		    console.log('on -> descriptor value write ');
		    //peripheral.disconnect();
		});

		descriptors[descriptorIndex].readValue();
		//descriptors[descriptorIndex].writeValue(new Buffer([0]));
	    });


	    characteristics[characteristicIndex].read();
	    //characteristics[characteristicIndex].write(new Buffer('hello'));
	    //characteristics[characteristicIndex].broadcast(true);
	    //characteristics[characteristicIndex].notify(true);
	    //characteristics[characteristicIndex].discoverDescriptors();


	    // subscribe to max-iPhone's characteristic[0] of service[10]
	    /* using `subscribe` or `notify` functions are both fine
	    https://github.com/sandeepmistry/noble/issues/337
	    https://github.com/sandeepmistry/noble/issues/407
	    */
	    /*
	    characteristics[characteristicIndex].unsubscribe(function(error) {
		console.log("--> subscribe to characteristic. Error if any:  " + error);
	    });

	    characteristics[characteristicIndex].subscribe(function(error) {
		console.log("--> subscribe to characteristic. Error if any:  " + error);
	    });
	    */

	    characteristics[characteristicIndex].notify(true, function(error) {
		console.log("--> notify(subscribe) to characteristic. Error if any: " + error);
	    });
	    
	    characteristics[characteristicIndex].on('data', function(data, isNotification) {
		console.log("--> subscribed data have update: " + data);
	    });
	    
	});
	
	services[serviceIndex].discoverIncludedServices();
	
    });

    // FIXME: temporary way to find max-iPhone 
    if (peripheral.address == '59:de:d5:24:9f:75') {
	console.log("max-iPhone discovered. Peripheral information: " + peripheral)

	noble.stopScanning();

	console.log("peripheral.connect() invoked.");
	peripheral.connect();
    }

});

