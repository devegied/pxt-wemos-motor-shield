# pxt-wemos-motor-shield

Custom blocks for [WEMOS I2C Motor Shield](https://wiki.wemos.cc/products:d1_mini_shields:motor_shield) for micro:bit. These shields can be bought from [AliExpress](https://www.aliexpress.com/wholesale?catId=0&SearchText=I2C+Motor+Shield+TB6612FNG) as cheap as 1.5€

The shipped firmware with the Motor Shield is bugged. You need to update it with [danielfmo/wemos_motor_shield](https://github.com/danielfmo/wemos_motor_shield).

![Image of shield connection to micro:bit](https://github.com/devegied/pxt-wemos-motor-shield/blob/master/microbit_wemos_motor_shield_small.png?raw=true)

## Motors

This package contains a block for driving standard motors forwards and backwards, with a speed setting of 0-100%:
```blocks
WEMOS_Motor_Shield.motorOn(WEMOS_Motor_Shield.Motors.MotorA, WEMOS_Motor_Shield.MotorDirection.Forward, 10)
WEMOS_Motor_Shield.motorOn(WEMOS_Motor_Shield.Motors.MotorB, WEMOS_Motor_Shield.MotorDirection.Reverse, 100)
```
Individual motor outputs can also be turned off by cutting power
```blocks
WEMOS_Motor_Shield.motorOff(WEMOS_Motor_Shield.Motors.MotorA)
```
or by shorting motor contacts (for braking)
```blocks
WEMOS_Motor_Shield.brakeMotor(WEMOS_Motor_Shield.Motors.MotorA)
```
This package also contains block which turns off all motor outputs and leaves shield in standby mode:
```blocks
WEMOS_Motor_Shield.allOff()
```

## Settings

This package contains a block for setting I2C address of Motor Shield:
```blocks
WEMOS_Motor_Shield.init(WEMOS_Motor_Shield.Address.Address0x30)
```

## License

MIT

## Credits

Extension I2C bus code is based on the [WEMOS Motor Shield Arduino library](https://github.com/danielfmo/WEMOS_Motor_Shield_Arduino_Library) released by danielfmo.

Extension structure is based on the [Blocks for driving the Kitronik All-in-one Robotics Board](https://github.com/KitronikLtd/pxt-kitronik-robotics-board).

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)

