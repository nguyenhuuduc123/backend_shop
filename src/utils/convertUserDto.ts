import { EditUserDto } from 'src/user/dtos/edit.user.dto';

export function convertUserDto(edit: EditUserDto) {
  return {
    email: edit.email != null ? edit.email : undefined,
    firstName: edit.firstName != null ? edit.firstName : undefined,
    lastName: edit.lastName != null ? edit.lastName : undefined,
    phoneNumber: edit.phoneNumber != null ? edit.phoneNumber : undefined,
    address: edit.address != null ? edit.address : undefined,
  };
}
