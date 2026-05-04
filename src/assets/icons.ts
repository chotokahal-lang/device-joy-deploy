import iconShield from "@/assets/icon-shield.png";
import iconCar from "@/assets/icon-car.png";
import iconMotor from "@/assets/icon-motor.png";
import iconPhone from "@/assets/icon-phone.png";
import iconScan from "@/assets/icon-scan.png";
import iconArchive from "@/assets/icon-archive.png";
import iconAdmin from "@/assets/icon-admin.png";
import iconUser from "@/assets/icon-user.png";
import iconLock from "@/assets/icon-lock.png";
import iconForm from "@/assets/icon-form.png";

export const icons3d = {
  shield: iconShield,
  car: iconCar,
  motor: iconMotor,
  phone: iconPhone,
  scan: iconScan,
  archive: iconArchive,
  admin: iconAdmin,
  user: iconUser,
  lock: iconLock,
  form: iconForm,
} as const;

export type Icon3DName = keyof typeof icons3d;
