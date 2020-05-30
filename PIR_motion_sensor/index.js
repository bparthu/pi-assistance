const Gpio = require('onoff').Gpio; // Gpio class
const LCD = require('raspberrypi-liquid-crystal');

const lcd = new LCD(1, 0x27, 16, 2);
lcd.beginSync();
await lcd.printLine(0, 'Status')
await lcd.printLine(1, 0)
const led = new Gpio(17, 'out');       // Export GPIO17 as an output
const msensor = new Gpio(22, 'in', 'both');
let stopSystem = false;
 
// Toggle the state of the LED connected to GPIO17 every 200ms
const blinkLed = _ => {
  if (stopSystem) {
    led.unexport();
    msensor.unexport();
    lcd.noDisplay()
    return;
  }
 
  led.read()
    .then(value => led.write(value ^ 1))
    .then(_ => setTimeout(blinkLed, 200))
    .catch(err => console.log(err));
};

msensor.watch(async (err, value) => {
  console.log(value)
  await lcd.printLine(0, 'Status')
  await lcd.printLine(1, value)
})
process.on('SIGINT', _ => {
  //console.log('releasing resources')
  //msensor.unexport();
  //console.log('resources released')
});

blinkLed();
 
// Stop blinking the LED after 5 seconds
setTimeout(_ => stopSystem = true, 15000);