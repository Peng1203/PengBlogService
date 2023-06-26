import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'

@ValidatorConstraint({ name: 'custom', async: false })
export class IsArrayNumber implements ValidatorConstraintInterface {
  validate(
    value: number[],
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return value.every(item => typeof item === 'number')
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new Error('参数有误!')
  }
}
