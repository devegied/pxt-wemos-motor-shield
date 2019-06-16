# pxt-wemos-motor-shield

Custom blocks for [WEMOS I2C Motor Shield](https://wiki.wemos.cc/products:d1_mini_shields:motor_shield) for micro:bit. These shields can be bought from [AliExpress](https://www.aliexpress.com/wholesale?catId=0&SearchText=I2C+Motor+Shield+TB6612FNG) as cheap as 1.5€


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

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)

