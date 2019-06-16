# pxt-wemos-motor-shield

Custom blocks for wiki.wemos.cc/products:d1_mini_shields:motor_shield WEMOS I2C Motor Shield for micro:bit

## Motors

This package contains a block for driving standard motors forwards and backwards, with a speed setting of 0-100%:
```blocks
WEMOS_Motor_Shield.motorOn(WEMOS_Motor_Shield.Motors.MotorA, WEMOS_Motor_Shield.MotorDirection.Forward, 10)
WEMOS_Motor_Shield.motorOn(WEMOS_Motor_Shield.Motors.MotorB, WEMOS_Motor_Shield.MotorDirection.Reverse, 100)
```
Individual motor outputs can also be turned off.
```blocks
WEMOS_Motor_Shield.motorOff(WEMOS_Motor_Shield.Motors.MotorA)
```
This package also contains an 'emergency stop' block which turns off all motor outputs at the same time:
```blocks
WEMOS_Motor_Shield.allOff()
```

## Settings

This package contains a block for setting I2C address of Motor Shield:
```blocks
WEMOS_Motor_Shield.init(WEMOS_Motor_Shield.Address.Address0x2D)
```

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)

