(
  async () => {
    const Gpio = require('onoff').Gpio; // Gpio class
    const LCD = require('raspberrypi-liquid-crystal');

    const lcd = new LCD(1, 0x27, 16, 2);
    lcd.beginSync();
    await lcd.printLine(0, 'Initialized')
    const led = new Gpio(17, 'out');       // Export GPIO17 as an output
    const msensor = new Gpio(22, 'in', 'both');

    const interval = setInterval(() => {
      led.read()
        .then(value => led.write(value ^ 1))
        .catch(err => console.log(err));
    })

    msensor.watch(async (err, value) => {
      console.log(value)
      await lcd.clear()
      await lcd.printLine(0, 'Status')
      await lcd.printLine(1, value)
    })

    process.on('SIGINT', _ => {
      clearInterval(interval)
      led.unexport();
      msensor.unexport();
      lcd.noDisplay()
    });
  }

)()