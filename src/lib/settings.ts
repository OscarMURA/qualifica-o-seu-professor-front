import { api } from "./api";

export interface ChangeEmailDto {
  newEmail: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const changeEmail = async (data: ChangeEmailDto): Promise<void> => {
  await api.patch("/users/me/email", data);
};

export const changePassword = async (data: ChangePasswordDto): Promise<void> => {
  await api.patch("/users/me/password", data);
};

export const deleteAccount = async (password: string): Promise<void> => {
  await api.delete("/users/me", { data: { password } });
};
