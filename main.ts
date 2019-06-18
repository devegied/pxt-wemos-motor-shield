/**
 * Blocks for driving the WEMOS I2C Motor Shield
 */
//% weight=100 color=#00A654 icon="\uf1b6" block="Robotics"
//% groups='["Motors"]'
namespace WEMOS_Motor_Shield {
    // List of motors for the motor blocks to use.
    export enum Motors {
        //% block="Motor A"
        MotorA = 0,
        //% block="Motor B"
        MotorB = 1
    }

    // Directions the motors can rotate.
    export enum MotorDirection {
        //% block="Forward"
        Forward = 2,
        //% block="Reverse"
        Reverse = 1
    }

    // Shield I2C address
    export enum Address {
        //% block="Shield 0x30"
        Address0x30 = 3,
        //% block="Shield 0x2F"
        Address0x2F = 2,
        //% block="Shield 0x2E"
        Address0x2E = 1,
        //% block="Shield 0x2D"
        Address0x2D = 0
    }

    const address_base: number = 0x2D;
    let initalised: boolean[] = [false,false,false,false];
    let i2c_buf: Buffer = pins.createBuffer(3);
    const pwm_resolution: number = 9; // speed from 1 to 512
    const pwm_frequency: number = 15000;

    /**
     * low level function to send configuration commant to shield
     * Sets the MotorShield's PWM resolution and frequency
     * |  4 bit CMD |      4 bit |                    16 bit |
     * | config pwm | Resolution |             PWM Frequency |
     * |       0000 |       1010 |         00010011 10001000 | -> Set 10 bit resolution = 1024 steps and 5KHz Frequency
     */
    function sendCommandConfigurePWM(address: Address): void {
        i2c_buf[0] = pwm_resolution & 0x0F;
        i2c_buf[1] = pwm_frequency>>8;
        i2c_buf[2] = pwm_frequency;
        pins.i2cWriteBuffer(address_base+address, i2c_buf);
    }

    /**
     * low level function to send motor control commant to shield
     * Sets the motor's PWM duty cycle / pulse and direction
     * |       0001 |      4 bit |     4 bit |        12 bit |
     * |  set motor |      Motor | Direction |          Step |
     * |       0001 |       0001 |      0001 | 0010 00000000 | -> Set MotorB at step 512
     */
    function sendCommandSetMotor(address: Address, motor: Motors, direction: number, pwm_value: number): void {
        i2c_buf[0] = 0x10 | motor;
        i2c_buf[1] = ((direction << 4) | ((pwm_value >> 8) & 0x0F));
        i2c_buf[2] = pwm_value;
        pins.i2cWriteBuffer(address_base+address, i2c_buf);
    }

    /**
     * Initializes shield with particular I2C address
     * @param address shield I2C address
     */
    function init(address: Address): void {
        if (initalised[address] == false) {
            sendCommandConfigurePWM(address);
            initalised[address] = true;
        }
    }

    /**
     * Sets the requested motor on selected shield to run in chosen direction at a set speed.
     * @param motor which motor to turn on
     * @param dir   which direction to go
     * @param speed how fast to spin the motor
     */
    //% group=Motors
    //% blockId=wemos_motor_on
    //% block="Run %address|%motor|%dir|at %speed|\\%"
    //% inlineInputMode=inline
    //% weight=100 blockGap=8
    //% speed.min=0 speed.max=100
    export function motorOn(address: Address, motor: Motors, dir: MotorDirection, speed: number): void {
        init(address);
        if(speed==0)
            motorOff(address, motor);
        else{
            /*convert 1-100 to 1-512*/
            sendCommandSetMotor(address, motor, dir, Math.round(pins.map(speed, 1, 100, 5, 512)));
        }
    }

    /**
     * Turns off both motors of choosen shield by puting it into standby mode
     */
    //% group=Motors
    //% blockId=wemos_standby
    //% block="Turn off %address"
    //% inlineInputMode=inline
    //% weight=45 blockGap=8
    export function allOff(address: Address): void {
        init(address);
        sendCommandSetMotor(address, Motors.MotorA, 4/*STANDBY*/, 0);
    }

    /**
     * Lets the motor to stop smoothly
     * @param motor which motor to turn off
     */
    //% group=Motors
    //% blockId=wemos_motor_off
    //% block="Turn off %address|%motor"
    //% inlineInputMode=inline
    //% weight=65 blockGap=8
    export function motorOff(address: Address, motor: Motors): void {
        init(address);
        sendCommandSetMotor(address, motor, 5/*COAST*/, 0);
    }

    /**
     * Stops motor immediately by shorting pins
     * @param motor which motor to brake
     */
    //% group=Motors
    //% blockId=wemos_motor_brake
    //% block="Stop %address|%motor"
    //% inlineInputMode=inline
    //% weight=55 blockGap=8
    export function brakeMotor(address: Address, motor: Motors): void {
        init(address);
        sendCommandSetMotor(address, motor, 0/*BRAKE*/, 0);
    }
}