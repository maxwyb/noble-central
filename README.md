## noble-central
Transfer message from iOS (Bluetooth LE peripheral) to Intel Edison/Raspberry Pi (Bluetooth LE central): client-side Node.js program.  

[Peripheral app](https://github.com/maxwyb/CoreBluetooth-peripheral)

### Usage
1. (optional) install package `noble` in *current working directory*. Make sure Bluetooth module is enabled on both peripheral and central.
2. Run `sudo node test.sh | grep TRANSFER_SERVICE_UUID` to find out our desired device's id, which is random and may change everytime we run the peripheral app.
3. Run `sudo node test-mod.sh` waiting to read the message.
4. Run the peripheral app on client side.

### Known issues
1. Currently we use device's random ID to recognize the desired device, which is not a good practice.
2. After the iOS peripheral app starts broadcasting for a long time, there would be no services or characteristics discovered on central. Yet the device still shows up in `test.sh` even if we kill the peripheral app. Apparently there is some sort of undesired BLE cache of connected devices. To solve this: completely restart the peripheral app and central program, run `sudo node test.sh` again, and make sure the device's id changes. As the last resort, reboot the central.

### Resources
[Introduction to Bluetooth LE](https://github.com/tigoe/BLEDocs/wiki/Introduction-to-Bluetooth-LE)
[noble](https://github.com/sandeepmistry/noble)
[CBPeripheralManager - Apple](https://developer.apple.com/reference/corebluetooth/cbperipheralmanager)
[CBPeripheralManagerDelegate - Apple](https://developer.apple.com/reference/corebluetooth/cbperipheralmanagerdelegate)
