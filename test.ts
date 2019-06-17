// go round
input.onButtonPressed(Button.A, () => {
    WEMOS_Motor_Shield.motorOn(WEMOS_Motor_Shield.Address.Address0x30, WEMOS_Motor_Shield.Motors.MotorA, WEMOS_Motor_Shield.MotorDirection.Forward, 100);
    WEMOS_Motor_Shield.motorOn(WEMOS_Motor_Shield.Address.Address0x30, WEMOS_Motor_Shield.Motors.MotorB, WEMOS_Motor_Shield.MotorDirection.Reverse, 100);
})
// go forward
input.onButtonPressed(Button.B, () => {
    WEMOS_Motor_Shield.motorOn(WEMOS_Motor_Shield.Address.Address0x30, WEMOS_Motor_Shield.Motors.MotorA, WEMOS_Motor_Shield.MotorDirection.Reverse, 100);
    WEMOS_Motor_Shield.motorOn(WEMOS_Motor_Shield.Address.Address0x30, WEMOS_Motor_Shield.Motors.MotorB, WEMOS_Motor_Shield.MotorDirection.Forward, 100);
})
// stop
input.onButtonPressed(Button.AB, () => {
    WEMOS_Motor_Shield.motorOff(WEMOS_Motor_Shield.Address.Address0x30, WEMOS_Motor_Shield.Motors.MotorA);
    WEMOS_Motor_Shield.motorOff(WEMOS_Motor_Shield.Address.Address0x30, WEMOS_Motor_Shield.Motors.MotorB);
})