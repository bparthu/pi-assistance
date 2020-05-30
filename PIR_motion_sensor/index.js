var gpio = require("gpio");
var gpio22, gpio4, intervalTimer;
 
// Flashing lights if LED connected to GPIO22
gpio22 = gpio.export(22, {
   ready: function() {
      intervalTimer = setInterval(function() {
         gpio22.set();
         setTimeout(function() { gpio22.reset(); }, 500);
      }, 1000);
   }
});


// reset the headers and unexport after 10 seconds
setTimeout(function() {
  clearInterval(intervalTimer);          // stops the voltage cycling
  gpio22.removeAllListeners('change');   // unbinds change event
  gpio22.reset();                        // sets header to low
  gpio22.unexport(() => {
    process.exit();
  });                     // unexport the header
}, 10000)