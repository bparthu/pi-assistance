const Gpio = require('onoff').Gpio; // Gpio class
const led = new Gpio(17, 'out');       // Export GPIO17 as an output
const msensor = new Gpio(22, 'in', 'both');
let stopBlinking = false;
 
// Toggle the state of the LED connected to GPIO17 every 200ms
const blinkLed = _ => {
  if (stopBlinking) {
    return led.unexport();
  }
 
  led.read()
    .then(value => led.write(value ^ 1))
    .then(_ => setTimeout(blinkLed, 200))
    .catch(err => console.log(err));
};

msensor.watch((err, value) => {
  console.log(value)
})
 
blinkLed();
 
// Stop blinking the LED after 5 seconds
setTimeout(_ => stopBlinking = true, 5000);