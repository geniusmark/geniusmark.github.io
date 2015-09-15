// joystickExtension.js
// Shane M. Clements, November 2013
// Joystick Scratch Extension
//
// This is an extension for development and testing of the Scratch Javascript Extension API.

new (function() {
    var device = null;
    var input = null;
    var poller = null;
    var ext = this;

    ext._shutdown = function() {}

    ext._getStatus = function() {
        //if(!device) return {status: 1, msg: 'Controller disconnected'};
        return {status: 2, msg: 'Controller connected'};
    }

    // Converts a byte into a value of the range -1 -> 1 with two decimal places of precision
    function convertByteStr(byte) { return (parseInt(byte, 16) - 128) / 128; }
    ext.readUSB = function(name) {
        var retval = null;
        switch(name) {
            case 'leftX': retval = convertByteStr(input[12] + input[13]); break;
            case 'leftY': retval = -convertByteStr(input[14] + input[15]); break;
            case 'rightX': retval = convertByteStr(input[16] + input[17]); break;
            case 'rightY': retval = -convertByteStr(input[18] + input[19]); break;
        }

        // If it's hardly off center then treat it as centered
        if(Math.abs(retval) < 0.1) retval = 0;

        return retval.toFixed(2);
    }

    var descriptor = {
        blocks: [
            ['R', 'get CloudProfessor %m.USBPart', 'readUSB', 'getGPIO']
        ],
        menus: {
            USBPart: ['getGPIO', 'getArduino', 'getUSB', 'getPWM']
        }
    };
    ScratchExtensions.register('CloudProfessor', descriptor, ext, {type: 'hid', vendor:0x054c, product:0x0268});
})();
